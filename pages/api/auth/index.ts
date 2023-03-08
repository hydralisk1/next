import { NextApiRequest, NextApiResponse } from 'next'
import { authenticate, UserWithoutPassword } from '@/lib/user'
import { setTokenCookie, clearToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) {
    case 'POST':
      const { email, password } = req.body
      const user: UserWithoutPassword | null = await authenticate({ email, password })
      if(user){
        setTokenCookie(res, user)
        res.status(200).json(user)
      }else res.status(401).json({ message: 'User not found' })
      break
    case 'DELETE':
      clearToken(res)
      res.status(200).json({ message: 'Token cleared' })
      break
    default:
      res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
