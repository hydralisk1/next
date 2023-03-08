import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { UserWithoutPassword } from '@/lib/user'

export function setTokenCookie(res: NextApiResponse, user: UserWithoutPassword) {
  const secret: string = process.env.JWT_SECRET as string
  const expiresIn: number = parseInt(process.env.JWT_EXPIRES_IN as string)

  const token = jwt.sign(
    {data: user},
    secret,
    {expiresIn}
  )

  const isProduction = process.env.NODE_ENV === 'production'

  const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && 'lax',
    maxAge: expiresIn * 1000,
  }

  res.setHeader('Set-Cookie', serialize('token', token, options))

  return token
}

export function clearToken(res: NextApiResponse) {
  const isProduction = process.env.NODE_ENV === 'production'

  const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && 'lax',
    maxAge: 0,
  }

  res.setHeader('Set-Cookie', serialize('token', '', options))
}
