<template>
  <div id="map-container" style="position: relative; width: 100%; height: 100%">
    <!-- 지도 -->
    <div id="map" style="width: 100%; height: 100%"></div>

    <!-- 클릭한 장소 정보를 표시하는 DIV -->
    <div class="place-name" v-if="placeName">
      <div>{{ placeName }}</div>
      <AddIcon class="addIcon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AddIcon from "../assets/icons/AddIcon.svg";
export default defineComponent({
  components: {
    AddIcon,
  },
  name: "KakaoMap",
  setup() {
    const map = ref<any>(null);
    const marker = ref<any>(null);
    const infoWindow = ref<any>(null);
    const placeName = ref<string | null>(null); // 클릭한 장소 이름

    let geocoder: any = null; // Geocoder를 나중에 초기화

    const initMap = () => {
      const container = document.getElementById("map") as HTMLElement;
      const options = {
        center: new (window as any).kakao.maps.LatLng(37.5666805, 126.9784147), // 초기 중심 좌표
        level: 3, // 확대 레벨
      };
      map.value = new (window as any).kakao.maps.Map(container, options); // 지도 생성
      geocoder = new (window as any).kakao.maps.services.Geocoder();

      (window as any).kakao.maps.event.addListener(
        map.value,
        "click",
        (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;

          // 마커 생성 또는 위치 업데이트
          if (!marker.value) {
            marker.value = new (window as any).kakao.maps.Marker({
              position: latlng,
              map: map.value,
            });
          } else {
            marker.value.setPosition(latlng);
          }

          if (infoWindow.value) {
            infoWindow.value.close();
          }

          // Geocoder로 주소 가져오기
          geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            (result: any, status: any) => {
              if (status === (window as any).kakao.maps.services.Status.OK) {
                const address =
                  result[0]?.address?.address_name || "알 수 없는 위치";
                placeName.value = address; // 장소 이름 저장
              } else {
                placeName.value = "장소 정보를 가져올 수 없습니다.";
              }
            }
          );

          // 정보창 생성
          infoWindow.value = new (window as any).kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${placeName.value}</div>`,
          });
          infoWindow.value.open(map.value, marker.value);
        }
      );
    };

    return {
      initMap,
      placeName, // 반환 객체에 placeName 추가
    };
  },
  mounted() {
    console.log("KakaoMap.vue mounted");

    if (typeof (window as any).kakao === "undefined") {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_API_KEY
      }&libraries=services&autoload=false`;
      script.onload = () => {
        (window as any).kakao.maps.load(() => {
          this.initMap();
        });
      };
      document.head.appendChild(script);
    } else {
      (window as any).kakao.maps.load(() => {
        this.initMap();
      });
    }
  },
});
</script>
<style scoped>
#map-container {
  position: relative;
  width: 100%;
}
.place-name {
  position: absolute;
  bottom: 50px; /* 화면 아래에서 50px 위에 배치 */
  left: 50%; /* 부모 컨테이너의 가로 중앙 */
  transform: translateX(
    -50%
  ); /* 자신의 크기만큼 왼쪽으로 이동하여 정확히 중앙 정렬 */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
}
.place-name div {
  background-color: white;
  width: 300px;

  height: 70px;
  text-align: center;
  line-height: 70px;
}
.addIcon {
  z-index: 102;
  position: absolute;
  bottom: 10px;
  left: 300px;
}
</style>
