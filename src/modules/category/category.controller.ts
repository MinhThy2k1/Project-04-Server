import { Controller, Get, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response, Request } from "express"

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }
  @Get('/')
  async findMany(@Res() res: Response) {
    try {
      let { data, err } = await this.categoryService.findMany()
      if (err) {
        throw {
          message: "Lỗi cơ sở dữ liệu!"
        }
      }
      return res.status(200).json({
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      })
    }
  }
}
