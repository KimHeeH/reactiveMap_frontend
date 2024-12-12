<template>
  <div
    class="placeList"
    v-if="
      isAuthenticate && searchResults && searchResults.length > 0 && !isDetail
    "
    style="border-top: 1px solid #d4d4d4; margin-top: 10px"
  >
    <div style="text-align: left; margin-top: 20px">
      검색 결과 ({{ searchResults.length }})
    </div>
    <div
      class="place"
      v-for="(result, index) in searchResults"
      :key="index"
      @click="goDetailPlace(result)"
    >
      <h3>{{ result.title }}</h3>
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
  <!-- <div v-if="isAuthenticate">
    <div class="noResultMessage" v-if="isAuthenticate">
      검색 결과가 없습니다.
    </div>
  </div> -->

  <div v-if="isDetail">
    <PlaceDetail
      :detail="
        placeDetail.map(({ title, roadAddress }) => ({ title, roadAddress }))
      "
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import PlaceDetail from "./PlaceDetail.vue";
interface SearchResult {
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  description?: string;
  telephone?: string;
  link: string;
}

export default defineComponent({
  components: {
    PlaceDetail,
  },
  data() {
    return {
      isDetail: false,
      placeDetail: [] as SearchResult[], // 타입 지정
    };
  },
  props: {
    searchResults: {
      type: Array as () => SearchResult[],
      required: true,
    },
    isAuthenticate: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    goDetailPlace(place: SearchResult) {
      console.log(this.isDetail);
      this.isDetail = !this.isDetail;
      this.placeDetail = [place]; // 선택한 장소의 세부 정보를 저장
      console.log(this.isDetail);
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
.placeList {
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding-left: 20px;
}
.noResultMessage {
  font-size: 18px;
  margin-left: 20px;
}
</style>
