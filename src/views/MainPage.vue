<template>
  <div class="main-page">
    <SearchBar
      :user="user"
      :placeAddress="placeAddress"
      v-model="searchQuery"
      ref="searchBar"
    />
    <MenuBar @updateUserData="updateUserData" />
    <kakaoMap
      ref="kakaoMap"
      :searchQuery="searchQuery"
      @updatePlaceName="updateAddress"
      @detailClicked="handleDetailClicked"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
import kakaoMap from "../components/kakaoMap.vue";
import MenuIcon from "@/assets/icons/components/MenuIcon.vue";
import MenuBar from "@/components/menuBar.vue";

export default defineComponent({
  name: "MainPage",
  components: {
    SearchBar,
    kakaoMap,
    MenuBar,
  },
  data() {
    return {
      searchQuery: "", // 검색 입력 값
      placeAddress: "",
      user: null,
    };
  },
  watch: {
    // searchQuery가 변경될 때마다 콘솔로 출력
    searchQuery(newQuery) {
      console.log("Updated searchQuery:", newQuery);
    },
    placeAddress(newAddress) {},
  },
  methods: {
    updateAddress(placeName: string) {
      console.log("PlaceName은", placeName);
      this.placeAddress = placeName;
    },
    updateUserData(userData: object) {
      this.user = userData;
      console.log(this.user);
    },
    handleDetailClicked(address) {
      console.log("카카오맵에서 전달받은 주소", address);
      this.$refs.searchBar.search(address);
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
  /* overflow: hidden; 스크롤 방지 */
}
</style>
