import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, verifySessionCookie } from './session'

export const requireDashboardSession = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return verifySessionCookie(cookie)
}
