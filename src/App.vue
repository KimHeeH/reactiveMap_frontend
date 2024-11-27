<template>
  <div class="container">
    <!--props-->
    <SearchBar :value="searchQuery" @updateSearch="updateSearchQuery" />
    <div class="mapContainer">
      <KakaoMap ref="kakaoMap" @updatePlaceName="updatePlaceName" />
    </div>
  </div>
</template>

<script lang="ts">
import { fetchUser } from "./api/userService";
import KakaoMap from "./components/kakaoMap.vue";
import SearchBar from "./components/SearchBar.vue";
export default {
  data() {
    return {
      // user: [],
      searchQuery: "" as string, // 검색창의 입력값
    };
  },
  // async created() {
  //   this.user = await fetchUser();
  // },
  name: "App",
  components: {
    KakaoMap,
    SearchBar,
  },

  methods: {
    updatePlaceName(newPlaceName: string | null) {
      // 지도에서 전달받은 placeName을 검색창으로 설정
      this.searchQuery = newPlaceName || "";
    },
    updateSearchQuery(newSearchQuery: string) {
      // 검색창에서 업데이트된 값을 처리 (필요 시)
      this.searchQuery = newSearchQuery;
    },
  },
};
</script>

<style>
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 스크롤 방지 */
}
* {
  box-sizing: border-box; /* 패딩과 보더를 요소 크기에 포함 */
}
.container,
.mapContainer {
  width: 100%;
  height: 100%;
  padding: 0;
  margin-left: 0;
  margin-right: 0;
}
</style>
