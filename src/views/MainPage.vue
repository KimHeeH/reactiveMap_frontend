<template>
  <div class="main-page">
    <SearchBar
      :menuOpen="menuOpen"
      :placeAddress="placeAddress"
      v-model="searchQuery"
    />
    <kakaoMap
      ref="kakaoMap"
      :searchQuery="searchQuery"
      @updatePlaceName="updateAddress"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
import kakaoMap from "../components/kakaoMap.vue";
import MenuIcon from "@/assets/icons/components/MenuIcon.vue";

export default defineComponent({
  name: "MainPage",
  components: {
    SearchBar,
    kakaoMap,
  },
  data() {
    return {
      searchQuery: "", // 검색 입력 값
      placeAddress: "",
      menuOpen: false,
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
