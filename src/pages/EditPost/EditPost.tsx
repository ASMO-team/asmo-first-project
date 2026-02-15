import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemProvider/ThemProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import editPost from '../../actions/workingWithPost/editPost';
import { addPostSchema, type PostForm } from '../../actions/workingWithPost/addPost';

interface PostData {
    id: number;
    title: string;
    information: string;
    image: string;
    createdAt: string;
}

// Функция для преобразования даты в формат DD.MM.YYYY
const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        // Пробуем разные форматы дат
        let date: Date;
        
        // Если дата уже в формате DD.MM.YYYY, возвращаем как есть
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
            return dateString;
        }
        
        // Если дата в формате ISO (2023-12-31T00:00:00.000Z)
        if (dateString.includes('T')) {
            date = new Date(dateString);
        } 
        // Если дата в формате YYYY-MM-DD
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(dateString);
        }
        // Если дата в другом формате, пробуем распарсить
        else {
            date = new Date(dateString);
        }
        
        // Проверяем валидность даты
        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', dateString);
            return dateString; // возвращаем исходную строку если не удалось распарсить
        }
        
        // Форматируем в DD.MM.YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}.${month}.${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // возвращаем исходную строку в случае ошибки
    }
};

// Функция для валидации даты в реальном времени
const validateDate = (value: string): boolean => {
    return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
};

const EditPost = () => {
    const { isDark } = useTheme();
    const { postId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [post, setPost] = useState<PostData | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch,
        setValue,
     
    } = useForm<PostForm>({
        resolver: zodResolver(addPostSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            information: '',
            image: '',
            createdAt: ''
        }
    });

    // Получаем данные поста из state
    useEffect(() => {
        const postFromState = location.state?.post;
        
        if (postFromState) {
            setPost(postFromState);
            
            // Форматируем дату в DD.MM.YYYY перед установкой в форму
            const formattedDate = formatDateToDDMMYYYY(postFromState.createdAt);
            
            reset({
                title: postFromState.title,
                information: postFromState.information,
                image: postFromState.image,
                createdAt: formattedDate
            });
        }
    }, [location.state, reset]);

    const watchImage = watch('image');
    const watchCreatedAt = watch('createdAt');

    // Валидация даты при изменении
    useEffect(() => {
        if (watchCreatedAt) {
            const isValidDate = validateDate(watchCreatedAt);
            if (!isValidDate && watchCreatedAt.length > 0) {
                setDateError('Дата должна быть в формате DD.MM.YYYY');
            } else {
                setDateError(null);
            }
        } else {
            setDateError(null);
        }
    }, [watchCreatedAt]);

    // Функция для автоматического форматирования даты при вводе
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        
        // Автоматически добавляем точки
        if (value.length > 2 && value.length <= 4) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        } else if (value.length > 4) {
            value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
        }
        
        setValue('createdAt', value, { shouldValidate: true });
    };

    // Простая функция отправки
    const submitEditPost = async (data: PostForm) => {
        // Проверяем валидность даты перед отправкой
        if (!validateDate(data.createdAt)) {
            setDateError('Дата должна быть в формате DD.MM.YYYY');
            return;
        }

        setIsLoading(true);
        setMessage(null);
        setDateError(null);
        
        try {
            const token = localStorage.getItem('token');
            
            // Просто отправляем данные как есть (дата уже в правильном формате)
            const postData = {
                ...data,
                id: Number(postId)
            };
            
            const result = await editPost(postData, token);
            
            if (result) {
                setMessage(result);
                
                if (result.includes('updated')) {
                    setTimeout(() => {
                        navigate(`/post/${postId}`, {
                            state: {
                                post: { ...post, ...data },
                                fromEdit: true
                            }
                        });
                    }, 1500);
                }
            } else {
                setMessage('Не удалось обновить пост');
            }
        } catch (error) {
            console.error('Ошибка при обновлении поста:', error);
            setMessage('Произошла ошибка при обновлении поста');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (location.state?.fromMyPosts) {
            navigate('/myPosts');
        } else {
            navigate(-1);
        }
    };

    // Базовые классы
    const backgroundClasses = cn(
        'min-h-screen transition-colors duration-300',
        {
            'bg-gray-900': isDark,
            'bg-gray-50': !isDark
        }
    );

    const containerClasses = cn(
        'w-full h-full flex items-center justify-center p-6'
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

    const cancelButtonClasses = cn(
        'w-full py-4 rounded-[5px] text-[16.74px] tracking-[1%] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border disabled:opacity-50 disabled:cursor-not-allowed',
        {
            'border-gray-600 text-gray-300 hover:bg-gray-700': isDark,
            'border-[#667A8A] text-[#667A8A] hover:bg-gray-100': !isDark
        }
    );

    const errorTextClasses = cn('text-red-500 text-sm mt-1');

    const previewImageClasses = cn(
        'w-full h-48 rounded-lg object-cover transition-all duration-300',
        {
            'border border-gray-600': isDark,
            'border border-gray-300': !isDark
        }
    );

    if (!post) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center min-h-screen')}>
                <div className="text-center">
                    <div className={cn('text-6xl mb-4', isDark ? 'text-gray-400' : 'text-gray-500')}>📄</div>
                    <h2 className={cn('text-2xl font-semibold mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Пост не найден
                    </h2>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        Не удалось загрузить данные поста для редактирования
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={backgroundClasses}>
            <div className={containerClasses}>
                <form onSubmit={handleSubmit(submitEditPost)} className={formClasses}>
                    <div className="flex flex-col gap-6">
                        <div className="text-center">
                            <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                Редактировать пост
                            </h1>
                            <p className={cn('mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                ID: {postId}
                            </p>
                        </div>

                        {message && (
                            <div className={messageClasses}>
                                {message}
                            </div>
                        )}

                        {/* Превью изображения */}
                        {(watchImage || post.image) && (
                            <div className="flex flex-col gap-2">
                                <label className={labelClasses}>
                                    Предпросмотр изображения
                                </label>
                                <img 
                                    src={watchImage || post.image} 
                                    alt="Preview" 
                                    className={previewImageClasses}
                                />
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
                                rows={8}
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
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className={inputClasses(!!errors.image)}
                                {...register('image')}
                            />
                            {errors.image && (
                                <p className={errorTextClasses}>{errors.image.message}</p>
                            )}
                        </div>

                        {/* Дата создания */}
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>
                                Дата создания
                            </label>
                            <input 
                                type="text"
                                placeholder="DD.MM.YYYY"
                                className={inputClasses(!!errors.createdAt || !!dateError)}
                                {...register('createdAt')}
                                onChange={handleDateChange}
                                maxLength={10}
                            />
                            {(errors.createdAt || dateError) && (
                                <p className={errorTextClasses}>
                                    {errors.createdAt?.message || dateError}
                                </p>
                            )}
                            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                Формат: ДД.ММ.ГГГГ (например: 31.12.2023)
                            </p>
                        </div>

                        {/* Кнопки действий */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className={cancelButtonClasses}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || !isDirty || isLoading || !!dateError}
                                className={buttonClasses}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={cn(
                                            'animate-spin rounded-full h-5 w-5 border-b-2',
                                            isDark ? 'border-white' : 'border-white'
                                        )}></div>
                                        Сохранение...
                                    </div>
                                ) : (
                                    'Сохранить изменения'
                                )}
                            </button>
                        </div>

                        {/* Информация о посте */}
                        <div className={cn('mt-4 pt-4 border-t', isDark ? 'border-gray-700' : 'border-gray-200')}>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className={cn('text-center p-3 rounded-lg', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Создан</p>
                                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{formatDateToDDMMYYYY(post.createdAt)}</p>
                                </div>
                                <div className={cn('text-center p-3 rounded-lg', isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>ID поста</p>
                                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{postId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;