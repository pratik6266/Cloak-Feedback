import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient({
  log: ["error"],
});

export default prisma;