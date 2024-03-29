type FortyTwoUser = {
	userId: number;
	username: string;
	displayname: string;
	firstName: string;
	lastName: string;
	email: string;
	accessToken?: string | undefined;
	refreshToken?: string | undefined;
	picture: string;
	twoFAEnabled: boolean;
}