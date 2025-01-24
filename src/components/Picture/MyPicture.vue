<template>
  <div>
    <div style="margin-left: 10px">나의 사진</div>
    <div
      class="pictureContainer"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'is-dragging': isDragging }"
    >
      <PictureUpload />
      <div v-if="!files.length && !uploadedImages.length" class="pictureFont">
        클릭 혹은 파일을 이곳에 드롭하세요.
      </div>
    </div>
    <div class="fileContainer">
      <input
        type="file"
        multiple
        @change="onFileChange"
        style="margin-left: 15px"
      />
      <div v-if="files.length">
        <div v-for="(file, index) in files" :key="index" class="fileFont">
          {{ file.name }}
        </div>
      </div>
    </div>

    <div class="uploadBtn" style="cursor: pointer" @click="uploadPhoto">
      <div>업로드</div>
    </div>
    <div style="margin-left: 5px">등록된 사진</div>

    <div class="uploadedImages">
      <b-container class="bv-example-row">
        <b-row>
          <b-col
            v-for="(image, index) in uploadedImages"
            :key="index"
            cols="6"
            class="uploadedImage"
          >
            <img :src="image" alt="Uploaded Image" />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import PictureUpload from "../../assets/icons/PictureUploadIcon.svg";
import { onMounted, ref } from "vue";
import axios from "axios";
import { PropType } from "vue";
import { computed } from "vue";

interface Place {
  title: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}
interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}
export default {
  name: "MyPictureComponent",
  components: {
    PictureUpload,
  },
  props: {
    detail: {
      type: Array as PropType<Place[]>,
      required: true,
    },
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
  },

  setup(props) {
    const isDragging = ref(false);
    const files = ref<File[]>([]);
    const uploadedImages = ref<string[]>([]);
    const placeName = computed(() =>
      props.detail[0]?.title.replace(/<\/?[^>]+(>|$)/g, "")
    );
    const id = computed(() => props.userData.id);
    const galleryImages = ref<string[]>([]); // 장소 검색 결과 이미지

    const onDragOver = () => {
      isDragging.value = true;
    };
    const onDragEnter = () => {
      isDragging.value = true;
    };
    const onDragLeave = () => {
      isDragging.value = false;
    };
    const onDrop = (event: DragEvent) => {
      isDragging.value = false;
      if (event.dataTransfer) {
        const droppedFiles = Array.from(event.dataTransfer.files);
        const uniqueFiles = droppedFiles.filter(
          (file) =>
            !files.value.some((existingFile) => existingFile.name === file.name)
        );
        files.value.push(...uniqueFiles);
      }
    };

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const newFiles = Array.from(target.files).filter(
          (file) =>
            !files.value.some((existingFile) => existingFile.name === file.name)
        );
        files.value.push(...newFiles);
      }
    };
    const fetchGallery = async (placeName: string, id: number) => {
      console.log("placeName:", placeName);
      console.log("id:", id);
      try {
        const response = await axios.get(
          "http://localhost:3000/gallery/select",
          {
            params: { place: placeName, userId: id },
          }
        );
        console.log(response.data);
        if (response.data && response.data.images) {
          const imageUrl = `http://localhost:3000/uploads${response.data.images}`;
          console.log("이미지 경로 추가:", imageUrl);

          uploadedImages.value.push(imageUrl); // 검색된 이미지 추가
          console.log("galleryImages 상태:", galleryImages.value);
        } else {
          alert("해당 장소에 대한 이미지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("이미지 검색 실패:", error);
        alert("이미지 검색 실패");
      }
    };
    const uploadPhoto = async () => {
      if (!files.value.length) {
        alert("파일을 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("id", id.value);
      formData.append("place", placeName.value);
      formData.append("lon", props.detail[0]?.mapx);
      formData.append("lat", props.detail[0]?.mapy);
      files.value.forEach((file) => {
        formData.append("images", file);
      });

      try {
        const response = await axios.post(
          "http://localhost:3000/gallery/insert",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        if (response.status === 201) {
          alert("업로드 성공!");
          const imageUrl = `http://localhost:3000/uploads${response.data.imageUrl}`;
          uploadedImages.value.push(imageUrl);
          files.value = [];
          console.log(placeName.value, id.value);
          await fetchGallery(placeName.value, id.value);
        }
      } catch (error) {
        console.error(error);
        alert("업로드 실패");
      }
    };
    onMounted(async () => {
      console.log("컴포넌트 마운트 시 fetchGallery 호출");
      await fetchGallery(placeName.value, id.value);
    });

    return {
      isDragging,
      files,
      uploadedImages,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onFileChange,
      uploadPhoto,
    };
  },
};
</script>

<style>
.pictureContainer {
  background-color: #fcfcfc;
  width: 95%;
  height: 200px;
  margin: 10px;
  border: 2px dashed #b6b6b6;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.pictureContainer.is-dragging {
  background-color: #e0f7fa;
  border-color: #00bcd4;
}
input {
  margin-left: 10px;
}
.uploadBtn {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}
.uploadBtn div {
  background-color: #f6f6f6;
  width: 100px;
  text-align: center;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
}
.uploadedImages {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
}
.uploadedImage img {
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
