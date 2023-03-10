import Cookies from 'js-cookie'

interface Options {
  method?: string
  headers?: Record<string, string>
  body?: string
}

export async function csrfFetch(url: string, options: Options = {}): Promise<Response> {
  options.method = options.method || 'GET'
  options.headers = options.headers || {}

  if(options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN') as string
  }

  const res = await window.fetch(url, options as RequestInit)

  if(res.status >= 400) throw res

  return res
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore')
}
