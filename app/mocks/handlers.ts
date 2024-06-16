import { http, HttpResponse } from 'msw'

let { json } = HttpResponse

export let handlers = [
  http.get('https://api.example.com/user', () => {
    return json({ firstName: 'John', lastName: 'Maverick' })
  }),
]
