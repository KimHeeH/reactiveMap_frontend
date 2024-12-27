<template>
  <div class="contentWrapper">
    <div v-for="(place, index) in detail" :key="index">
      <img :src="image" alt="Place Image" style="margin-top: 10px" />
      <div class="title">{{ cleanTitle(place.title) }}</div>
      <div style="font-size: 15px; margin-top: 10px; margin-left: 5px">
        {{ place.roadAddress }}
      </div>
    </div>
    <div class="contentContainer">
      <div class="iconList">
        <div class="icon">
          <div @click="clickSaveIcon"><SaveIcon ref="saveIcon" /></div>
          <div class="icon-font">저장</div>
        </div>
        <div class="icon">
          <div @click="clickMemoIcon"><MemoIcon ref="memoIcon" /></div>
          <div class="icon-font">메모</div>
        </div>
        <div class="icon">
          <div @click="clickPictureIcon"><PictureIcon ref="pictureIcon" /></div>
          <div class="icon-font">사진</div>
        </div>
      </div>
      <div class="MyMemoContainer" ref="myMemo">
        <MyMemo :userData="userData" :locationName="detail" />
      </div>
      <div class="MyPictureContainer" ref="myPicture"><MyPicture /></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import image from "../assets/image10.png";
import SaveIcon from "../assets/icons/components/SaveIcon.vue";
import MemoIcon from "../assets/icons/components/MemoIcon.vue";
import PictureIcon from "../assets/icons/components/PictureIcon.vue";
import MyMemo from "./Memo/MyMemo.vue";
import MyPicture from "./Picture/MyPicture.vue";
interface Place {
  title: string;
  roadAddress: string;
}
interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}
export default defineComponent({
  props: {
    detail: {
      type: Array as PropType<Place[]>, // Place[] 타입을 명시
      required: true,
    },
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
  },
  setup(props) {
    const { detail, userData } = props;
    // props.detail은 Place[] 타입으로 추론
    console.log(props.detail);
    console.log(userData); // SaveIcon이 어떻게 로드되는지 확인

    return { detail: props.detail, userData, image }; // 반환값 추가
  },
  components: {
    MemoIcon,
    SaveIcon, // 컴포넌트 등록
    PictureIcon,
    MyMemo,
    MyPicture,
  },

  methods: {
    clickSaveIcon() {
      alert("장소가 저장되었습니다.");
      console.log("saveIcon Clicked");
      (this.$refs.saveIcon as any).toggleActive();
    },
    clickMemoIcon() {
      (this.$refs.memoIcon as any).toggleActive();
      const myMemoElement = this.$refs.myMemo as HTMLElement;
      if (myMemoElement) {
        myMemoElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    clickPictureIcon() {
      const myPictureElement = this.$refs.myPicture as HTMLElement;
      if (myPictureElement) {
        myPictureElement.scrollIntoView({ behavior: "smooth" });
      }
      (this.$refs.pictureIcon as any).toggleActive();
    },
    cleanTitle(title: string): string {
      return title.replace(/<\/?[^>]+(>|$)/g, "");
    },
  },
  // data() {
  //   return { image };
  // },
});
</script>
<style>
.contentWrapper {
  height: 100vh; /* 화면 전체 높이 */
}
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
  margin-top: 30px;
  height: 270px;
}
.contentContainer {
  /* max-height: calc(100vh - 50px); 적절한 높이 계산 */

  overflow-y: auto; /* 세로 스크롤 활성화 */
}
.MyPictureContainer {
  height: auto;
}
</style>
