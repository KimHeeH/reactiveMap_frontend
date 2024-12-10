<template>
  <div v-for="(place, index) in detail" :key="index">
    <img :src="image" alt="Place Image" />
    <div class="title">{{ place.title }}</div>
    <div style="font-size: 15px; margin-top: 10px; margin-left: 5px">
      {{ place.roadAddress }}
    </div>
    <div class="iconList">
      <SaveIcon />
      <MemoIcon />
      <PictureIcon />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import image from "../assets/image 10.png";
import SaveIcon from "../assets/icons/SaveIcon (2).svg";
import MemoIcon from "../assets/icons/MemoIcon (2).svg";
import PictureIcon from "../assets/icons/PictureIcon (2).svg";

interface Place {
  title: string;
  address: string;
  roadAddress: string;
}
export default defineComponent({
  name: "PlaceDetail",
  props: {
    detail: {
      type: Array as PropType<Place[]>, // placeDetail이 Place 객체들의 배열임을 명시
      required: true,
    },
  },
  components: {
    MemoIcon,
    SaveIcon, // 컴포넌트 등록
    PictureIcon,
  },
  data() {
    return {
      image,
    };
  },
});
</script>
<style>
img {
  width: 99%;
}
.title {
  font-size: 24px;
  margin-left: 5px;
}
.iconList {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  margin-left: 5px;
}
</style>
