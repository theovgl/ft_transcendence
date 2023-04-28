import Field from '../components/Field.tsx'
import Button from '../components/Button.tsx'
import formStyle from "@/styles/form.module.css"

export interface IForm
{
	action?: string
	method?: "post" | "get";
}

export default function LoginForm(option: IForm)
{
	return (
			<div>
				<form className={formStyle.form}action ={option.action ? option.action : "/api/cool"} method={option.method ? option.method : "post"}>
					<Field id="login" name="login" placeholder="Enter login" size={16}/>
					<Field id="password" name="password" placeholder="Password" size={16}/>
					<Button type="submit" label="Log in"/>
				</form>
			</div>
	);
}
