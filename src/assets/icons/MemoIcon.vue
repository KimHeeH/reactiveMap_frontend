<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="iconClass"
  >
    <g transform="scale(0.9)">
      <circle
        cx="25"
        cy="25"
        r="24"
        fill="white"
        stroke="#345DAB"
        stroke-width="2"
      />
      <path
        d="M19.1665 30.8333H22.8448L34.214 19.4642C34.701 18.976 34.9745 18.3146 34.9745 17.625C34.9745 16.9354 34.701 16.274 34.214 15.7858C33.7187 15.3124 33.06 15.0482 32.3748 15.0482C31.6897 15.0482 31.0309 15.3124 30.5357 15.7858L19.1665 27.155V30.8333Z"
        fill="#345DAB"
      />
    </g>

    <defs>
      <clipPath id="clip0_251_174">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(15 15)"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MemoIcon",
  props: {
    width: {
      type: String,
      default: "50", // 기본 너비
    },
    height: {
      type: String,
      default: "50", // 기본 높이
    },
    iconClass: {
      type: String,
      default: "", // 추가 클래스명
    },
  },
});
</script>

<style scoped>
/* 필요시 스타일 추가 */
</style>
