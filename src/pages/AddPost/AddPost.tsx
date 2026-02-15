import { useTheme } from "../../components/ThemProvider/ThemProvider";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPostSchema, type PostForm } from "../../actions/workingWithPost/addPost";  
import addPost from "../../actions/workingWithPost/addPost";
import { useState } from 'react';
import cn from 'classnames';

const AddPost = () => {
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        setValue
    } = useForm<PostForm>({
        resolver: zodResolver(addPostSchema),
        mode: 'onChange',
        defaultValues: {
            createdAt: new Date().toLocaleDateString('ru-RU')  
        }
    });

    const onSubmit = async (data: PostForm) => {
        setIsLoading(true);
        setMessage(null);
        
        try {
            const token = localStorage.getItem('token');
            const result = await addPost(data, token);
            
            if (result) {
                setMessage(result);
                reset();  
                
                setTimeout(() => {
                    setValue('createdAt', new Date().toLocaleDateString('ru-RU'));
                }, 0);
            }
        } catch (error) {
            console.error('Ошибка при добавлении поста:', error);
            setMessage('Произошла ошибка при публикации поста');
        } finally {
            setIsLoading(false);
        }
    };

    // Базовые классы
    const containerClasses = cn(
        'w-full h-full flex items-center justify-center p-6',
        { 'dark': isDark }
    );

    const formClasses = cn(
        'max-w-2xl w-full rounded-2xl shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] p-6 transition-colors duration-300',
        {
            'bg-gray-800': isDark,
            'bg-white': !isDark
        }
    );

    const messageClasses = cn(
        'p-3 rounded-md text-center',
        {
            'bg-green-100 text-green-800': message?.includes('успешно'),
            'bg-red-100 text-red-800': message && !message.includes('успешно')
        }
    );

    const labelClasses = cn(
        'text-[16.74px] tracking-[1%] font-medium',
        {
            'text-gray-300': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const inputClasses = (hasError: boolean) => cn(
        'w-full p-4 border rounded-[5px] focus:outline-none focus:ring-2 transition-all duration-300',
        {
            'border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-gray-400': isDark,
            'border-[#E9F5FE] bg-white text-[#5D7285] placeholder-[#5D7285] focus:ring-[#667A8A]': !isDark,
            'border-red-500': hasError
        }
    );

    const textareaClasses = (hasError: boolean) => cn(
        'w-full p-4 border rounded-[5px] focus:outline-none focus:ring-2 resize-none transition-all duration-300',
        {
            'border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-gray-400': isDark,
            'border-[#E9F5FE] bg-white text-[#5D7285] placeholder-[#5D7285] focus:ring-[#667A8A]': !isDark,
            'border-red-500': hasError
        }
    );

    const buttonClasses = cn(
        'w-full text-white py-4 rounded-[5px] text-[16.74px] tracking-[1%] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        {
            'bg-gray-600 hover:bg-gray-500': isDark,
            'bg-[#667A8A] hover:bg-[#5D7285]': !isDark
        }
    );

    const errorTextClasses = cn('text-red-500 text-sm mt-1');

    return (
        <div className={containerClasses}>
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className={formClasses}
            >
                <div className="flex flex-col gap-6">
                    {/* Сообщение об успехе/ошибке */}
                    {message && (
                        <div className={messageClasses}>
                            {message}
                        </div>
                    )}

                    {/* Заголовок */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Заголовок
                        </label>
                        <input 
                            type="text"
                            placeholder="Введите заголовок..."
                            className={inputClasses(!!errors.title)}
                            {...register('title')}
                        />
                        {errors.title && (
                            <p className={errorTextClasses}>{errors.title.message}</p>
                        )}
                    </div>

                    {/* Текст поста */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Текст поста
                        </label>
                        <textarea 
                            placeholder="Напишите ваш пост..."
                            rows={6}
                            className={textareaClasses(!!errors.information)}
                            {...register('information')}
                        />
                        {errors.information && (
                            <p className={errorTextClasses}>{errors.information.message}</p>
                        )}
                    </div>

                    {/* Ссылка на изображение */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Ссылка на изображение
                        </label>
                        <input 
                            type="text"
                            placeholder="Введите URL изображения..."
                            className={inputClasses(!!errors.image)}
                            {...register('image')}
                        />
                        {errors.image && (
                            <p className={errorTextClasses}>{errors.image.message}</p>
                        )}
                    </div>

                    {/* Поле для даты создания */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Дата создания
                        </label>
                        <input 
                            type="text"
                            placeholder="DD.MM.YYYY"
                            className={inputClasses(!!errors.createdAt)}
                            {...register('createdAt')}
                        />
                        {errors.createdAt && (
                            <p className={errorTextClasses}>{errors.createdAt.message}</p>
                        )}
                    </div>

                    {/* Кнопка отправки */}
                    <button 
                        type="submit"
                        disabled={!isValid || !isDirty || isLoading}
                        className={buttonClasses}
                    >
                        {isLoading ? 'Публикация...' : 'Опубликовать пост'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPost;