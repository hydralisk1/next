import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiResponse, NextApiRequest } from 'next'
import jwt, {JwtPayload } from 'jsonwebtoken'
import { User } from '@/store/session'

export function setTokenCookie(res: NextApiResponse, user: User) {
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

export function getUserId(req: NextApiRequest) {
  const secret: string = process.env.JWT_SECRET as string
  const token: string = req.cookies.token as string

  try{
    const { data } = jwt.verify(token, secret) as JwtPayload
    return data.id
  }catch(e) {
    return null
  }
}
