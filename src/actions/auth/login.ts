import { API } from "../../helpers/API";
import { type ApiResponse } from "../../interfaces/ApiResponce";
import { type LoginForm } from "../../interfaces/LoginForm";
type FormState = {
    errors?: {
        mail?:string,
        password?:string
    };
    message?:string | null,
    success?:boolean;
    user?: {
        token: string;
        name: string;
 
        mail:string
    };
}

export default async function loginUser(formData:LoginForm):Promise<FormState> {
    try {
        const response = await fetch(`${API}/UserRegistration/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(formData)
        })
        if(response.ok){
            const responseData:ApiResponse = await response.json();
            return {
                success: true,
                message: "Регистрация прошла успешно!",
                user: {
                    token: responseData.token,
                    name: responseData.name,
           
                    mail: responseData.mail
                }
            }
        }

        const contentType = response.headers.get('Content-type');
        let errorData;
        if(contentType?.includes('application/json')){
            errorData = await response.json();
        }else{
            errorData = await response.text();
        }

        if(response.status === 400 || response.status === 409){
            if(typeof errorData === 'string'){
                return {message: errorData};
            }else if(typeof errorData === 'object'){
                const errors: Record<string, string[]> = {};
                let globalMessage = '';
                 

                for(const key in errorData){
                    if(Array.isArray(errorData[key])){
                        const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);

                        if(key === ''){
                            globalMessage = errorData[key].join(' ');
                        }else{
                            errors[camelCaseKey] = errorData[key];
                        }
                    }
                }
                return {
                    errors: Object.keys(errors).length > 0 ? errors : undefined,
                    message: globalMessage || "Пожалуйста, исправьте ошибки",
                };
            }
        return {
            message: typeof errorData === 'string' 
                ? errorData 
                : `Ошибка сервера: ${response.status} ${response.statusText}`
        };
        }

        return {
            message: typeof errorData === 'string' 
                ? errorData 
                : `Ошибка сервера: ${response.status} ${response.statusText}`
         };
    }catch (error) {
    console.error('Ошибка регистрации:', error);
    return { 
      message: "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже." 
    };
  }
}