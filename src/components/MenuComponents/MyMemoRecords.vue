<template>
  <div class="MenuTitle"><div>나의 메모 기록</div></div>
  <div v-if="recordData.length === 0" class="noMemoText">
    등록된 메모가 없어요
  </div>

  <div
    v-for="(contents, place, title) in groupedRecords"
    :key="title"
    class="addMomoContainer"
  >
    <div class="memoTitle">{{ place }}</div>
    <div style="font-size: 14px">메모({{ contents.length }})</div>
    <div class="memoContents">
      <div class="memoContent" v-for="content in contents">{{ content }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, ref, onMounted, computed, PropType } from "vue";

interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}

export default defineComponent({
  name: "MyMemoRecordsComponent",
  props: {
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
  },
  setup(props) {
    const recordData = ref<any[]>([]);

    // Axios 호출로 데이터 가져오기
    const fetchRecords = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/record/select",
          { id: props.userData.id }
        );
        recordData.value = response.data;
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    // 장소별로 그룹화
    const groupedRecords = computed(() => {
      return recordData.value.reduce((acc, record) => {
        if (!acc[record.place]) {
          acc[record.place] = [];
        }
        acc[record.place].push(record.content);
        return acc;
      }, {} as Record<string, string[]>);
    });

    onMounted(() => {
      if (props.userData?.id) {
        fetchRecords();
      } else {
        console.warn("User data is missing or invalid.");
      }
    });

    return {
      groupedRecords,
      recordData,
    };
  },
});
</script>

<style>
.noMemoText {
  text-align: center;
  margin-top: 200px;
  font-size: 16px;
  color: #333;
}
.MenuTitle {
  font-size: 20px;
  font-weight: 600;
  text-align: center; /* 중앙 정렬 */
  border-bottom: 1px solid #ddd; /* 구분선 */
}
.MenuTitle div {
  margin-bottom: 10px;
}
.memoTitle {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}
.memoContents {
  font-size: 18px;
}
.addMomoContainer {
  border: 2px solid #f6f6f6;
  width: 320px;
  min-height: 150px;
  height: auto;
  margin-top: 40px;
  padding: 20px;
  margin-left: 40px;
}
.memoContent {
  background-color: #fbfbfb;
  margin-top: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
}
</style>
