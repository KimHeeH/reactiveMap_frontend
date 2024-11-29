<template>
  <div id="map-container" style="position: relative; width: 100%; height: 100%">
    <div id="map" style="width: 100%; height: 100%"></div>
    <div v-if="placeName" class="place-name">
      <div>{{ placeName }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      placeName: null as string | null,
    };
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

      let marker: any = null;

      map.addListener("click", (event: any) => {
        const latlng = event.coord;
        this.getPlaceName(latlng);

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
    async getPlaceName(latlng: any) {
      const coords = `${latlng.x},${latlng.y}`;

      try {
        const response = await fetch(
          `/api/naver/map-reversegeocode/v2/gc?coords=${coords}&orders=roadaddr,addr&output=json`,
          {
            headers: {
              "X-NCP-APIGW-API-KEY-ID": `${
                import.meta.env.VITE_NAVER_CLIENT_ID
              }`,
              "X-NCP-APIGW-API-KEY": `${
                import.meta.env.VITE_NAVER_CLIENT_SECRET
              }`,
            },
          }
        );

        const data = await response.json();
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
          this.$emit("updatePlaceName", newPlaceName);
        } else {
          this.placeName = "주소를 가져올 수 없습니다.";
        }
      } catch (error) {
        console.error("Reverse Geocoding 실패 :", error);
        this.placeName = "오류 발생";
        this.$emit("updatePlaceName", null);
      }
    },
  },
};
</script>

<style scoped>
#map-container {
  position: relative;
  width: 100%;
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
}
</style>
