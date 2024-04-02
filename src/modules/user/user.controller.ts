import { Body, Controller, Ip, Post, Req, Res, Get, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt'
import { Request, Response } from "express"
import { util } from 'src/utils';
import { userLoginDTO } from './dto/login.user.dto';
import { RequestToken } from 'src/common/interface';
import axios from 'axios';
import { UpdateAddressDTO } from './dto/update.address.dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService
  ) { }
  @Post("/register")
  async createUser(@Body() body: CreateUserDTO, @Res() res: Response) {
    try {
      let { data, err } = await this.userService.create({
        ...body,
        password: hashSync(body.password, 10),
        avatar: "https://cdn-icons-png.flaticon.com/512/8188/8188362.png",
        createAt: String(Date.now()),
        updateAt: String(Date.now())

      });
      if (err) {
        if (err.meta?.target == 'users_userName_key') {
          throw {
            message: 'Tên người dùng này đã tồn tại!'
          };
        }
        if (err.meta?.target == 'users_email_key') {
          throw {
            message: 'Email đã được sử dụng!'
          };
        }
      }
      this.mailService.sendMail(data.email, '[Nshop-G]-Xác thực địa chỉ email!',
        `
        <h3>Xác thực địa chỉ email cho tài khoản ${data.userName}</h3>
        <p>Xin chào ${data.userName ? data.userName : data.userName} ${data.userName ? data.userName : ""}, 
        đây là email xác thực địa chỉ đăng nhập, vui lòng click vào link phía dưới để xác thực email!</p>
        <p>Liên kết có thời hạn 5 phút.</p>
        <a href="${process.env.SV_API}/user/confirm_email/${util.token.createToken({
          ...data,
          emailConfirm: true
        })}">Xác thực ngay!</a>
        `)



      return res.status(200).json({
        message: "Tạo tài khoản thành công!",
        data
      })

    } catch (err) {
      return res.status(500).json({
        message: err.message ? [err.message] : ["loi sever"]
      })


    }

  }
  @Post('/login')
  async login(@Ip() ip: string, @Req() req: Request, @Body() body: userLoginDTO, @Res() res: Response) {
    let realIpList = (req as any).headers['x-forwarded-for'] ? (req as any).headers['x-forwarded-for'] : ip
    try {
      let { data, err } = await this.userService.findUser(body.loginInfo)
      if (err) {
        throw {
          message: err
        }
      }

      if (!compareSync(body.password, data.password)) {
        throw {
          message: "Mật khẩu không chính xác!"
        }
      }
      if (body.loginInfo.includes("@") && data.emailConfirm != true) {
        this.mailService.sendMail(data.email, '[Nshop-G]-Xác thực địa chỉ email!',
          `
        <h3>Xác thực địa chỉ email cho tài khoản ${data.userName}</h3>
        <p>Xin chào ${data.userName ? data.userName : data.userName}, 
        đây là email xác thực địa chỉ đăng nhập, vui lòng click vào link phía dưới để xác thực email!</p>
        <p>Liên kết có thời hạn 5 phút.</p>
        <a href="${process.env.SV_API}/user/confirm_email/${util.token.createToken({
            ...data,
            emailConfirm: true
          })}">Xác thực ngay!</a>
        `)
        throw {
          message: `Địa chỉ email của bạn chưa được xác thực, không thể đăng nhập bằng email, chúng tôi đã gửi mail xác thực cho ${data.email}!`
        }
      }
      if (!JSON.parse(data.ipList).find((item: string) => item == realIpList.split(',')[0])) {
        let NewIpList = JSON.stringify([...JSON.parse(data.ipList), realIpList.split(',')[0]])

        this.mailService.sendMail(data.email, '[Nshop-G]-Cập nhật vị trí đăng nhập mới!',
          `
        <h3>Cập nhật vị trí đăng nhập mới cho tài khoản ${data.userName}</h3>
        <p>Xin chào ${data.userName ? data.userName : data.userName}, 
        chúng tôi phát hiện bạn đang đăng nhập ở vị trí mới, vui lòng click vào link phía dưới để xác thực vị trí đăng nhập mới!</p>
        <p>Địa chỉ IP:${realIpList.split(',')[0]}, liên kết có thời hạn 5 phút.</p>
        <a href="${process.env.SV_API}/user/confirm_ip/${util.token.createToken({
            ...data,
            ipList: NewIpList,
          })}">Xác thực ngay!</a>
        `)
        throw {
          message: "Bạn đang đăng nhập ở vị trí mới, vui lòng vào email xác nhận!"
        }
      }
      let lastLogin = String(Date.now())
      await this.userService.update(data.id, {
        ...data,
        lastLogin,
      })
      let result = await this.userService.findById(data.id)
      return res.status(200).json({
        ...data,
        token: util.token.createToken(result.data, "1d"),
        message: "Đăng nhập thành công!"
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message ? [err.message] : ["Đăng nhập thất bại! Vui lòng thử lại sau!"]
      })
    }

  }
  @Get('/confirm_ip/:token')
  async confirmIp(@Req() req: RequestToken, @Res() res: Response) {
    console.log('req.tokenData', req.tokenData);

    try {
      let { data, err } = await this.userService.update(req.tokenData.id, {
        ipList: req.tokenData.ipList
      })
      if (err) {
        throw {
          message: "Thêm IP mới thất bại!"
        }
      }
      return res.status(200).send("Thêm IP mới thành công!")
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(`${err.message ? err.message : "Lỗi hệ thống, vui lòng thử lại sau!"}`)
    }
  }

  @Get('/confirm_email/:token')
  async confirmEmail(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let { data, err } = await this.userService.update(req.tokenData.id, {
        emailConfirm: true
      })
      if (err) {
        throw {
          message: "Kích hoạt email thất bại!"
        }
      }
      return res.status(200).send("Kích hoạt email thành công!")
    } catch (err) {
      return res.status(500).send(`${err.message ? err.message : "Lỗi hệ thống, vui lòng thử lại sau!"}`)
    }
  }
  @Get('/decodeToken/:token')
  async decodeToken(@Req() req: RequestToken, @Res() res: Response) {
    try {
      return res.status(200).json({
        data: req.tokenData,
        message: "decode Token thành công!"
      })
    } catch (err) {
      return res.status(500).json({
        data: null,
        message: [err.message] ? [err.message] : "decode Token không thành công!"
      })
    }
  }
  @Post('/loginWithGoogle')
  async loginWithGoogle(@Ip() ip: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      let googleTokenData = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.GOOGLE_FIREBASE_KEY}`,
        {
          idToken: body.googleToken
        })
      if (googleTokenData.data.users[0].email != body.user.email) {
        throw {
          message: "Lỗi hệ thống đăng nhập!"
        }
      }
      let { data, err } = await this.userService.findUser(googleTokenData.data.users[0].email);

      if (err) {
        let realIpList = (req as any).headers['x-forwarded-for'] ? (req as any).headers['x-forwarded-for'] : ip
        let { data, err } = await this.userService.create({
          ...req.body.user,
          emailConfirm: true,
          password: String(hashSync(body.user?.password, 10)),
          createAt: String(Date.now()),
          updateAt: String(Date.now()),
          ipList: JSON.stringify([String(realIpList)])
        })
        if (err) {
          throw {
            message: "Lỗi hệ thống đăng nhập!"
          }
        }
        let lastLogin = String(Date.now())
        await this.userService.update(data.id, {
          ...data,
          lastLogin,
        })
        let result = await this.userService.findById(data.id)
        return res.status(200).json({
          message: "Đăng nhập thành công!",
          token: util.token.createToken(result.data, "1d")
        })
      } else {
        let lastLogin = String(Date.now())
        await this.userService.update(data.id, {
          ...data,
          lastLogin,
        })
        let result = await this.userService.findById(data.id)
        return res.status(200).json({
          message: "Đăng nhập thành công!",
          token: util.token.createToken(result.data, "1d")
        })
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message ? [err.message] : ["Loi Server!"]
      })

    }
  }
  @Patch('address/:id')
  async updateaddress(@Param('id', ParseIntPipe) userId: number, address: string, @Req() req: RequestToken, @Body() body: UpdateAddressDTO, @Res() res: Response) {
    try {
      let { err, data } = await this.userService.updateaddress(Number(userId), req.body.address);
      if (err) {
        console.log(err);

        throw "Lỗi CSDL"
      }
      res.status(200).json({
        message: "Update địa chỉ thành công!",
        data: {
          address: req.body.address
        }
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err ? [err] : ["Lỗi Server!"]
      })
    }
  }
  // @Get('/finduser')
  // async findAllUser(@Param('id') id: number, @Req() req: RequestToken, @Res() res: Response) {
  //   try {

  //     const user = await this.userService.findAllUser(); // Gọi hàm findAllReceipt từ service
  //     return res.status(200).json({
  //       data: user
  //     });
  //   } catch (err) {
  //     console.error("Error finding all receipts:", err);
  //     return res.status(500).json({
  //       message: "Failed to find all receipts",
  //       error: err.message ? err.message : "Internal Server Error"
  //     });
  //   }
  // }
}

