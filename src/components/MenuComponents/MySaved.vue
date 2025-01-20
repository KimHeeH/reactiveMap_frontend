<template>
  <div>
    <div style="font-size: 20px; font-weight: 600">저장됨</div>

    <div>
      <div class="savedItem" v-for="place in savedData">
        <!-- <div class="savedImg"><img src="image" /></div> -->
        <div>{{ place }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { PropType } from "vue";
// import image from "@/assets/image.png"; // Vite에서 @를 src 경로로 사용
interface UserData {
  id: string;
  username: string;
  kakaoId: string;
}
export default defineComponent({
  name: "MySavedComponent",
  props: {
    userData: {
      type: Object as PropType<UserData>,
      required: true,
    },
  },

  setup(props) {
    const savedData = ref<any[]>([]);
    const savedList = ref<any[]>([]);
    console.log(props.userData);
    const fetchSaved = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/bookmark/select",
          {
            id: Number(props.userData.id),
          }
        );
        console.log(response.data);
        savedData.value = response.data.map((place) => place.place);
        console.log(savedData);
      } catch (error) {
        console.error("error");
      }
    };
    onMounted(() => {
      fetchSaved();
    });
    return {
      savedData,
    };
  },
});
</script>

<style>
.savedItem {
  height: 100px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.savedImg {
  width: 80px;
  height: 80px;
  border: 1px solid #949494;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
}
</style>
