import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.$connect()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("Error while connecting to the database:", err);
    });

export { prisma };
