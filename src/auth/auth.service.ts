import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserDTO } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async google(user: any): Promise<any> {
    const newUser = await this.userModel.findOneAndUpdate(
      {
        email: user.email,
      },
      user,
      {
        upsert: true,
        new: true,
      },
    );
    // console.log({ newUser });
    return newUser;
  }

  async signUp(payload: UserDTO): Promise<any> {
    const newUser = await this.userModel.create({
      email: payload.email,
      password: this.hashPassword(payload.password),
    });
    const tokens = this.getToken(newUser);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(payload: UserDTO) {
    const checkUser = await this.userModel.findOne({
      email: payload.email,
    });

    if (!checkUser) throw new ForbiddenException('Access Denied');

    const checkPswd = await bcrypt.compare(
      payload.password,
      checkUser.password,
    );

    if (!checkPswd) throw new ForbiddenException('Access Denied');

    const tokens = this.getToken(checkUser);
    await this.updateRefreshToken(checkUser._id, tokens.refreshToken);
    return tokens;
  }

  async logOut(userId: string) {
    // console.log({ userId });
    await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        hashedRt: {
          $ne: null,
        },
      },
      {
        hashedRt: null,
      },
    );
  }

  async refreshToken(userId: string, refreshToken: string) {
    const checkUser = await this.userModel.findOne({
      _id: userId,
      hashedRt: {
        $ne: null,
      },
    });

    if (!checkUser) throw new ForbiddenException('Access Denied');

    const checkRefreshToken = await bcrypt.compare(
      refreshToken,
      checkUser.hashedRt,
    );

    if (!checkRefreshToken) throw new ForbiddenException('Access Denied');

    const tokens = this.getToken(checkUser);
    await this.updateRefreshToken(checkUser._id, tokens.refreshToken);
    return tokens;
  }

  hashPassword(pswd: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pswd, salt);
    return hash;
  }

  getToken(payload: UserDocument) {
    const accessToken = this.jwtService.sign(
      {
        userId: payload._id,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: this.configService.get<string>('JWT_AT_SECRET_KEY'),
        expiresIn: 60 * 15, // 15minutes
      },
    );


    console.log({tokenAt: this.configService.get<string>('JWT_AT_SECRET_KEY')})
    const refreshToken = this.jwtService.sign(
      {
        userId: payload._id,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: this.configService.get<string>('JWT_RT_SECRET_KEY'),
        expiresIn: 60 * 60 * 24 * 7, // 7days
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = this.hashPassword(refreshToken);
    await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        hashedRt: hashedRefreshToken,
      },
    );
  }

  async allUsersList(){
    const users = await this.userModel.find().sort({createdAt: -1});
    return users;
  }
}
