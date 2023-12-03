import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupDto } from './dto';
import { AuthDocs } from './auth.docs';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
@AuthDocs.Controller()
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Post(['signup'])
  @HttpCode(200)
  @AuthDocs.Singup()
  signup(@Body() dto: SingupDto) {
    return this.authServie.signup(dto);
  }

  @Post(['signin'])
  @HttpCode(200)
  @AuthDocs.Signin()
  signin(@Body() dto: SigninDto) {
    return this.authServie.singin(dto);
  }
}
