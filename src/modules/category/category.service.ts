import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }
    async findMany() {
        try {
            let category = await this.prisma.categories.findMany({})
            return {
                status: true,
                message: "ok",
                data: category
            }

        } catch (err) {
            return err
        }
    }
}
