import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsString()
	login: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	// @IsNotEmpty()
	@IsString()
	password: string;

	@IsString()
	id: number;

	@IsString()
	first_name: string;		
	last_name: string;		
	usual_full_name: string;	
	usual_first_name: string;
	// url: string;			
	phone: string;		
	displayname: string;	
	kind: string;		
	image: string;		
	// 'staff?': string;				
	correction_point: string;		
	pool_month: string;				
	pool_year: string;				
	location: string;				
	wallet: string;				
	anonymize_date: string;		
	data_erasure_date: string;	
	created_at: string;			
	updated_at: string;			
	alumnized_at: string;		
	// 'alumni?': string;			
	// 'active?': string;			
	groups: string;				
	cursus_users: string;		
	projects_users: string;		
	languages_users: string;		
	achievements: string;		
	titles: string;				
	titles_users: string;				
	partnerships: string;				
	patroned: string;				
	patroning: string;				
	expertises_users: string;				
	roles: string;				
	campus: string;				
	campus_users: string;		
}
