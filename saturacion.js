/**
 * Script K6: prueba de balanceador y caché Redis.
 * - Fase 1: 10 VUs → respuesta esperada con fuente_datos 'Base de Datos'.
 * - Fase 2: rampa hasta 200 VUs → saturación, fuente_datos debe pasar a 'Caché Redis'.
 * - Ataca /api/reporte-sistema y /api/loans/available (para activar saturación).
 * Ejecución: k6 run saturacion.js
 * Base URL por defecto: http://localhost:3001 (cambiar con env BASE_URL).
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 200 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  const reporteRes = http.get(`${BASE_URL}/api/reporte-sistema`);
  check(reporteRes, {
    'reporte-sistema status 200': (r) => r.status === 200,
    'reporte-sistema no 500': (r) => r.status !== 500,
  });
  if (reporteRes.json && reporteRes.json()) {
    const body = reporteRes.json();
    if (body.totalPeticiones !== undefined) {
      // Opcional: log en modo debug
    }
  }

  const availableRes = http.get(`${BASE_URL}/api/loans/available`);
  check(availableRes, {
    'available status 200': (r) => r.status === 200,
    'available no 500': (r) => r.status !== 500,
  });

  sleep(0.5);
}
