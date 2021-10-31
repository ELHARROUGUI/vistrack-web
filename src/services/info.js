import { API } from "../config";
export function getInfos() {
  return fetch(`${API}/infos`).then((data) => data.json());
}

export function createInfo(weight) {
  let now = new Date();
  return fetch(`${API}/infos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ x: weight, y: now.toString() })
  }).then((data) => data.json());
}
