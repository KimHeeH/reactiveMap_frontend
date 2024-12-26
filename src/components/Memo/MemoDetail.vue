<template>
  <div class="memoContainer">
    <div class="IconContainer"><NoMemoIcon /></div>
    <div style="margin-top: -10px; color: #828282">작성된 메모가 없어요</div>
    <div class="memoAddBtn">메모 추가</div>
  </div>
</template>
<script lang="ts">
import NoMemoIcon from "../../assets/icons/NoMemoIcon.svg";
export default {
  name: "MemoDetail",
  components: {
    NoMemoIcon,
  },
};
</script>
<style scoped>
.memoContainer {
  background-color: #fcfcfc;
  width: 95%;
  height: 200px;
  margin: 10px;
  /* border: 1px solid #d8d8d8; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.memoAddBtn {
  background-color: #f1f1f1;
  color: rgb(39, 39, 39);
  width: 70px;
  text-align: center;
  border-radius: 1px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
