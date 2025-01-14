<template>
  <div class="menu-bar" v-if="menuOpen">
    <div class="iconsContainer">
      <div
        v-if="currentComponent"
        class="arrowRightIconContainer"
        @click="goBack"
      >
        <arrowRightIcon />
      </div>
      <div
        class="closeIconContainer"
        @click="toggleMenu"
        style="cursor: pointer"
      >
        <CloseIconComponent />
      </div>
    </div>

    <div v-if="user && !currentComponent" class="successLoginContainer">
      <div class="myProfile">
        <MyIcon />
        <div class="userName">{{ user.username }}님</div>
      </div>
      <a @click="logout" style="border-bottom: 1px solid black; font-size: 14px"
        >로그아웃</a
      >
    </div>
    <div v-if="user">
      <div class="currentComponent">
        <component :userdata="user" :is="currentComponent" />
      </div>
      <div class="menuIconList" v-if="!currentComponent">
        <div class="iconContainer" @click="currentComponent = 'MyMemoRecords'">
          <EditIcon />
          <div>나의 메모 기록</div>
        </div>
        <div
          class="iconContainer"
          :userdata="user"
          @click="currentComponent = 'MyTimeLine'"
        >
          <ChartLineIcon />
          <div>내 타임라인</div>
        </div>
        <div
          class="iconContainer"
          :userData="user"
          @click="currentComponent = 'MyAlaram'"
        >
          <AlaramIcon />
          <div>알림 설정 내역</div>
        </div>
        <div
          class="iconContainer"
          :userData="user"
          @click="currentComponent = 'MySaved'"
        >
          <BookMarkIcon />
          <div>저장됨</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="loginText">
        당신만의 장소,<br />
        당신만의 이야기를 시작하세요.
      </div>
      <div class="loginBtnContainer">
        <img :src="loginImage" @click="goToLoginPage" style="cursor: pointer" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import MyIcon from "../assets/icons/components/MyIconComponent.vue";
import CloseIconComponent from "@/assets/icons/components/CloseIconComponent.vue";
import loginImage from "../assets/kakao_login_medium_wide.png";
import { useRouter } from "vue-router"; // Vue Router 가져오기
import { onMounted, ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import MyMemoRecords from "./MenuComponents/MyMemoRecords.vue";
import MyAlaram from "./MenuComponents/MyAlaram.vue";
import MySaved from "./MenuComponents/MySaved.vue";
import MyTimeLine from "./MenuComponents/MyTimeLine.vue";
import arrowRightIcon from "../assets/icons/components/ArrowRightIcon.vue";
import AlaramIcon from "../assets/icons/AlaramIcon.svg";
import BookMarkIcon from "../assets/icons/BookMarkIcon.svg";
import ChartLineIcon from "../assets/icons/ChartLineIcon.svg";
import EditIcon from "../assets/icons/EditIcon.svg";
import { eventBus } from "@/eventBus";

export default defineComponent({
  name: "MenuBarComponent",
  components: {
    CloseIconComponent,
    MyIcon,
    EditIcon,
    AlaramIcon,
    ChartLineIcon,
    BookMarkIcon,
    MyMemoRecords,
    MySaved,
    MyTimeLine,
    MyAlaram,
    arrowRightIcon,
  },
  data() {
    return {
      loginImage: loginImage,
      userData: null,
      MyIcon,
      currentComponent: null,
    };
  },
  setup(_, { emit }) {
    // emit을 받아옵니다.
    const user = ref(null);
    const router = useRouter();
    // 로그인 시 카카오 callback uri로 이동
    const goToLoginPage = () => {
      window.location.href = "http://localhost:3000/auth/callback";
    };
    // 로그아웃 시 서버의 logout 경로로 이동
    const logout = () => {
      window.location.href = "http://localhost:3000/auth/logout";
    };
    const menuOpen = ref(true);
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };
    const userInfo = async () => {
      try {
        // 클라이언트에 있는 LoggedIn 쿠키를 가져옴
        const isLoggedIn = Cookies.get("isLoggedIn");
        if (isLoggedIn) {
          console.log("로그인 성공!");
          const response = await axios.get(
            "http://localhost:3000/auth/user-info",
            {
              withCredentials: true, // 인증 정보를 포함
            }
          );
          user.value = response.data;
          console.log("로그인 유저 정보", user.value);
          emit("updateUserData", user.value); // emit 사용
        } else {
          console.log("로그인 x");
        }
      } catch (error) {
        console.error("오류 발생:", error); // 오류 전체 출력
        if (error.response) {
          // 서버 응답 오류
          console.error("서버 응답 오류:", error.response.data);
        } else if (error.request) {
          // 요청이 이루어졌지만 응답이 없음
          console.error("요청 실패:", error.request);
        } else {
          // 요청 설정 중 오류 발생
          console.error("요청 설정 오류:", error.message);
        }
      }
    };

    onMounted(() => {
      userInfo();
      eventBus.on("toggleMenu", toggleMenu);
    });
    onUnmounted(() => {
      eventBus.off("toggleMenu", toggleMenu);
    });
    return {
      goToLoginPage,
      logout,
      menuOpen,
      toggleMenu,
      MyMemoRecords,
      MySaved,
      MyTimeLine,
      MyAlaram,
      arrowRightIcon,
      user,
      userInfo,
    };
  },
  methods: {
    goBack() {
      this.currentComponent = null;
    },
  },
  mounted() {
    // 클라이언트 실행 시 userInfo가 자동으로 실행됨
    this.userInfo();
  },
});
</script>
<style>
.menu-bar {
  height: 100vh;
  position: absolute;
  left: -12px;
  width: 400px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y: auto; /* 세로 스크롤 활성화 */
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  z-index: 101;
  flex-direction: column;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.closeIconContainer {
  z-index: 100;
  width: 100%;
  display: flex;
  padding-right: 0px;
  justify-content: flex-end;
}
.loginText {
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  font-family: "Nanum Gothic Coding", serif;
  font-style: normal;
  margin-top: 30px;
  line-height: 25px;
  color: #0b0c0c;
}
.loginBtnContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.loginBtnContainer img {
  width: 85%;
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
  gap: 10px;
  margin-left: 20px;
}
.myProfile div {
  font-size: 24px;
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
  margin-left: 20px;
}
.iconContainer div {
  font-size: 22px;
  height: 50px;
  line-height: 25px;
  color: #2d2d2d;
}
.iconsContainer {
  margin: 0 30px 20px 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
.currentComponent {
  padding-left: 40px;
}
.arrowRightIconContainer svg {
  width: 40px; /* 아이콘 크기 통일 */
  height: 40px;
  object-fit: contain;
  margin-top: 10px;
}
.arrowRightIconContainer {
  cursor: pointer;
}
</style>
