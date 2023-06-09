export {};

declare global {
	interface IUserInfos {
		id: number;
		email: string;
		name: string;

		profilePicPath: string;

		firstName: string;
		lastName: string;

		score: number;
		level: number;
		wins: number;
		looses: number;
	}
}
