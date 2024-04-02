import { Body, Controller, Get, Post, Req, Res, ParseIntPipe, Param, Patch } from '@nestjs/common';
import { Response, Request } from "express"
import { ProductService } from './product.service';
import { RequestToken } from 'src/common/interface';
import { createProductDTO } from './dto/create.product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @Get('/')
  async findMany(@Res() res: Response) {
    try {
      let { data, err } = await this.productService.findMany()
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
  @Post('/')
  async create(@Req() req: RequestToken, pictures: any, @Body() body: any, @Res() res: Response) {
    try {
      let { newProduct, pictures } = body
      let { err, data } = await this.productService.create(newProduct, pictures);
      if (err) {
        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Tạo product thành công!",
        data
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({

        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Patch('/:id')
  async update(@Param('id', ParseIntPipe) id: number, hide: boolean, @Body() body: any, @Req() req: RequestToken, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.update(id, body);
      if (err) {
        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Update sản phẩm thành công!",
        data: {
          data,
          hide: true,
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Patch('/back/:id')
  async updateback(@Param('id', ParseIntPipe) id: number, hide: boolean, @Body() body: any, @Req() req: RequestToken, @Res() res: Response) {
    try {
      let { err, data } = await this.productService.updateback(id, body);
      if (err) {
        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Update sản phẩm thành công!",
        data: {
          data,
          hide: false,
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
}
