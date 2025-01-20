<template>
  <div id="map-container">
    <div id="map" style="width: 100%; height: 100%"></div>
    <div
      v-if="placeAddress"
      class="place-name"
      :class="{ animate: isAnimating }"
      @animationend="onAnimationEnd"
    >
      <div v-if="placePhoto">
        <img
          :src="placePhoto"
          alt="Place Photo"
          style="max-width: 100%; height: 100px; width: 120px"
        />
      </div>
      <div style="display: flex; flex-direction: column; margin-left: 10px">
        <div style="font-size: 23px">{{ cleanTitle(placeName || "") }}</div>
        <div style="margin-top: 10px">{{ placeAddress }}</div>
        <div class="addIconContainer"><AddIcon @click="clickDetail" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchReverseGeocode, fetchGeocode } from "../api/mainService";
import AddIcon from "../assets/icons/components/AddIcon.vue";
import { defineComponent, ref, watch } from "vue";
import { fetchSearchResults } from "../api/mainService";
import { useStore } from "@/stores/useStore";
import { addressStore } from "@/stores/useStore";
import { fetchGetGoogleImage } from "../api/mainService";
import { fetchGetPlaceImage } from "../api/mainService";
import { photoURLStore } from "@/stores/useStore";
interface CoordsObject {
  x: string;
  y: string;
}
export default {
  name: "kakaoMap",
  components: {
    AddIcon,
  },
  props: {
    searchQuery: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      placeAddress: null as string | null,
      coords: null as string | null,
      newSearchQuery: null as string | null,
      map: null as any, // 지도 객체를 데이터로 추가
      marker: null as any, // marker 객체 추가
      isAnimating: false,
      placeName: null as string | null,
      coordsObject: { x: "", y: "" } as CoordsObject, // coordsObject 타입을 지정하고 초기값을 설정
      placePhoto: null as string | null,
    };
  },

  watch: {
    async searchQuery(newQuery) {
      console.log("새로운 검색어", newQuery);

      if (!this.map) {
        // console.error("지도 객체가 초기화되지 않았습니다.");
        return;
      }
      this.newSearchQuery = newQuery;
      if (newQuery) {
        console.log(
          `${newQuery}를 받아서 moveMapToQuery 함수를 실행하겠습니다.`
        );
        // await this.moveMapToQuery(newQuery);
      }
    },
    placeAddress() {
      this.isAnimating = true;
    },
  },
  mounted() {
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${
      import.meta.env.VITE_NAVER_CLIENT_ID
    }`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            console.log("accuracy", accuracy);
            console.log("현재 위치", latitude, longitude);
            this.initializeMap(latitude, longitude);
          },
          (error) => {
            console.error("위치 정보를 가져오는데 실패했습니다.", error);
            this.initializeMap(37.5670135, 126.978374);
          },
          {
            enableHighAccuracy: true,
            timeout: 1000,
            maximumAge: 0,
          }
        );
      } else {
        console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
        this.initializeMap(37.5670135, 126.978374);
      }
    };
  },
  methods: {
    initializeMap(latitude: number, longitude: number) {
      const map = new (window as any).naver.maps.Map("map", {
        center: new (window as any).naver.maps.LatLng(latitude, longitude),
        zoom: 19,
      });
      console.log("지도 초기화 완료", map);

      const marker = new (window as any).naver.maps.Marker({
        position: new (window as any).naver.maps.LatLng(latitude, longitude),
        map: map,
      });
      map.addListener("click", (event: any) => {
        const latlng = event.coord;
        // this.getPlaceName(latlng);
        this.moveM(latlng, map, marker);
        // marker.setPosition(latlng);
      });
    },
    async moveM(latlng: any, map: any, marker: any) {
      const zoomLevel = map.getZoom();
      const targetZoom = 19;
      map.morph(latlng, targetZoom, {
        duration: 700, // 애니메이션 지속 시간 (ms)
        easing: "easeOutCubic", // 부드러운 애니메이션
      });
      if (zoomLevel !== targetZoom) {
        setTimeout(() => {
          map.setZoom(targetZoom, true); // 부드러운 줌 변경
        }, 700);
      }
      marker.setPosition(latlng);
      await this.getPlaceName(latlng);
    },
    async getPlaceName(latlng: any) {
      const coords = `${latlng.x},${latlng.y}`;
      this.coords = coords;
      this.coordsObject.x = `${latlng.x}`;
      this.coordsObject.y = `${latlng.y}`;

      // coordsObject를 store에 전달
      // this.updateCoords(this.coordsObject);
      console.log("클릭된 좌표는", coords);
      try {
        const data = await fetchReverseGeocode(coords);

        console.log("data는", data);
        if (data.results && data.results.length > 0) {
          const result = data.results[0]; // 첫 번째 결과
          const region = result.region; // 지역 정보
          const land = result.land; // 상세 정보 (도로명, 건물 번호)

          const area1 = region.area1.name; // 시/도
          const area2 = region.area2.name; // 구/군
          const area3 = region.area3.name; // 동/면/리
          const roadName = land?.name || ""; // 도로명
          const buildingNumber =
            land?.number1 && land?.number2
              ? `${land.number1}-${land.number2}` // 건물 번호
              : land?.number1 || ""; // 단일 번호

          // 주소 형식 생성
          const fullAddress = `${area1} ${area2} ${area3} ${roadName} ${buildingNumber}`;
          const newPlaceName =
            `${area1} ${area2} ${area3} ${roadName} ${buildingNumber}`.trim();
          this.placeAddress = fullAddress.trim(); // 결과 업데이트
          const placeNameData = await fetchSearchResults(this.placeAddress);

          this.placeName = placeNameData.items[0].title;
          await this.fetchGoogleImage(this.placeName as string);

          console.log("PlaceNameData는", placeNameData);
        } else {
          this.placeAddress = "주소를 가져올 수 없습니다.";
        }
      } catch (error) {
        console.error("Reverse Geocoding 실패 :", error);
        this.placeAddress = "오류 발생";
        this.$emit("updatePlaceName", null);
      }
    },
    async fetchGoogleImage(Address: string) {
      try {
        const encodedAddress = encodeURIComponent(Address);
        const response = await fetchGetGoogleImage(encodedAddress);
        console.log("Google API 응답 데이터", response);
        // const candidates = response.data.candidates;
        // console.log("candidates", candidates);
        if (response && response.candidates.length > 0 && response.candidates) {
          const photos = response.candidates[0].photos;
          const photoReference = photos[0].photo_reference;
          if (photoReference) {
            await this.fetchPlaceImage(photoReference);
          } else {
            console.error("No photo reference found in response");
          }
        } else {
          console.error("No candidates found for the given address");
        }
      } catch (error) {
        console.error("Error fetching Google image:", error);
      }
    },
    async fetchPlaceImage(photo_reference: string) {
      const url = await fetchGetPlaceImage(photo_reference);
      this.placePhoto = url;
    },
    updateMarker(latlng: any) {
      if (!this.marker) {
        this.marker = new (window as any).naver.maps.Marker({
          position: latlng,
          map: this.map,
        });
      } else {
        this.marker.setPosition(latlng);
      }
    },
    async clickDetail() {
      this.$emit("updatePlaceName", this.placeAddress);
      this.$emit("detailClicked", this.placeAddress);
      if (this.placePhoto) {
        const store = photoURLStore();
        try {
          await store.setUrl(this.placePhoto); // 비동기 처리 완료 후 진행
          console.log("placePhoto URL이 지정되었습니다.");
        } catch (error) {
          console.error("store.setUrl 오류:", error);
        }
      }
    },
    onAnimationEnd() {
      this.isAnimating = false;
    },
    cleanTitle(title: string): string {
      return title.replace(/<\/?[^>]+(>|$)/g, "");
    },
  },
};
</script>

<style>
#map-container {
  width: 100%;
  height: 100%;
}

#map {
  width: 100%; /* 너비를 100%로 설정 */
  height: 400px; /* 높이를 400px로 설정 */
}
.place-name {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 103;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 130px;
  height: auto;
  width: 400px;
  transition: all 0.5s ease;
  padding: 20px;
  flex-direction: row;
}
.place-name.animate {
  animation: slideUp 1s forwards;
}
@keyframes slideUp {
  0% {
    transform: translateY(100%) translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0) translateX(-50%);
    opacity: 1;
  }
}
.addIconContainer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  align-items: end;
}
</style>
