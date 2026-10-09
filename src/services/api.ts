const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms))

export async function apiGet<T>(data: T): Promise<T> {
  await wait()
  return structuredClone(data)
}

export async function apiPost<T>(data: T): Promise<T> {
  await wait()
  return structuredClone(data)
}

/*
  API-ready service layer.
  Replace these mock implementations with fetch/axios calls when a backend is available.
  Example:
  return apiClient.get('/vehicles')
*/
