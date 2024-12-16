<template>
  <div>
    <div>나의 사진</div>
    <div class="pictureContainer">
      <PictureUpload />
      <div>클릭 혹은 파일을 이곳에 드롭하세요.</div>
    </div>
    <input type="file" />
  </div>
</template>
<script lang="ts">
import PictureUpload from "../../assets/icons/PictureUploadIcon.svg";
export default {
  name: "MyPictureComponent",
  components: {
    PictureUpload,
  },
};
</script>
<style>
.pictureContainer {
  background-color: #fdfdfd;
  width: 95%;
  height: 200px;
  margin: 10px;
  border: 1px solid #d8d8d8;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
