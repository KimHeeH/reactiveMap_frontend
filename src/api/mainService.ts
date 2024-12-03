const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;
const SEARCH_CLIENT_ID = import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID;
const SEARCH_CLIENT_SECRET = import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET;
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
