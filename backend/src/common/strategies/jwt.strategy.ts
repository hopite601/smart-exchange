import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.access_token,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.JWT_SECRET || "default",
        });
    }

    async validate(payload: any) {
        return { userId: payload.user_id, email: payload.email };
    }
}
