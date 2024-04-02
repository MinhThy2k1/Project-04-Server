import { Body, Controller, Get, Post, Req, Res, ParseIntPipe, Param, Patch, Delete } from '@nestjs/common';
import { Response, Request } from "express"
import { ReceiptService } from './receipt.service';
import { RequestToken } from 'src/common/interface';
import { updateReceiptDTO } from './dto/receipt.update.dto';
import axios from 'axios'; // Không cần '.default' vì TypeScript hiểu được các module ES6
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import qs from 'qs'; // Đây là một module TypeScript, không cần chỉnh sửa gì nhiều
const config = {
  appid: process.env.ZALO_APP_ID,
  key1: process.env.ZALO_KEY1,
  key2: process.env.ZALO_KEY2,
};


@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }

  @Get('/')
  async findMany(@Req() req: RequestToken, @Res() res: Response, @Body() body: any,) {
    try {
      let id = req.tokenData.id
      let { data, err } = await this.receiptService.findMany(Number(id))
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
  @Get('/findallreceipt') // Định nghĩa endpoint mới để tìm tất cả các phiếu
  async findAllReceipt(@Res() res: Response) {
    try {
      const receipts = await this.receiptService.findAllReceipt(); // Gọi hàm findAllReceipt từ service
      return res.status(200).json({
        data: receipts
      });
    } catch (err) {
      console.error("Error finding all receipts:", err);
      return res.status(500).json({
        message: "Failed to find all receipts",
        error: err.message ? err.message : "Internal Server Error"
      });
    }
  }
  @Post('/add-to-cart')
  async addToCard(@Req() req: RequestToken, @Res() res: Response, @Body() body: any) {
    try {
      let userId = req.tokenData.id
      let { data, err } = await this.receiptService.addToCart(userId, req.body)
      if (err) {
        throw {
          message: "Lỗi cơ sở dữ liệu!"
        }
      }
      return res.status(200).json({
        data
      })

    } catch (err: any) {
      console.log(err);

      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      })
    }
  }
  @Delete('/:id')
  async delete(
    @Param('id', ParseIntPipe) itemId: number,
    @Req() req: RequestToken,
    @Res() res: Response,
    @Body() body: any
  ) {
    try {
      let { data, err } = await this.receiptService.delete(itemId);
      if (err) {
        throw {
          message: "Lỗi cơ sở dữ liệu!"
        };
      }
      return res.status(200).json({
        data
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      });
    }
  }
  @Patch('/')
  async update(@Req() req: RequestToken, @Res() res: Response, @Body() body: any) {
    try {
      let quantity = req.body.quantity
      let id = req.tokenData.id
      let { data, err } = await this.receiptService.update(Number(id), Number(quantity))
      if (err) {
        throw {
          message: "Lỗi cơ sở dữ liệu!"
        }
      }
      return res.status(200).json({
        data
      })
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      })
    }
  }
  @Patch('/pay/:id')
  async pay(@Param('id', ParseIntPipe) receiptId: number, @Req() req: RequestToken, @Res() res: Response, @Body() body: any,) {
    try {
      let id = req.tokenData.id
      let { data, err } = await this.receiptService.pay(Number(receiptId), req.body)
      if (err) {
        throw {
          message: "Lỗi cơ sở dữ liệu!"
        }
      }
      return res.status(200).json({
        data,

      })
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      })
    }
  }
  @Patch('/updates/:id')
  async updateStatus(@Param('id', ParseIntPipe) receiptId: number, paid: boolean, @Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
    try {
      let { err, data } = await this.receiptService.updateStatus(Number(receiptId), req.body);
      if (err) {
        console.log(err);

        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Update trạng thái thành công!",
        data: {
          data,
          paid: true,
        }
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  @Patch('/done/:id')
  async doneStatus(@Param('id', ParseIntPipe) receiptId: number, paid: boolean, @Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
    try {
      let { err, data } = await this.receiptService.doneStatus(Number(receiptId), req.body);
      if (err) {
        console.log(err);

        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Update trạng thái thành công!",
        data: {
          data,
          doneAt: "done",
        }
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  // @Post('pay/zalo/')
  // async zaloCreateReceipt(@Req() req: Request, @Res() res: Response, @Body() body: any) {
  //   try {
  //     const embeddata = {
  //       merchantinfo: ""
  //     };
  //     const order = {
  //       appid: config.appid,
  //       apptransid: `${moment().format('YYMMDD')}_${Math.ceil(Date.now() * Math.random())}_${req.body.receiptId}`,
  //       appuser: req.body.userName,
  //       apptime: Date.now(),
  //       item: JSON.stringify(""),
  //       embeddata: JSON.stringify(embeddata),
  //       amount: Number(req.body.total),
  //       description: "Thanh toán đơn hàng cho HoobyGame",
  //       bankcode: "zalopayapp",
  //     };
  //     const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
  //     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  //     let result = await axios.post(process.env.CREATE_RECEIPT_API, null, { params: order })
  //     if (result.data.returncode == 1) {
  //       return res.status(200).json({
  //         qrCodeUrl: result.data.orderurl,
  //         orderId: order.apptransid
  //       })
  //     } else {
  //       throw "Zalo Error"
  //     }
  //   } catch (err) {
  //     console.log("err", err)
  //   }
  // }
  @Post('pay/zalo/')
  async zaloCreateReceipt(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const embeddata = {
        merchantinfo: ''
      };

      const order: any = {
        appid: config.appid,
        apptransid: `${moment().format('YYMMDD')}_${Math.ceil(Date.now() * Math.random())}_${req.body.receiptId}`,
        appuser: req.body.userName,
        apptime: Date.now(),
        item: JSON.stringify(""),
        embeddata: JSON.stringify(embeddata),
        amount: Number(req.body.total),
        description: "Thanh toán đơn hàng cho HoobyGame",
        bankcode: "zalopayapp",
      };

      const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
      let result = await axios.post(process.env.CREATE_RECEIPT_API, null, { params: order });

      if (result.data.returncode == 1) {
        return res.status(200).json({
          qrCodeUrl: result.data.orderurl,
          orderId: order.apptransid
        });
      } else {
        throw new Error('Zalo Error');
      }
    } catch (err) {
      console.log('err', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // @Post('pay/zalo-check/:id')
  // async zaloCheck(@Req() req: Request, @Res() res: Response, @Body() body: any) {
  //   try {
  //     let postData = {
  //       appid: config.appid,
  //       apptransid: req.params.zaloReceiptId
  //     }
  //     let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
  //     postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  //     let postConfig = {
  //       method: 'post',
  //       url: process.env.ZALO_CHECK_API,
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       data: qs.stringify(postData)
  //     };

  //     let result = await axios(postConfig)
  //     if (result.data.returncode != 1) {
  //       throw "err"
  //     }

  //     return res.status(200).json({
  //       status: true
  //     })
  //   } catch (err) {
  //     return res.status(200).json({
  //       status: false
  //     })
  //   }
  // }
  @Post('pay/zalo-check/:id')
  async zaloCheck(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      let postData: any = {
        appid: config.appid,
        apptransid: req.params.zaloReceiptId // Corrected the parameter name here
      };

      let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
      postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      let postConfig = {
        method: 'post',
        url: process.env.ZALO_CHECK_API,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
      };

      let result = await axios(postConfig);
      if (result.data.returncode != 1) {
        throw new Error('Error occurred');
      }

      return res.status(200).json({
        status: true
      });
    } catch (err) {
      return res.status(500).json({
        status: false
      });
    }
  }
}

