<template>
  <div class="contentWrapper">
    <div v-for="(place, index) in detail" :key="index">
      <img :src="url" alt="Place Image" style="margin-top: 10px" />
      <div class="title">{{ cleanTitle(place.title) }}</div>
      <div style="font-size: 15px; margin-top: 10px; margin-left: 5px">
        {{ place.roadAddress }}
      </div>
    </div>
    <div class="contentContainer">
      <div class="iconList">
        <div class="icon">
          <div @click="bookmark(url)"><SaveIcon ref="saveIcon" /></div>
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
        <MyMemo :imgUrl="url" :userData="userData" :locationName="detail" />
      </div>
      <div class="MyPictureContainer" ref="myPicture">
        <MyPicture :userData="userData" :detail="detail" />
      </div>
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
import { useStore } from "@/stores/useStore";
import { photoURLStore } from "@/stores/useStore";

import axios from "axios";
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
    const store = photoURLStore();
    const url = store.url || "";
    // props.detail은 Place[] 타입으로 추론
    console.log(userData); // SaveIcon이 어떻게 로드되는지 확인
    const bookmark = async (url) => {
      console.log("url은", url);
      if (userData) {
        try {
          const response = await axios.post(
            `http://localhost:3000/bookmark/insert`,
            {
              id: userData.id,
              place: detail[0]?.title.replace(/<\/?[^>]+(>|$)/g, ""),
              lon: detail[0]?.mapx,
              lat: detail[0]?.mapy,
              images: url,
            }
          );
          if (response.data.success === true) {
            alert("즐겨찾기가 등록되었습니다.");
          } else {
            alert("즐겨찾기가 취소되었습니다.");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("유저 정보가 없습니다.");
      }
    };

    return { detail: props.detail, userData, image, bookmark, url }; // 반환값 추가
  },
  components: {
    MemoIcon,
    SaveIcon, // 컴포넌트 등록
    PictureIcon,
    MyMemo,
    MyPicture,
  },
  mounted() {
    console.log(this.detail);

    const store = useStore();
    const urlStore = photoURLStore();
    if (urlStore.url) {
      this.url = urlStore.url;
    } else {
      console.log("url이 설정 x");
    }
    if (this.detail.length > 0) {
      const firstPlace = this.detail[0];
      const parseCoords = {
        x: firstPlace.mapx,
        y: firstPlace.mapy,
      };
      console.log("화면에 표시된 좌표", firstPlace.mapx, firstPlace.mapy);
      console.log("setCoords에 저장한 좌표", parseCoords);
      store.setCoords(parseCoords).then(() => {
        console.log("좌표값이 갱신되었습니다.", store.coords);
      });
    }
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
  width: 100%;
  max-height: 320px;
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
