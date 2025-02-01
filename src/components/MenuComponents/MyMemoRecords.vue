<template>
  <div class="MenuTitle"><div>나의 메모 기록</div></div>
  <div v-if="recordData.length === 0" class="noMemoText">
    등록된 메모가 없어요
  </div>

  <div
    v-for="(data, place) in groupedRecords"
    :key="place"
    class="addMomoContainer"
  >
    <div class="memoImgContainer" v-if="data.images">
      <img :src="data.images" alt="메모 이미지" />
    </div>
    <div class="memoContentContainer">
      <div class="memoPlace">{{ place }}</div>
      <div style="font-size: 14px">메모({{ data.contents.length }})</div>
      <div
        class="memoContent"
        v-for="(content, index) in data.contents"
        :key="index"
      >
        {{ content }}
      </div>
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
        console.log("recordData ", recordData.value);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    // 장소별로 그룹화
    const groupedRecords = computed(() => {
      return recordData.value.reduce((acc, record) => {
        if (!acc[record.place]) {
          acc[record.place] = { contents: [], images: record.images };
        }
        acc[record.place].contents.push(record.content);
        return acc;
      }, {} as Record<string, { contents: string[]; images: string }>);
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
.memoPlace {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  white-space: normal; /* 줄바꿈 허용 */
  line-height: 1.4;
}

.addMomoContainer {
  border: 2px solid #f6f6f6;
  background-color: #fff;
  width: 320px;
  min-height: 150px;
  height: auto;
  margin-top: 40px;
  padding: 20px;
  margin-left: 40px;
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* 상단 정렬로 겹침 방지 */
  gap: 10px;
}
.memoContent {
  background-color: #fbfbfb;
  margin-top: 5px;
  line-height: 1.5;
  height: 40px;
  height: auto;
  display: flex;
  align-items: center;
  font-size: 14px;
  word-break: break-word; /* 단어가 길 경우 줄바꿈 */
}
.memoContentContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 여유 공간을 채우도록 설정 */
  word-wrap: break-word; /* 긴 단어 자동 줄바꿈 */
  justify-content: space-between; /* 요소 간 간격 균등 분배 */
  height: 100%;
  box-sizing: border-box;
}
.memoImgContainer {
  flex-shrink: 0; /* 이미지 크기 고정 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; /* 이미지 크기 고정 */
}
.memoImgContainer img {
  width: 105px;
  height: 100px;
  max-height: 150px; /* 최대 높이 제한 */
  border-radius: 5px;
  object-fit: cover; /* 이미지 비율 유지 */
}
</style>
