import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UnauthorizedException } from '@nestjs/common';

export class ftStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super(
			{
				clientID: process.env.FT_CLIENT_ID,
				clientSecret: process.env.FT_CLIENT_SECRET,
				callbackURL: process.env.FT_CALLBACK_URL,
			},
		);
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		callback: (err: any, user: FortyTwoUser | null) => any
	): Promise<any> {
		try {
			const user = {
				username: profile.username,
				email: profile.emails[0].value,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				picture: profile._json.image.link,
				accessToken,
				refreshToken,
			};
			callback(null, user);
		} catch (e) {
			callback(new UnauthorizedException(), null);
		}
	}
}