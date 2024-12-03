import { CorsFetchBaseURL } from './config'

export async function corsFetch(url: string, { method = 'GET', headers = {}, body }) {
  const response = await fetch(`${CorsFetchBaseURL}/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method,
      url,
      headers,
      body
    })
  })
  return response
}
