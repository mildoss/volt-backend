import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {JwtService} from "@nestjs/jwt";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import {User} from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const token = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      token
    }
  };

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {email: dto.email}
    });

    if (oldUser) throw new BadRequestException('User already exists');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: password,
        fullName: dto.fullName,
        phone: '',
        avatarUrl: ''
      },
    });

    const token = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      token
    };
  };

  private async issueTokens(userId: number) {
    const data = {id: userId};

    const token = this.jwt.sign(data, {
      expiresIn: '30d'
    });

    return token;
  };

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {email: dto.email}
    })

    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  };

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  };
}
