<template>
  <div class="login-page">
    <h1>로그인</h1>
    <button @click="goBack">뒤로가기</button>
  </div>
</template>

<script lang="ts">
export default {
  name: "LoginPage",
  methods: {
    goBack() {
      this.$router.push("/"); // 메인 페이지로 이동
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
