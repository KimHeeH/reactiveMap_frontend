import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    coords: { x: 0, y: 0 },
  }),
  actions: {
    setCoords(coords: { x: number; y: number }) {
      this.coords = coords;
    },
  },
});
