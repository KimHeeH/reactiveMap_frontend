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
      <div v-if="isAuthenticate && searchResults && searchResults.length > 0">
        <div v-for="(result, index) in searchResults" :key="index">
          <h3>{{ result.title }}</h3>
          <p>카테고리: {{ result.category }}</p>
          <p v-if="result.description">설명: {{ result.description }}</p>
          <p v-if="result.telephone">전화번호: {{ result.telephone }}</p>
          <a :href="result.link" target="_blank">상세보기</a>
        </div>
      </div>
      <div v-if="!searchResults && searchResults.length <= 0">
        <p>검색 결과가 없습니다.</p>
      </div>

      <div v-if="!isAuthenticate" class="login-desciption">
        <div>로그인 후 다양한 서비스를 이용해보세요 :)</div>
        <div class="login-container">
          <div @click="login" style="cursor: pointer">로그인</div>
          <div>회원가입</div>
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
        if (
          this.isAuthenticate &&
          this.data.items &&
          this.data.items.length > 0
        ) {
          this.searchResults = data.items;
          this.menuOpen = true;
        } else {
          this.menuOpen = true;

          searchResults = [];
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
    login() {
      this.isAuthenticate = true;
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
  width: 400px;
  padding: 20px;
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
}

.logo-container {
  display: flex;
  width: 400px;
  gap: 170px;
}
.logo {
  width: 170px;
}

.login-container {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}
.login-container div {
  background-color: #f7f7f7;
  width: 200px;
  height: 42px;
  line-height: 42px;
  font-weight: 600;
}
.login-desciption {
  margin-top: 15px;
  border-top: 1px solid #d4d4d4;
}
.login-desciption div {
  margin-top: 15px;
  font-weight: 600;
}
</style>
