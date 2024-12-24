<template>
  <div id="map-container">
    <div id="map" style="width: 100%; height: 100%"></div>
    <div v-if="placeName" class="place-name">
      <div style="margin-top: 10px">{{ placeName }}</div>
      <div class="addIconContainer"><AddIcon @click="clickDetail" /></div>
      <!-- <div>클릭된 좌표는 ({{ coords }})</div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { fetchReverseGeocode, fetchGeocode } from "../api/mainService";
import AddIcon from "../assets/icons/AddIcon.vue";
interface GeocodeResponse {
  addresses?: Array<{ x: string; y: string }>;
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
      placeName: null as string | null,
      coords: null as string | null,
      newSearchQuery: null as string | null,
      map: null as any, // 지도 객체를 데이터로 추가
      marker: null as any, // marker 객체 추가
    };
  },
  watch: {
    async searchQuery(newQuery) {
      console.log("새로운 검색어", newQuery);

      if (!this.map) {
        console.error("지도 객체가 초기화되지 않았습니다.");
        return;
      }
      this.newSearchQuery = newQuery;
      if (newQuery) {
        console.log(
          `${newQuery}를 받아서 moveMapToQuery 함수를 실행하겠습니다.`
        );
        await this.moveMapToQuery(newQuery);
      }
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
      const map = new (window as any).naver.maps.Map("map", {
        center: new (window as any).naver.maps.LatLng(37.5670135, 126.978374),
        zoom: 10,
      });
      console.log("지도 초기화 완료", map);

      let marker: any = null;

      map.addListener("click", (event: any) => {
        const latlng = event.coord;
        this.getPlaceName(latlng);
        if (this.newSearchQuery) {
        }
        if (!marker) {
          marker = new (window as any).naver.maps.Marker({
            position: latlng,
            map: map,
          });
        } else {
          marker.setPosition(latlng);
        }
      });
    };
  },
  methods: {
    async moveMapToQuery(query: string) {
      if (!this.map) {
        console.error("지도 객체가 초기화되지 않았습니다.");
        return; // 지도 객체가 없으면 함수 종료
      }

      try {
        // 좌표 데이터를 받아오기
        const data = await fetchGeocode(query);

        if (data) {
          const { x, y } = data; // x와 y 값을 가져옵니다.

          console.log(`좌표: x = ${x}, y = ${y}`);

          // 문자열로 받은 좌표를 숫자로 변환
          const latitude = parseFloat(y); // 위도 (y)
          const longitude = parseFloat(x); // 경도 (x)

          if (!isNaN(latitude) && !isNaN(longitude)) {
            // 네이버 지도에서 사용할 LatLng 객체 생성 (y, x 순서)
            const latlng = new window.naver.maps.LatLng(latitude, longitude);

            // 지도 이동 및 마커 업데이트
            this.map.setCenter(latlng); // 지도 중심 이동
            this.updateMarker(latlng); // 마커 업데이트
            this.getPlaceName(latlng); // 장소 이름 업데이트
          } else {
            console.error("좌표 변환 실패");
            this.placeName = "좌표 변환 실패";
          }
        } else {
          console.error("검색 결과가 없습니다.");
          this.placeName = "검색 결과가 없습니다.";
        }
      } catch (error) {
        console.error("Geocoding 실패:", error);
        this.placeName = "오류 발생";
      }
    },
    onMapReady(map: any) {
      this.map = map;
      console.log("지도 초기화 완료:", this.map);
      // map 객체가 준비되었을 때만 moveMapToQuery 호출
      if (this.map) {
        console.log("지도 객체 준비 완료");
      }
    },
    async getPlaceName(latlng: any) {
      const coords = `${latlng.x},${latlng.y}`;
      this.coords = coords;
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
          this.placeName = fullAddress.trim(); // 결과 업데이트
        } else {
          this.placeName = "주소를 가져올 수 없습니다.";
        }
      } catch (error) {
        console.error("Reverse Geocoding 실패 :", error);
        this.placeName = "오류 발생";
        this.$emit("updatePlaceName", null);
      }
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
    clickDetail() {
      this.$emit("updatePlaceName", this.placeName);
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
  height: 100px;
}
.addIconContainer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  align-items: end;
  margin-bottom: 10px;
}
</style>
