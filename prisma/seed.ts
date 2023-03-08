import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// type User = {
//   name: string,
//   email: string,
//   password: string,
// }

const prisma = new PrismaClient()

async function seedingUsers(): Promise<void> {
  const users: Prisma.UserCreateInput[] = [
    {
      name: "Alice",
      email: "alice@next.js",
      password: bcrypt.hashSync("password", 10)
    },{
      name: "Bob",
      email: "bob@next.js",
      password: bcrypt.hashSync("password", 10),
    },{
      name: "Charlie",
      email: "charlie@next.js",
      password: bcrypt.hashSync("password", 10),
    }
  ]

  console.log('Start seeding ...')
  users.forEach(async (user: Prisma.UserCreateInput) => {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (!existingUser) {
      await prisma.user.create({ data: user })
    }
  })
  console.log('Seeding finished.')
}

seedingUsers()
  .catch(async e => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {await prisma.$disconnect()})
