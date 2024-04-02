import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }
    async findById(id: number) {
        try {
            let user = await this.prisma.users.findUnique({
                where: {
                    id: id
                }
            })
            if (!user) {
                throw "Tài khoản không tồn tại"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    async findUser(loginInfo: string) {
        try {
            let user = await this.prisma.users.findUnique({
                where: {
                    userName: loginInfo
                }
            })
            if (!user) {
                user = await this.prisma.users.findUnique({
                    where: {
                        email: loginInfo
                    }
                })
            }
            if (!user) {
                throw "Tài khoản không tồn tại"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }

    async create(user: any) {
        try {
            let result = await this.prisma.users.create({
                data: user
            });

            return {
                data: result,
            };

        } catch (err) {
            return { err };
        }
    }
    async update(userId: number, updateData: any) {
        try {
            let user = await this.prisma.users.update({
                where: {
                    id: userId
                },
                data: {
                    ...updateData,
                    updateAt: String(Date.now())
                }
            })
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    async updateaddress(userId: number, address: string) {
        try {
            let user = await this.prisma.users.update({
                where: {
                    id: userId
                },
                data: {
                    address: address
                }
            })
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }
    // async findAllUser(): Promise<{ status: boolean; message: string; data: any }> {
    //     try {
    //         const receipts = await this.prisma.users.findMany({

    //             include: {
    //                 receipts: true,

    //             }
    //         });

    //         return {
    //             status: true,
    //             message: "Success",
    //             data: receipts
    //         };
    //     } catch (err) {
    //         console.error("Error finding receipts:", err);
    //         return {
    //             status: false,
    //             message: "Failed to find receipts",
    //             data: null
    //         };
    //     }
    // }

}
