import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const hashed = await bcrypt.hash(password, 10)

        const user = await this.prisma.user.create({
            data: { email, password: hashed },
        })

        return this.generateTokens(user.id, user.email)
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (!user) throw new UnauthorizedException()

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new UnauthorizedException()

        return this.generateTokens(user.id, user.email)
    }

    generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email }

        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        }
    }
}