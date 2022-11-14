import { sleep, group, check } from 'k6'
import http from 'k6/http'
import { vus,duration,latestdoctor, selectdoctor } from './env_sunai.js'
export const options = { 
     vus: vus,
     duration: duration,
     thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<2001'], // 95% of requests should be below 600ms
      },
     }

export default function main() {
  let response
 

  // Availble Doctor in latest Days 
  group(
    `Page_1 : ${latestdoctor}`,
    function () {
      response = http.get(
        latestdoctor,
        {
          headers: {
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
          },
        }
      )
      check(response,{
        "find a doctor status is ok 200": (r)=> r.status === 200,
    })
      sleep(14.5)
    }
  )

  // Select Any Availble Apointment 
  group(
    `Page_2 ${selectdoctor}`,
    function () {
      response = http.get(
        selectdoctor,
        {
          headers: {
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
          },
        }
      )
      check(response,{
        "get schedule appointment status is ok 200": (r)=> r.status === 200,
    })
      
    }
  )

   // Post the details about you for book apointment with availble slot

  group(
    'page_4 - https://doctor.mountsinai.org/schedule-appointment?pid=0000072500001497174922&officeId=0000072440074827831371&epicVisitId=2252&timeslot=2022-11-12T11%3A00%3A00',
    function () {
      response = http.post(
        'https://doctor.mountsinai.org/api/graphql/apollo/fad/results',
        '{"operationName":"Submit","variables":{"formData":{"patient":{"firstName":"sjbdbf","lastName":"rge","dob":"2009-02-03","gender":"male","address":{"street":"k-sector","city":" Birmingham","state":"Alabama","zipCode":"35242","email":"realvk4n@gmail.com","phones":[{"type":"Home Phone","number":"(834) 773-4677"}]}},"appointment":{"departmentId":"8349002","departmentIdType":"External","visitTypeId":"2252","visitTypeIdType":"External","providerId":"1659605186","providerIdType":"NPI","date":"2022-11-12","time":"11:00:00","reasonForVisit":"[\\"Hepatitis A Vaccine\\",\\"GERD\\",\\"General Consultation\\"]","referringProviderName":"","insurance":{"insuranceName":"EmblemHealth - HIP-Medicare","memberNumber":"","groupNumber":""}}}},"query":"mutation Submit($formData: FormData!) {\\n  submit(formData: $formData) {\\n    httpStatus\\n    message\\n    __typename\\n  }\\n  session(formData: $formData) {\\n    httpStatus\\n    message\\n    sessionId\\n    viewId\\n    objectId\\n    __typename\\n  }\\n}\\n"}',
        {
          headers: {
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            accept: '*/*',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            origin: 'https://doctor.mountsinai.org',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
          },
        }
      )
      check(response,{
        "post appointment details status is ok 200": (r)=> r.status === 200,
    })
    }

  )
}