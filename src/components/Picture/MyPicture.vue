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

      <div v-if="!files.length" class="pictureFont">
        클릭 혹은 파일을 이곳에 드롭하세요.
      </div>
    </div>
    <div class="fileContainer">
      <input type="file" />
      <div v-if="files.length">
        <div v-for="(file, index) in files" :key="index" class="fileFont">
          {{ file.name }}
        </div>
      </div>
    </div>

    <div class="uploadBtn" style="cursor: pointer" @click="uploadPhoto">
      <div>업로드</div>
    </div>
  </div>
</template>
<script lang="ts">
import PictureUpload from "../../assets/icons/PictureUploadIcon.svg";
import { ref } from "vue";
export default {
  name: "MyPictureComponent",
  components: {
    PictureUpload,
  },
  setup() {
    const isDragging = ref(false);
    const files = ref<File[]>([]);

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
        console.log(droppedFiles);

        files.value.push(...droppedFiles);
      }
    };
    return {
      isDragging,
      files,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
    };
  },
  methods: {
    uploadPhoto() {},
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
.pictureContainer div {
  color: #828282;
  /* font-weight: 600; */

  margin-top: 15px;
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
  width: 100px;
  background-color: #f2f2f2;
  text-align: center;
  border-radius: 1px;
  height: 30px;
  line-height: 30px;
}
.fileContainer {
  display: flex;
}
.fileFont {
  font-size: 14px;
}
.pictureFont {
  font-size: 13px;
}
</style>
