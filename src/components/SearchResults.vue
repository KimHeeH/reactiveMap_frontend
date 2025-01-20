<template>
  <div
    class="placeList"
    v-if="searchResults && searchResults.length > 0 && !isDetail"
    style="border-top: 1px solid #d4d4d4; margin-top: 10px"
  >
    <div class="topBar">
      <div>검색 결과 ({{ searchResults.length }})</div>
    </div>

    <div
      class="place"
      v-for="(result, index) in searchResults"
      :key="index"
      @click="goDetailPlace(result)"
    >
      <h3>{{ cleanTitle(result.title) }}</h3>
      <div style="font-size: 14px; margin-top: 10px">
        {{ result.address }}
      </div>
      <div style="font-size: 14px; margin-top: 10px">
        {{ result.roadAddress }}
      </div>

      <p style="font-size: 13px; margin-top: 10px">
        {{ result.category }}
      </p>
      <!-- <p v-if="result.description">설명: {{ result.description }}</p>
      <p v-if="result.telephone">전화번호: {{ result.telephone }}</p> -->
      <a
        style="font-size: 13px; margin-top: 20px; color: #fa590f"
        :href="result.link"
        target="_blank"
        >상세보기</a
      >
    </div>
  </div>

  <div v-if="isDetail">
    <PlaceDetail
      :detail="
        placeDetail.map(({ title, roadAddress, mapx, mapy }) => ({
          title,
          roadAddress,
          mapx,
          mapy,
        }))
      "
      :userData="userData"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, PropType } from "vue";
import PlaceDetail from "./PlaceDetail.vue";
import MenuIcon from "../assets/icons/components/MenuIcon.vue";
import { fetchGetGoogleImage } from "@/api/mainService";
import { fetchGetPlaceImage } from "@/api/mainService";
import { photoURLStore } from "@/stores/useStore";
interface SearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  description?: string;
  telephone?: string;
  link: string;
  mapx: string;
  mapy: string;
}
interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}
export default defineComponent({
  components: {
    PlaceDetail,
    MenuIcon,
  },
  data() {
    return {
      isDetail: false,
      placeDetail: [] as SearchResult[], // 타입 지정
      placePhoto: null as string | null,
    };
  },
  props: {
    searchResults: {
      type: Array as () => SearchResult[],
      required: true,
    },

    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
  },
  mounted() {
    console.log("부모에서 받은 userData 값", this.userData);
    console.log(this.userData.id);
  },

  methods: {
    async goDetailPlace(place: SearchResult) {
      try {
        const encodedAddress = encodeURIComponent(this.cleanTitle(place.title));
        const response = await fetchGetGoogleImage(encodedAddress);
        console.log("Search Google API 응답 데이터", response);
        if (response && response.candidates.length > 0 && response.candidates) {
          const photos = response.candidates[0].photos;
          const photoReference = photos[0].photo_reference;
          if (photoReference) {
            await this.fetchPlaceImage(photoReference);
          } else {
            console.error("No photo reference found in response");
          }
        } else {
          console.error("No candidates found for the given address");
        }
      } catch (error) {
        console.error("Error fetching Google image:", error);
      }
      console.log(this.isDetail);
      this.isDetail = !this.isDetail;
      this.placeDetail = [place]; // 선택한 장소의 세부 정보를 저장
      console.log(this.isDetail);
      console.log(this.searchResults);
      console.log(place.address);
    },
    async fetchPlaceImage(photo_reference: string) {
      const url = await fetchGetPlaceImage(photo_reference);

      this.placePhoto = url;
      if (this.placePhoto) {
        const store = photoURLStore();
        try {
          await store.setUrl(this.placePhoto);
          console.log("placePhoto URL이 지정되었습니다.");
        } catch (error) {
          console.error("store.setURL 오류");
        }
      }
    },

    cleanTitle(title: string): string {
      return title.replace(/<\/?[^>]+(>|$)/g, "");
    },
  },
});
</script>
<style scoped>
.place {
  padding: 20px;
  margin-top: 30px;
  border: 1px solid #d4d4d4;
  text-align: left;
  width: 380px;
  border-radius: 10px;
  cursor: pointer;
}
.topBar {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-right: 25px;
  padding-left: 5px;
}
.placeList {
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding-left: 20px;
}
.noResultMessage {
  font-size: 18px;
  margin-left: 20px;
}
.menuIcon {
  display: flex;
  height: 20px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
</style>
