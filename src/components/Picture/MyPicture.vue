<template>
  <div>
    <div>나의 사진</div>
    <div
      class="pictureContainer"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'is-dragging': isDragging }"
    >
      <PictureUpload />

      <div v-if="files.length">
        <div v-for="(file, index) in files" :key="index">{{ file.name }}</div>
      </div>
      <div v-if="!files.length">클릭 혹은 파일을 이곳에 드롭하세요.</div>
    </div>
    <input type="file" />
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
};
</script>
<style>
.pictureContainer {
  background-color: #fdfdfd;
  width: 95%;
  height: 200px;
  margin: 10px;
  border: 2px dashed #d8d8d8;
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

  font-size: 15px;
  margin-top: 15px;
}
input {
  margin-left: 10px;
}
</style>
