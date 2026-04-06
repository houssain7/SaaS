import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY',
    }),
  ],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService], // Exporter pour utilisation dans d'autres modules
})
export class UsersModule { }