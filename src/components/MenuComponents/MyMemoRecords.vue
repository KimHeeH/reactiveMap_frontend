<template>
  <div class="memoMenuTitle">나의 메모 기록</div>
  <div
    v-for="(contents, place, title) in groupedRecords"
    :key="title"
    class="addMomoContainer"
  >
    <div class="memoTitle">{{ place }}</div>
    <div>메모({{ contents.length }})</div>
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
    userdata: {
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
          { id: props.userdata.id }
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
      if (props.userdata?.id) {
        fetchRecords();
      } else {
        console.warn("User data is missing or invalid.");
      }
    });

    return {
      groupedRecords,
    };
  },
});
</script>

<style>
.memoMenuTitle {
  font-size: 20px;
  font-weight: 600;
}
.memoTitle {
  font-size: 20px;
  font-weight: 600;
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
}
.memoContent {
  background-color: #fbfbfb;
  margin-top: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
