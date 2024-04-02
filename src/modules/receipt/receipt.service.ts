import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReceiptStatus } from '@prisma/client';
import { updateReceiptDTO } from './dto/receipt.update.dto';



@Injectable()
export class ReceiptService {
    constructor(private readonly prisma: PrismaService) { }
    async findMany(userId: number) {
        try {
            let receipt = await this.prisma.receipts.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    user: true,
                    detail: {
                        include: {
                            product: true,
                        }
                    }
                }
            })
            return {
                status: true,
                message: "ok",
                data: receipt
            }

        } catch (err) {
            console.log(err);

            return err
        }
    }
    async addToCart(userId: number, item: any) {
        try {
            let cartExisted = await this.prisma.receipts.findMany({
                where: {
                    status: ReceiptStatus.shopping,
                    userId: userId
                },
                include: {
                    detail: {
                        include: {
                            product: true,
                        }
                    }
                },
            })
            if (cartExisted.length != 0) {
                /* đã có giỏ hàng */
                let cart = cartExisted[0];
                let itemExsited = cart.detail.find(itemFind => itemFind.productId == item.productId)
                if (itemExsited) {
                    /* Đã tồn tại trong giỏ hàng */
                    await this.prisma.receipt_details.update({
                        where: {
                            id: itemExsited.id
                        },
                        data: {
                            ...item,
                            quantity: itemExsited.quantity += item.quantity
                        }
                    })
                } else {
                    /* Chưa tồn tại trong giỏ hàng */
                    await this.prisma.receipt_details.create({
                        data: {
                            ...item,
                            receiptId: cart.id
                        }
                    })
                }
                let nowCart = await this.prisma.receipts.findUnique({
                    where: {
                        id: cart.id
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                })

                return {
                    status: true,
                    message: "add to cart ok (old cart new item)",
                    data: nowCart
                }
            } else {
                /* chưa có giỏ hàng */
                let newCart = await this.prisma.receipts.create({
                    data: {
                        userId: userId,
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        detail: {
                            create: [
                                item
                            ]
                        }
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                })
                return {
                    status: true,
                    message: "add to cart ok (new cart)",
                    data: newCart
                }
            }
        } catch (err) {
            console.log("err", err)
            return {
                err,
                status: false,
                message: "failed",
                data: null
            }
        }

    }
    async delete(itemId: number) {
        try {
            let receipt = await this.prisma.receipt_details.delete({
                where: {
                    id: itemId,
                }
            })
            return {
                status: true,
                message: "ok",
                data: null
            }
        } catch (err) {
            return {
                err,
                status: false,
                message: "failed",
                data: null
            }
        }
    }
    async update(itemId: number, quantity: number) {
        try {
            let receipt = await this.prisma.receipt_details.update({
                where: {
                    id: itemId,
                },
                data: {
                    quantity
                }
            })
            return {
                status: true,
                message: "ok",
                data: null
            }

        } catch (err) {
            return {
                err,
                status: false,
                message: "failed",
                data: null
            }
        }
    }
    async pay(receiptId: number, data: any) {
        try {
            const currentTime = new Date().toISOString();
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: receiptId,
                },
                data: {
                    ...data,
                    pending: String(Date.now()),
                    updateAt: String(Date.now()),
                    status: 'pending',
                    paidAt: currentTime,
                },
                include: {
                    detail: {
                        include: {
                            product: true,
                        }
                    }
                }
            })
            return {
                status: true,
                message: "ok",
                data: receipt
            }
        } catch (err) {
            return {
                err,
                status: false,
                message: "failed",
                data: null
            }
        }
    }
    async updateStatus(receiptId: number, data: any) {
        try {
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: receiptId
                },
                data: {
                    paid: true,
                },

            })
            return {
                status: true,
                message: "Cập nhật sản phẩm không thành công",
                data: receipt
            }
        } catch (err) {
            return err
        }
    }
    async doneStatus(receiptId: number, data: any) {
        try {
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: receiptId
                },
                data: {
                    doneAt: "done",
                },

            })
            return {
                status: true,
                message: "Cập nhật sản phẩm không thành công",
                data: receipt
            }
        } catch (err) {
            return err
        }
    }
    async findAllReceipt(): Promise<{ status: boolean; message: string; data: any }> {
        try {
            const receipts = await this.prisma.receipts.findMany({
                include: {
                    user: true,
                    detail: {
                        include: {
                            product: true,
                        }
                    }
                }
            });

            return {
                status: true,
                message: "Success",
                data: receipts
            };
        } catch (err) {
            console.error("Error finding receipts:", err);
            return {
                status: false,
                message: "Failed to find receipts",
                data: null
            };
        }
    }

}
