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
      @input="this.$emit('updateSearch', $event.target.value)"
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
      <div
        class="placeList"
        v-if="isAuthenticate && searchResults && searchResults.length > 0"
        style="border-top: 1px solid #d4d4d4; margin-top: 10px"
      >
        <div style="text-align: left; margin-top: 10px">
          검색 결과 ({{ searchResults.length }})
        </div>
        <div
          class="place"
          v-for="(result, index) in searchResults"
          :key="index"
        >
          <h3>{{ result.title }}</h3>
          <div style="font-size: 15px; margin-top: 10px">
            {{ result.address }}
          </div>
          <div style="font-size: 15px">{{ result.roadAddress }}</div>

          <p style="font-size: 13px">카테고리: {{ result.category }}</p>
          <p v-if="result.description">설명: {{ result.description }}</p>
          <p v-if="result.telephone">전화번호: {{ result.telephone }}</p>
          <a
            style="font-size: 13px; margin-top: 10px"
            :href="result.link"
            target="_blank"
            >상세보기</a
          >
        </div>
      </div>
      <div v-if="!searchResults && searchResults.length <= 0">
        <p>검색 결과가 없습니다.</p>
      </div>

      <div v-if="!isAuthenticate" class="login-desciption">
        <div>로그인 후 다양한 서비스를 이용해보세요 :)</div>
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
  </div>
</template>

<script>
import MenuIcon from "../assets/icons/MenuIcon.svg";
import CloseIcon from "../assets/icons/CloseIcon.svg";
import SearchIcon from "../assets/icons/SearchIocn.svg";
import logo from "../assets/icons/logo.svg";
import loginImage from "../assets/kakao_login_medium_wide (2).png";
import { useRouter } from "vue-router"; // Vue Router 가져오기

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
  },
  name: "SearchBar",
  data() {
    return {
      keyword: "",
      menuOpen: false, // 메뉴의 열림/닫힘 상태
      isAuthenticate: false,
      searchResults: [],
      loginImage: loginImage,
    };
  },
  setup() {
    const router = useRouter();

    // 로그인 페이지로 이동
    const goToLoginPage = () => {
      // this.isAuthenticate = true;

      router.push("/login"); // "/login" 경로로 이동
    };

    return {
      goToLoginPage,
    };
  },
  methods: {
    async search(keyword) {
      try {
        const response = await fetch(
          `/api/v1/search/local.json?query=${keyword}&display=5&start=1&sort=sim`,
          {
            headers: {
              "X-Naver-Client-Id": import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID,
              "X-Naver-Client-Secret": import.meta.env
                .VITE_NAVER_SEARCH_CLIENT_SECRET,
            },
          }
        );
        const data = await response.json();
        console.log(import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID);
        console.log(import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET);
        console.log(keyword);
        console.log(data);
        if (data.items && data.items.length > 0) {
          this.searchResults = data.items;
          this.menuOpen = true;
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
}
.logo {
  width: 170px;
}

.login-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
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
</style>
