import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

import userList from './user'
import categoryList from './category'
import productList from './product'
import pictureList from './picture';
(async () => {
    try {
        await prisma.users.createMany({
            data: [
                ...userList
            ]
        })
        await prisma.categories.createMany({
            data: [
                ...categoryList
            ]
        })
        await prisma.products.createMany({
            data: [
                ...productList
            ]
        })
        await prisma.pictures.createMany({
            data: [
                ...pictureList
            ]
        })
    } catch (err) {
        console.log("da vao err", err)
    }
})()