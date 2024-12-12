<template>
  <div v-for="(place, index) in detail" :key="index">
    <img :src="image" alt="Place Image" />
    <div class="title">{{ place.title }}</div>
    <div style="font-size: 15px; margin-top: 10px; margin-left: 5px">
      {{ place.roadAddress }}
    </div>
  </div>
  <div class="iconList">
    <div class="icon">
      <div><SaveIcon /></div>
      <div class="icon-font">저장</div>
    </div>
    <div class="icon">
      <div><MemoIcon /></div>
      <div class="icon-font">메모</div>
    </div>
    <div class="icon">
      <div><PictureIcon /></div>
      <div class="icon-font">사진</div>
    </div>
  </div>
  <div class="MyMemoContainer"><MyMemo /></div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import image from "../assets/image 10.png";
import SaveIcon from "../assets/icons/SaveIcon (2).svg";
import MemoIcon from "../assets/icons/MemoIcon (2).svg";
import PictureIcon from "../assets/icons/PictureIcon (2).svg";
import MyMemo from "./MyMemo.vue";

interface Place {
  title: string;
  roadAddress: string;
}
export default defineComponent({
  props: {
    detail: {
      type: Array as PropType<Place[]>, // Place[] 타입을 명시
      required: true,
    },
  },
  setup(props: { detail: Place[] }) {
    // props.detail은 Place[] 타입으로 추론
    console.log(props.detail);
    console.log(SaveIcon); // SaveIcon이 어떻게 로드되는지 확인

    return { detail: props.detail, image }; // 반환값 추가
  },
  components: {
    MemoIcon,
    SaveIcon, // 컴포넌트 등록
    PictureIcon,
    MyMemo,
  },
  // data() {
  //   return { image };
  // },
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
.icon {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.icon-font {
  margin-left: 5px;
}
.MyMemoContainer {
  margin-top: 20px;
}
</style>
