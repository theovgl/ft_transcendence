import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly authService: AuthService) {
		super();
	}

	serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
		done(null, user);
	}

	async deserializeUser(payload: any, done: (err: Error | null, payload?: any) => void): Promise<void> {
		const user = await this.authService.findUser(payload.id);
		done(null, user || null);
	}
}
