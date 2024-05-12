import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { GoogleOAuth } from 'src/common/guards/googleOauth';
import { UpdateUserDto, UserDTO } from './dto/user.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { rolesList } from 'src/common/utils/roles';
import { AuthService } from './auth.service';
import { AtGuard } from 'src/common/guards/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuth)
  handleGoogleAuth() {}

  @Public()
  @Get('callback')
  @UseGuards(GoogleOAuth)
  handleGoogleCallback(@Req() req: Request) {
    const payload = req.user;
    return this.authService.google(payload);
  }

  @Public()
  @Post('signin')
  signin(@Body(ValidationPipe) userDto: UserDTO) {
    return this.authService.signIn(userDto);
  }

  @Public()
  @Post('signup')
  signup(@Body() userDto: UserDTO) {
    return this.authService.signUp(userDto);
  }

  @Post('logout')
  logout(@Req() req: Request): Promise<any> {
    const { userId } = req.user;
    return this.authService.logOut(userId);
  }

  
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@Req() req: Request): Promise<any> {
    const { userId, refreshToken } = req.user;
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Roles(rolesList.Admin) // only admin can able access this endpoint;
  @Get('userList')
  getAllUser(){
    return this.authService.allUsersList();
  }
}
