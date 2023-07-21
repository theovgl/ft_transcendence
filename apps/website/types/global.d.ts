type UserInfos = {
	id: number;
	email: string;
	name: string;
	displayName: string;

	profilePicPath: string;

	firstName: string;
	lastName: string;

	score: number;
	level: number;
	wins: number;
	losses: number;
}

type MatchInfos = {
	userIdLeft: string
	scorePlayerOne: number
	userIdRight: string
	scorePlayerTwo: number
	createdAt: string
	updatedAt: string
}

export { UserInfos, MatchInfos};