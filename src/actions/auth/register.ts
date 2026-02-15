import z from 'zod';
import { API } from '../../helpers/API';
import type { ApiResponse } from '../../interfaces/ApiResponce';
export const validationSchema = z.object({
  userName: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не может превышать 50 символов'),
     

  email: z.string()
    .min(1, 'Пожалуйста, введите ваш email')
    .email('Неверный формат email'),

  password: z.string()
    .min(8, 'Минимум 8 символов'), 

  confirmPassword: z.string()
    .min(1, 'Пожалуйста, подтвердите пароль'),

})
.refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type RegisterForm = z.infer<typeof validationSchema>;

export type FormState = {
  errors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
  user?: {
    token: string;
    name: string;
  
    mail:string
  };
};


export default async function registerUser(
  formData: RegisterForm
): Promise<FormState>{
  const validatedData = validationSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Пожалуйста, исправьте ошибки в форме"
    };
  }
    try {
    const response = await fetch(`${API}/UserRegistration/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData.data)
    });
    
    if (response.ok) {
      const responseData: ApiResponse = await response.json();    
      return {
        success: true,
        message: "Регистрация прошла успешно!",
        user: {
          token: responseData.token,
          name: responseData.name,
         
          mail: responseData.mail
        }
      };
    }

    const contentType = response.headers.get('Content-type');
    let errorData;
    
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }

 
    if (response.status === 400 || response.status === 409) {
      if (typeof errorData === 'string') {
        return { message: errorData };
      } else if (typeof errorData === 'object') {
        const errors: Record<string, string[]> = {};
        let globalMessage = '';
        
        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
 
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            
            if (key === '') {
              globalMessage = errorData[key].join(' ');
            } else {
              errors[camelCaseKey] = errorData[key];
            }
          }
        }
        
        return {
          errors: Object.keys(errors).length > 0 ? errors : undefined,
          message: globalMessage || "Пожалуйста, исправьте ошибки",
        };
      }
    }
 
    return {
      message: typeof errorData === 'string' 
        ? errorData 
        : `Ошибка сервера: ${response.status} ${response.statusText}`
    };
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return { 
      message: "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже." 
    };
  }  
}