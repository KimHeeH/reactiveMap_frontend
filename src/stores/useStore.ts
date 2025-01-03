import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    coords: { x: "0", y: "0" },
  }),
  actions: {
    async setCoords(coords: { x: string; y: string }) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.coords = coords;
    },
  },
});
