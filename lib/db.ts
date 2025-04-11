import { PrismaClient } from '@/lib/generated/prisma';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = global.prismaGlobal ?? prismaClientSingleton();

export const db = prisma; // Export as a named export
if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma;