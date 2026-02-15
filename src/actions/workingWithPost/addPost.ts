import { z } from 'zod';
import { API } from '../../helpers/API';
import type { ApiResponseTest } from '../../interfaces/ApiResponce';

export const addPostSchema = z.object({
  title: z.string()
    .min(1, 'Заголовок обязателен для заполнения')
    .max(200, 'Заголовок не должен превышать 200 символов')
    .trim(),

  information: z.string()
    .min(1, 'Текст поста обязателен для заполнения')
    .max(4000, 'Текст поста не должен превышать 4000 символов')
    .trim(),

  image: z.string()
    .url('Введите корректный URL изображения')
    .max(500, 'Ссылка на изображение не должна превышать 500 символов')
    .optional(),

  // Добавьте поле createdAt
  createdAt: z.string()
    .min(1, 'Дата создания обязательна')
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Дата должна быть в формате DD.MM.YYYY')
});

export type PostForm = z.infer<typeof addPostSchema>;

export default async function addPost(Post: PostForm, jwt: string | null) {
  try {
    const response = await fetch(`${API}/UserPost/addPost`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(Post)
    })
    
    if(response.ok){
      const responseData: ApiResponseTest = await response.json();
      return responseData.message;
    } 
  } catch(error) {
    console.error(error);
  }
}