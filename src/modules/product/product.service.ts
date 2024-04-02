import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { updateProductDTO } from './dto/update.product.dto';
import { createProductDTO } from './dto/create.product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }
    async findMany() {
        try {
            let product = await this.prisma.products.findMany({
                include: {
                    pictures: true,
                    category: true
                }
            })
            return {
                status: true,
                message: "ok",
                data: product
            }

        } catch (err) {
            return err
        }
    }
    async create(data: createProductDTO, picture: any) {
        try {
            let product = await this.prisma.products.create({
                data: {
                    ...data,
                    pictures: {
                        create: [
                            ...picture
                        ]
                    }
                },
                include: {
                    pictures: true,
                    category: true,
                }
            })
            return {
                status: true,
                message: "ok",
                data: product
            }

        } catch (err) {
            console.log(err);
            return err
        }
    }
    async update(id: number, data: updateProductDTO) {
        try {
            let product = await this.prisma.products.update({
                where: {
                    id: id
                },
                data: {
                    hide: true,
                },
                // include: {
                //     category: true,
                // }
            })
            return {
                status: true,
                message: "Cập nhật sản phẩm không thành công",
                data: product
            }
        } catch (err) {
            return err
        }
    }
    async updateback(id: number, data: updateProductDTO) {
        try {
            let product = await this.prisma.products.update({
                where: {
                    id: id
                },
                data: {
                    hide: false,
                },
                // include: {
                //     category: true,
                // }
            })
            return {
                status: true,
                message: "Cập nhật sản phẩm không thành công",
                data: product
            }
        } catch (err) {
            return err
        }
    }
}
