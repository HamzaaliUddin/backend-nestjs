import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { UserIdDto, UserResponseDto } from './dto/user-response.dto';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await hash(dto.password);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
      },
      select: USER_SELECT,
    });
  }

  findById(id: UserIdDto): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      select: USER_SELECT,
    });
  }

  update(id: UserIdDto, dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: USER_SELECT,
    });
  }

  delete(id: UserIdDto): Promise<UserResponseDto> {
    return this.prisma.user.delete({
      where: { id },
      select: USER_SELECT,
    });
  }
  findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });
  }
}
