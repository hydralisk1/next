import { NextApiRequest, NextApiResponse } from 'next'
import { authenticate, getUserById } from '@/lib/user'
import { User } from '@/store/session'
import { setTokenCookie, clearToken, getUserId } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method) {
    case 'POST':
      const { email, password } = req.body
      const user: User | null = await authenticate({ email, password })
      if(user){
        setTokenCookie(res, user)
        res.status(200).json(user)
      }else res.status(401).json({ message: 'User not found' })
      break
    case 'DELETE':
      clearToken(res)
      res.status(200).json({ message: 'Token cleared' })
      break
    case 'GET':
      const id: string | null = getUserId(req)
      if(id) {
        const user: User | null = await getUserById(id)
        if(user) return res.status(200).json(user)
      }
      res.status(401).json({ message: 'User not found' })
      break
    default:
      res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
