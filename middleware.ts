import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-openai-api-key', process.env.OPENAI_API_KEY || '')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}