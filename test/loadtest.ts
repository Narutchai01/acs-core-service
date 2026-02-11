import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10000,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:8000/api/v1/students");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
