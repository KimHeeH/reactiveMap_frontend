const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;
const SEARCH_CLIENT_ID = import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID;
const SEARCH_CLIENT_SECRET = import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export async function fetchGeocode(keyword: string) {
  try {
    const data = await fetchSearchResults(keyword);
    console.log(data);

    // items 배열이 존재하고, 길이가 0보다 큰지 확인
    if (data && data.items && data.items.length > 0) {
      const firstResult = data.items[0];
      const { mapx, mapy } = firstResult;

      // mapx와 mapy 값이 존재하는지 체크
      if (mapx && mapy) {
        console.log({ mapx, mapy });
        return { x: mapx, y: mapy };
      } else {
        throw new Error("지도 좌표가 없습니다.");
      }
    } else {
      throw new Error("검색 결과가 없습니다.");
    }
  } catch (error) {
    console.error("Geocode API 호출 실패:", error);
    throw error; // 예외를 다시 던져서 호출한 쪽에서 처리
  }
}

export async function fetchReverseGeocode(coords: string) {
  const url = `/api/naver/map-reversegeocode/v2/gc?coords=${coords}&orders=roadaddr,addr&output=json`;
  const response = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
      "X-NCP-APIGW-API-KEY": CLIENT_SECRET,
    },
  });
  if (!response.ok) {
    throw new Error("Reverse geocode API 호출 실패");
    return response.json();
  }
  return response.json();
}
export async function fetchSearchResults(keyword: string) {
  const url = `/api/v1/search/local.json?query=${keyword}&display=5&start=1&sort=sim`;
  const response = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": SEARCH_CLIENT_ID,
      "X-Naver-Client-Secret": SEARCH_CLIENT_SECRET,
    },
  });
  if (!response.ok) throw new Error("검색 API 호출 실패");
  return response.json();
}
import axios from "axios";
export async function fetchGetGoogleImage(address: string) {
  try {
    const response = await axios.get(
      "http://localhost:3000/google-maps/place-details",
      {
        params: {
          address: address,
        },
      }
    );
    console.log("MainService Google API 응답 데이터", response.data);
    return response.data;
  } catch (error) {
    console.error("Google API 호출 실패", error);
    throw error;
  }
}
export async function fetchGetPlaceImage(photo_reference: string) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${photo_reference}&key=${GOOGLE_API_KEY}`;
  return url;
}
