import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/"; // index.ts를 자동으로 가져옴

const app = createApp(App);
app.use(router);
app.mount("#app");
