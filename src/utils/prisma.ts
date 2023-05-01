import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log(`prisma connected`)
        return true
        
    }catch (err) {
        // console.log(err);
        console.log("I ran")
        process.exit(1)
    }finally {
        await prisma.$disconnect();
    }
    
}


export const getAccount = async() => {
    const data = await prisma.accounting_record.findMany()
    console.log(data)
    return  data
} 
   




