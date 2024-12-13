<template>
  <div class="momoContainer">
    <div style="margin-left: 10px">나의 메모</div>
    <div><MemoDetail /></div>
  </div>
</template>
<script lang="ts">
import MemoDetail from "./MemoDetail.vue";
export default {
  name: "MyMemo",
  components: {
    MemoDetail,
  },
};
</script>
<style scooped></style>
