import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  saltRounds = 10;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(username: string, password: string) {
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser)
      throw new BadRequestException('이미 존재하는 사용자이름입니다.');

    const hashedPassword = await hash(password, this.saltRounds);
    const newUser = new this.userModel({ username, hashedPassword });
    return await newUser.save();
  }

  async signIn(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    if (!(await compare(password, user.hashedPassword)))
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = { sub: user.id, username: user.username, role: user.role };
    const expiresIn = this.configService.get<string>('auth.expiresIn');
    const accessToken = this.jwtService.sign(payload, {
      expiresIn,
    });
    return accessToken;
  }

  async setRole(username: string, newRole: Role) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if (user.role === newRole)
      throw new UnauthorizedException('이미 해당 역할을 가지고 있습니다.');

    user.role = newRole;
    await user.save();
  }
}
