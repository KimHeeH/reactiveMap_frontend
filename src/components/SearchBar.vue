<template>
  <div class="search-bar">
    <!-- 메뉴 버튼 -->
    <div class="menu-container">
      <MenuIcon v-if="!menuOpen" class="menuIcon" @click="toggleMenu" />
    </div>

    <!-- 검색 입력 -->
    <input
      type="text"
      :value="modelValue"
      placeholder="가고싶은 장소를 검색해보세요"
      @keyup.enter="search(modelValue)"
      @input="updateValue($event)"
    />

    <!-- 검색 버튼 -->
    <SearchIcon @click="search(modelValue)" class="searchIcon" />

    <!-- 메뉴 -->
    <div class="menu" v-if="menuOpen">
      <div class="logo-container">
        <logo class="logo" />
        <CloseIcon v-if="menuOpen" class="closeIcon" @click="closeMenu" />
      </div>
      <SearchResults
        :searchResults="searchResults"
        :userData="user"
        :placeAddress="placeAddress"
      />
    </div>
  </div>
</template>

<script>
import MenuIcon from "../assets/icons/components/MenuIcon.vue";
import CloseIcon from "../assets/icons/components/CloseIconComponent.vue";
import SearchIcon from "../assets/icons/SearchIocn.svg";
import logo from "../assets/icons/logo.svg";
import loginImage from "../assets/kakao_login_medium_wide.png";
import { useRouter } from "vue-router"; // Vue Router 가져오기
import { onMounted, ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchSearchResults } from "../api/mainService";
import SearchResults from "./SearchResults.vue";
import { eventBus } from "../eventBus";
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeAddress: {
      type: String,
      required: false,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuIcon,
    CloseIcon,
    SearchIcon,
    logo,
    SearchResults,
  },
  name: "SearchBar",
  data() {
    return {
      keyword: "",
      menuOpen: false, // 메뉴의 열림/닫힘 상태
      searchResults: [],
      newAddress: "",
      userData: null,
    };
  },
  watch: {
    // placeAddress가 변경되면 자동으로 search 함수 호출
    placeAddress(newAddress) {
      if (newAddress) {
        console.log("새로운 장소는?", newAddress);
        this.search(newAddress); // 새 address로 검색 수행
      }
    },
  },
  setup(props) {
    const userData = ref(props.user); // props로 전달받은 user를 ref로 정의
    console.log("SearchBar에서 props로 받은 userData", userData.value); // 올바른 로그
    return {
      userData,
    };
  },
  methods: {
    async search(keyword) {
      try {
        const data = await fetchSearchResults(keyword);
        console.log(data);
        if (data.items && data.items.length > 0) {
          this.menuOpen = true;
          this.searchResults = data.items;
          this.$emit("updateSearch", keyword);
          console.log("searchResults는", this.searchResults);
        } else {
          this.searchResults = [];
          this.menuOpen = true;

          console.log("검색 결과 없음");
        }
      } catch (error) {
        this.searchResults = []; // 오류 발생 시 빈 배열로 초기화
        this.menuOpen = true;

        console.error("검색 기능 오류", error);
      }
    },
    toggleMenu() {
      eventBus.emit("toggleMenu");
    },
    closeMenu() {
      console.log("닫힘");
      this.menuOpen = false;
    },
    updateValue(event) {
      const inputValue = event.target.value;
      this.$emit("update:modelValue", inputValue);
    },
    openMenuBar() {
      this.isSearch = false;
      this.searchResults = [];
      console.log("Menu 클릭시 ", this.isSearch);
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: absolute;
  top: 10px;
  z-index: 100;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 15px;
  width: 500px;
  height: 45px;
}

.menu-container {
  display: flex;
  align-items: center;
}

.search-bar input {
  flex: 1;
  outline: none;
  border: none;
  border-radius: 4px;
  height: 100%;
}

.menu {
  height: 100vh;
  position: absolute;
  top: -24.5px;
  left: -12px;
  width: 440px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y: auto; /* 세로 스크롤 활성화 */

  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  z-index: 101;
  flex-direction: column;
}
.menuIcon,
.searchIcon,
.closeIcon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.closeIcon {
  width: 30;
  height: 30;
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 30px;
}

.logo-container {
  display: flex;
  width: 400px;
  margin-left: 10px;
}
.logo {
  width: 170px;
}

.login-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-left: 50px;
  padding-right: 50px;
}
.login-container img {
  z-index: 104;
}
.login-desciption {
  margin-top: 15px;
  border-top: 1px solid #d4d4d4;
}
.login-desciption div {
  margin-top: 15px;
  font-weight: 600;
}
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
.successLoginContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 두 요소를 양 끝으로 배치 */
  height: 100px;
  padding: 20px;
  width: 100%;
  align-items: center;
}
.successLoginContainer div {
  cursor: pointer;
  align-items: center;
}
.successLoginContainer a {
  margin-right: 20px;
  cursor: pointer;
  align-items: center;
}
.myProfile {
  display: flex;
  gap: 20px;
}
.myProfile div {
  font-size: 24px;
}
.login {
  font-size: 20px;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 0px;
  font-family: "Nanum Gothic Coding", serif;
  font-weight: 600;
  font-style: normal;
}
.menuIconList {
  margin-left: 20px;
}
.svg-container {
  width: 100%; /* 또는 원하는 크기 */
  height: auto;
  overflow: visible; /* 숨겨지지 않도록 설정 */
}
.iconContainer {
  display: flex;
  gap: 20px;
  height: 50px;
  padding: 10px;
  cursor: pointer;
}
.iconContainer div {
  font-size: 22px;
  height: 50px;
  line-height: 25px;
  color: #2d2d2d;
}
.iconsContainer {
  margin: 0 20px 20px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrowRightIconContainer,
.closeIconContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px; /* 동일한 높이 지정 */
  cursor: pointer;
}

.closeIconContainer svg {
  width: 24px; /* 아이콘 크기 통일 */
  height: 24px;
  object-fit: contain;
}
.arrowRightIconContainer svg {
  width: 40px; /* 아이콘 크기 통일 */
  height: 40px;
  object-fit: contain;
  margin-top: 10px;
}
.currentComponent {
  margin: 50px;
}
</style>
