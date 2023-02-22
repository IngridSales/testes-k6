import http from 'k6/http';
import { sleep, check } from 'k6'

import uuid from './libs/uuid.js'

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 600 },
    { duration: '5m', target: 600 },
    { duration: '10m', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% da requisicoes devem responder em ate 2s
    http_req_failed: ['rate<0.01'] // 1% das requisicoes podem ocorrer erro
  }
}

export default function () {
  const url = 'http://localhost:3333/signup'

  const payload = JSON.stringify(
    { email: `${uuid.v4().substring(24)}@qa.test.com.br`, password: 'pwd123' }
  )

  const headers = {
    'headers': {
      'Content-Type': 'application/json'
    }
  }

  const res = http.post(url, payload, headers)

  check(res, {
    'status should be 201': (r) => r.status === 201
  })

  sleep(1)
}
