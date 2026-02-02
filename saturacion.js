import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://nginx-lb'; 

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '40s', target: 100 },
    { duration: '40s', target: 200 },
  ],
};

export default function () {
  const res = http.get(`${BASE_URL}/api/loans/available`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(0.1);
}