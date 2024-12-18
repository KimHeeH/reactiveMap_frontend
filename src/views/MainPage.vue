<template>
  <div class="main-page">
    <SearchBar :value="searchQuery" @updateSearch="updateSearchQuery" />
    <kakaoMap
      ref="kakaoMap"
      @updatePlaceName="updatePlaceName"
      :searchQuery="searchQuery"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
import kakaoMap from "../components/kakaoMap.vue";

export default defineComponent({
  name: "MainPage",
  components: {
    SearchBar,
    kakaoMap,
  },
  data() {
    return {
      searchQuery: "", // 검색 입력 값
    };
  },
  methods: {
    updateSearchQuery(newSearchQuery: string) {
      // 검색창에서 입력된 검색어를 관리
      this.searchQuery = newSearchQuery || "";
    },
    updatePlaceName(newPlaceName: string | null) {
      // 지도에서 선택된 장소명을 검색창으로 동기화
      this.searchQuery = newPlaceName || "";
    },
  },
});
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%; /* 부모 요소의 너비를 명확히 설정 */
  height: 100vh; /* 부모 요소의 높이 설정 */
}
</style>
