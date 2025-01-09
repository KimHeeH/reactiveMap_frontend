<template>
    <div class="memoMenuTitle">나의 메모 기록</div>
    <div v-for="recordData in recordsData" :key="recordData.no">
        <p>{{ recordData.title }}</p>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted, PropType } from 'vue';
interface UserData {
    id: string;
    username: string;
    kakaoId: string;
}
export default defineComponent({
    name: 'MyMemoRecordsComponent',
    props: {
        userdata: {
            type: Object as PropType<UserData>,
            required: true, // 필수에서 선택사항으로 변경
        },
    },
    setup(props) {
        const recordData = ref<any[]>([]);
        const myRecords = async () => {
            try {
                console.log('userData inside child component:', props.userdata.id);

                const response = await axios.post('http://localhost:3000/record/select', { id: props.userdata.id });
                recordData.value = response.data;
                console.log(recordData.value);
            } catch (error) {
                console.error(error);
            }
        };
        onMounted(() => {
            if (!props.userdata || Object.keys(props.userdata).length === 0) {
                console.warn('userdata가 전달되지 않았습니다.');
                return;
            }
            myRecords();
        });

        return {
            recordData,
            myRecords,
        };
    },
    computed: {
        recordsData() {
            return this.recordData.map((data) => data * data);
        },
    },
});
</script>

<style>
.memoMenuTitle {
    font-size: 20px;
    font-weight: 600;
}
</style>
