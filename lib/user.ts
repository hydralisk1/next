import prisma from './prisma'
import bcrypt from 'bcryptjs'

export interface UserWithoutPassword {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface User extends UserWithoutPassword {
  password: string
}

export async function authenticate({email, password}: {email: string, password: string}): Promise<UserWithoutPassword | null> {
  const user: User | null = await prisma.user.findUnique({ where: { email } })
  if (user && bcrypt.compareSync(password, user.password)) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}

export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  const users:User[] = await prisma.user.findMany()
  const usersWithoutPassword = users.map((user: {
    name: string,
    email: string,
    password: string,
    id: string,
    createdAt: Date,
    updatedAt: Date
  }) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })

  return usersWithoutPassword
}

export async function createUser({name, email, password}: {name: string, email: string, password: string}): Promise<UserWithoutPassword> {
  const hashed = bcrypt.hashSync(password, 10)
  const user: User = await prisma.user.create({ data: { name, email, password: hashed } })
  const userWithoutPassword: UserWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
  return userWithoutPassword
}

export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  const user: User | null = await prisma.user.findUnique({ where: { id } })
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}

export async function updateUserById(id: string, name: string, email: string): Promise<UserWithoutPassword | null> {
  const user: User | null = await prisma.user.update({
    where: { id },
    data: { name, email }
  })
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}
