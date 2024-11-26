import axios from "axios";

export const SERVER_ADDRESS = axios.create({
  baseURL: "http://localhost:3000", // 서버 주소
  headers: { "Content-Type": "application/json" }, // 데이터를 json 형식으로 전환
});
