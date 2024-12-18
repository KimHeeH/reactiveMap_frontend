<template>
  <div class="search-bar">
    <!-- 메뉴 버튼 -->
    <div class="menu-container">
      <MenuIcon v-if="!menuOpen" class="menuIcon" @click="toggleMenu" />
    </div>

    <!-- 검색 입력 -->
    <input
      type="text"
      :value="value"
      placeholder="가고싶은 장소를 검색해보세요"
      @keyup.enter="search(value)"
    />

    <!-- 검색 버튼 -->
    <SearchIcon @click="search(value)" class="searchIcon" />

    <!-- 메뉴 -->
    <div class="menu" v-if="menuOpen">
      <div class="logo-container">
        <logo class="logo" />
        <CloseIcon v-if="menuOpen" class="closeIcon" @click="toggleMenu" />
      </div>
      <div v-if="!isSearch">
        <div v-if="user">
          <div class="successLoginContainer">
            <div class="myProfile">
              <MyIcon />
              <div class="userName">{{ user.username }}님</div>
            </div>
            <a
              @click="logout"
              style="border-bottom: 1px solid black; font-size: 14px"
              >로그아웃</a
            >
          </div>
          <div class="menuIconList">
            <div class="iconContainer">
              <EditIcon />
              <div>나의 메모 기록</div>
            </div>
            <div class="iconContainer">
              <ChartLineIcon />
              <div>내 타임라인</div>
            </div>
            <div class="iconContainer">
              <AlaramIcon />
              <div>알림 설정 내역</div>
            </div>
            <div class="iconContainer">
              <BookMarkIcon />
              <div>저장됨</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="login">로그인 후 다양한 서비스를 이용해보세요 :)</div>
          <div
            class="login-container"
            style="display: flex; justify-content: center"
          >
            <img
              :src="loginImage"
              @click="goToLoginPage"
              style="cursor: pointer"
            />
          </div>
        </div>
      </div>
      <SearchResults
        :searchResults="searchResults"
        :is-authenticate="isAuthenticate"
        @openMenuBar="openMenuBar"
      />
    </div>
  </div>
</template>

<script>
import MenuIcon from "../assets/icons/MenuIcon.vue";
import CloseIcon from "../assets/icons/CloseIcon.svg";
import SearchIcon from "../assets/icons/SearchIocn.svg";
import logo from "../assets/icons/logo.svg";
import loginImage from "../assets/kakao_login_medium_wide.png";
import { useRouter } from "vue-router"; // Vue Router 가져오기
import { onMounted, ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchSearchResults } from "../api/mainService";
import SearchResults from "./SearchResults.vue";
import MyIcon from "../assets/icons/MyIcon.svg";
import AlaramIcon from "../assets/icons/AlaramIcon.svg";
import BookMarkIcon from "../assets/icons/BookMarkIcon.svg";
import ChartLineIcon from "../assets/icons/ChartLineIcon.svg";
import EditIcon from "../assets/icons/EditIcon.svg";
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    emits: ["updateSearch"],
  },
  components: {
    MenuIcon,
    CloseIcon,
    SearchIcon,
    logo,
    SearchResults,
    MyIcon,
    EditIcon,
    AlaramIcon,
    ChartLineIcon,
    BookMarkIcon,
  },
  name: "SearchBar",
  data() {
    return {
      keyword: "",
      menuOpen: false, // 메뉴의 열림/닫힘 상태
      isAuthenticate: false,
      searchResults: [],
      loginImage: loginImage,
      user: null, // user 정보가 저장되는 부분
      isSearch: false,
    };
  },
  setup() {
    const router = useRouter();
    // 로그인 시 카카오 callback uri로 이동
    const goToLoginPage = () => {
      window.location.href = "http://localhost:3000/auth/callback";
    };
    // 로그아웃 시 서버의 logout 경로로 이동
    const logout = () => {
      window.location.href = "http://localhost:3000/auth/logout";
    };

    return {
      goToLoginPage,
      logout,
    };
  },
  methods: {
    async search(keyword) {
      try {
        this.isSearch = true;
        // const response = await fetch(
        //   `/api/v1/search/local.json?query=${keyword}&display=5&start=1&sort=sim`,
        //   {
        //     headers: {
        //       "X-Naver-Client-Id": import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID,
        //       "X-Naver-Client-Secret": import.meta.env
        //         .VITE_NAVER_SEARCH_CLIENT_SECRET,
        //     },
        //   }
        // );
        const data = await fetchSearchResults(keyword);
        // const data = await response.json();
        // console.log(import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID);
        // console.log(import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET);
        console.log(keyword);
        console.log(data);
        if (data.items && data.items.length > 0) {
          this.searchResults = data.items;
          this.menuOpen = true;
          this.$emit("updateSearch", keyword);
          console.log("searchResults는", this.searchResults);
        } else {
          searchResults = [];
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
      console.log("Menu button clicked");
      this.menuOpen = !this.menuOpen; // 메뉴 열림/닫힘 토글
      console.log("Menu state:", this.menuOpen);
    },

    // user 데이터 가져오기
    async userInfo() {
      try {
        // 클라이언트에 있는 LoggedIn 쿠키를 가져옴
        const isLoggedIn = Cookies.get("isLoggedIn");
        if (isLoggedIn) {
          console.log("로그인 성공!");
          const response = await axios.get(
            "http://localhost:3000/auth/user-info",
            {
              withCredentials: true,
            }
          );
          this.user = response.data;
          this.isAuthenticate = true; // 로그인 성공 시 true로 설정
          console.log(this.user);
        } else {
          console.log("로그인 x");
        }
      } catch (error) {
        console.log(error);
      }
    },
    openMenuBar() {
      this.isSearch = false;
      this.searchResults = [];
      console.log("Menu 클릭시 ", this.isSearch);
    },
  },
  mounted() {
    // 클라이언트 실행 시 userInfo가 자동으로 실행됨
    this.userInfo();
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

.menuIcon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.search-bar input {
  flex: 1;
  outline: none;
  border: none;
  border-radius: 4px;
  height: 100%;
}

.searchIcon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.menu {
  height: 100vh;
  position: absolute;
  top: -24.5px;
  left: -10px;
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
</style>
