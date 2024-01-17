import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalGuard } from 'app/auth/guard';
import { CheckCredentialDto, UpdatePasswordDto } from './dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserDocs } from './user.docs';
import { UserService } from './user.service';
import { GetUser } from 'app/decorator';
import { Role } from 'app/decorator/role.decorator';
import { RoleGuard } from 'app/guard';
import { SetContributerDto } from './dto/set-contributor';
import { UserDomain } from 'domains';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileNameTransformPipe,
  FileOptionFactory,
  UserProfileImageArtifactConfig,
} from 'app/config';

@Controller('user')
@UserDocs.Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(LocalGuard)
  @UserDocs.GetMyProfile()
  getMyProfile(@GetUser() user: UserDomain) {
    return this.userService.getMyProfile(user);
  }

  @Get('profile/:uid')
  @UseGuards(LocalGuard)
  @UserDocs.GetProfile()
  getProfile(@Param('uid') uid: string) {
    return this.userService.getProfile(uid);
  }

  @Post('credential')
  @HttpCode(200)
  @UserDocs.CheckCredential()
  checkCredential(@Body() dto: CheckCredentialDto) {
    return this.userService.checkCredential(dto);
  }

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor(
      'profile',
      FileOptionFactory(UserProfileImageArtifactConfig),
    ),
  )
  @UseGuards(LocalGuard)
  @UserDocs.updateUserInfo()
  updateUserInfo(
    @GetUser() user: UserDomain,
    @Body() dto: UpdateUserInfoDto,
    @UploadedFile(FileNameTransformPipe) file: Express.Multer.File,
  ) {
    return this.userService.updateUserInfo(user, dto, file);
  }

  @Patch('password')
  @UseGuards(LocalGuard)
  @UserDocs.updatePassword()
  updatePassword(@GetUser() user: UserDomain, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(user, dto);
  }

  @Patch(['admin/role', 'role'])
  @Role(['Admin'])
  @UseGuards(RoleGuard)
  @UseGuards(LocalGuard)
  @UserDocs.setRole()
  setRole(@GetUser() user: UserDomain, @Body() dto: SetContributerDto) {
    return this.userService.setRole(user, dto);
  }
}
