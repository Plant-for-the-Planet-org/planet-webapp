import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log(`prisma connected`)
        return true
        
    }catch (err) {
        console.log(err);
        process.exit(1)
    }finally {
        await prisma.$disconnect();
    }
    
}





