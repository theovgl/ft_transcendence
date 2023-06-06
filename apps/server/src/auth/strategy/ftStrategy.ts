import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

export class ftStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super(
            {
                clientID: process.env.FT_CLIENT_ID,
                clientSecret: process.env.FT_CLIENT_SECRET,
                callbackURL: process.env.FT_CALLBACK_URL,
                scope: 'public',
            },
            );}
    async validate(accessToken: string, refreshToken: string, profile: any, callback: any) {
        const user = {
            accessToken,
            refreshToken,
            profile,
        };
        callback(null, user);
        console.log(user);
    }
    }