import z from "zod";
import { API } from "../../helpers/API";

export const validationProfileDate = z.object({
  userName: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не может превышать 50 символов'),
  email: z.string()
    .min(1, 'Пожалуйста, введите ваш email')
    .email('Неверный формат email'),
  avatar: z.string()
    .max(200, 'изображение не может превышать 200 символов')
    .optional()
    .or(z.literal('')) // разрешаем пустую строку
})

export type EditedProfileData = z.infer<typeof validationProfileDate>;
export type FormToEditProfileDateState = { message?: string; }

export default async function editProfileDate(formData: EditedProfileData, jwt:string | null) {
  const validatedData = validationProfileDate.safeParse(formData);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Пожалуйста, исправьте ошибки в форме"
    };
  }
  
  try {
    const response = await fetch(`${API}/UserDate/modifyProfile`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(validatedData.data)
    });

    const responseData: {message:string} = await response.json();
    return responseData;
  } catch (error) {
    return { message: error };
  }
}