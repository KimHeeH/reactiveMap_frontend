<template>
  <div class="container">
    <SearchBar @search="onSearch" />
    <div class="mapContainer">
      <KakaoMap ref="kakaoMap" />
    </div>
  </div>
</template>

<script>
import { fetchUser } from "./api/userService";
import KakaoMap from "./components/kakaoMap.vue";
import SearchBar from "./components/SearchBar.vue";
export default {
  data() {
    return {
      user: [],
    };
  },
  async created() {
    this.user = await fetchUser();
  },
  name: "App",
  components: {
    KakaoMap,
    SearchBar,
  },
  mounted() {
    console.log("App.vue mounted");
  },
  methods: {
    onSearch(keyword) {
      console.log("검색어:", keyword);
      this.$refs.kakaoMap.searchLocation(keyword);
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
