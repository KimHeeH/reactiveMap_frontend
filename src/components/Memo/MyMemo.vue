<template>
  <div>
    <div style="margin-left: 10px">나의 메모</div>
    <div v-if="noMemo" class="memoContainer">
      <div class="IconContainer"><NoMemoIcon /></div>
      <div style="margin-top: -10px; color: #828282">작성된 메모가 없어요</div>
      <div class="memoAddBtn" @click="memoAdd">메모 추가</div>
    </div>
    <div v-else>
      <div class="memoAddContainer">
        <div class="memoAddTitle">
          <input v-model="inputTitleValue" placeholder="제목을 입력하세요" />
        </div>
        <div class="memoAddContent">
          <textarea
            v-model="inputContentValue"
            rows="5"
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>
      </div>
      <div class="memoFooter">
        <div class="memoRegister" @click="memoRegister">메모 등록</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";

import { defineComponent, ref, PropType } from "vue";
import NoMemoIcon from "../../assets/icons/NoMemoIconComponent.vue";
import { useStore } from "@/stores/useStore";
interface MyMemoData {
  noMemo: boolean;
}
interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}
interface Place {
  title: string;
  roadAddress: string;
}
export default defineComponent({
  name: "MyMemo",
  components: {
    NoMemoIcon,
  },
  props: {
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
    locationName: {
      type: Array as PropType<Place[]>,
      required: true,
    },
  },
  data(): MyMemoData {
    return {
      noMemo: true,
    };
  },
  setup(props) {
    const store = useStore();
    const coords = store.coords;
    const inputTitleValue = ref("");
    const inputContentValue = ref("");

    const memoRegister = async () => {
      console.log("제목:", inputTitleValue.value);
      console.log("내용:", inputContentValue.value);
      console.log(props.userData);
      console.log("위치는?", coords);
      console.log(
        "장소 이름은",
        props.locationName[0].title.replace(/<\/?[^>]+(>|$)/g, "")
      );
      try {
        console.log("등록 전 좌표 확인", store.coords);
        await store.setCoords(store.coords);
        console.log("등록 후 좌표 확인", store.coords);
        const response = await axios.post("http://localhost:3000/memos", {
          userId: props.userData.id,
          placeName: props.locationName[0]?.title.replace(
            /<\/?[^>]+(>|$)/g,
            ""
          ),
          coords: store.coords,
        });
        console.log("서버응답", response.data);
        alert("메모가 성공적으로 등록되었습니다.");
      } catch (error) {
        console.error("서버 요청 실패", error);
        alert("메모 등록 중 오류가 발생했습니다.");
      }
    };

    return {
      inputTitleValue,
      inputContentValue,
      memoRegister,
      coords,
    };
  },

  methods: {
    memoAdd() {
      this.noMemo = false;
    },
  },
});
</script>
<style scooped>
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
.memoAddContainer {
  background-color: #e6f0f5;
  width: 95%;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  height: auto;
}
.memoAddTitle {
  background-color: white;
  height: 30px;
}
.memoAddContent {
  background-color: white;
  height: 110px;
  margin-top: 20px;
}
.memoAddContainer input {
  border: none;
  width: 99%;
  height: 30px;
  margin-left: 0px;
  outline: none;
  font-size: 16px;
  padding: 10px;
}

.memoAddContent textarea {
  border: none;
  width: 99%;
  resize: none; /* 사용자가 크기를 조절하지 못하게 */
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box; /* 패딩 포함 크기 조절 */
  background-color: #ffffff;
  border-radius: 5px;
  height: 110px;
  outline: none; /* 클릭했을 때 생기는 테두리 제거 */
}
.memoAddBtn {
  text-align: center;
  background-color: #fafafa;
  width: 95px;
  height: 35px;
  font-size: 14px;
  line-height: 35px;
  border: 1px solid #f6f6f6;
}
.memoFooter {
  width: 95%;
  display: flex;
  justify-content: flex-end;
}
.memoRegister {
  cursor: pointer;
}
</style>
