import { useTheme } from "../ThemProvider/ThemProvider";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { validationProfileDate, type EditedProfileData } from "../../actions/workingWithUserDate/editProfile";
import cn from 'classnames';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  bio?: string;
  onSave?: (userData: { name: string; email: string; avatar?: string }) => void;
}

const ProfileComponent = ({ user, bio, onSave }: ProfileProps) => {
    const { isDark } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        watch,
        reset
    } = useForm<EditedProfileData>({
        resolver: zodResolver(validationProfileDate),
        mode: 'onChange',
        defaultValues: {
            userName: user.name,
            email: user.email,
            avatar: user.avatar || ''
        }
    });

    // Следим за изменением аватарки для превью
    const watchAvatar = watch('avatar');
    const watchUserName = watch('userName');

    const onSubmit = async (data: EditedProfileData) => {
        setIsLoading(true);
        setMessage(null);
        
        try {
            // Если avatar пустой, используем старый avatar
            const saveData = {
                name: data.userName,
                email: data.email,
                avatar: data.avatar || user.avatar
            };

            if (onSave) {
                await onSave(saveData);
            }
            
            setMessage('Профиль успешно обновлен');
            setIsEditing(false);
            
            // Сброс формы с новыми значениями
            reset({
                userName: data.userName,
                email: data.email,
                avatar: data.avatar || ''
            });
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            setMessage('Произошла ошибка при обновлении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage(null);
    };

    const handleCancel = () => {
        reset({
            userName: user.name,
            email: user.email,
            avatar: user.avatar || ''
        });
        setIsEditing(false);
        setMessage(null);
    };

    // Базовые классы
    const containerClasses = cn(
        'max-w-md mx-auto rounded-2xl shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] p-8',
        {
            'bg-gray-800': isDark,
            'bg-white': !isDark
        }
    );

    const avatarContainerClasses = cn(
        'w-32 h-32 rounded-full flex items-center justify-center mb-4 relative',
        {
            'bg-gray-600': isDark,
            'bg-[#E9F5FE]': !isDark
        }
    );

    const avatarTextClasses = cn(
        'text-4xl font-semibold',
        {
            'text-gray-300': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const statusIndicatorClasses = cn(
        'absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2',
        {
            'border-gray-800': isDark,
            'border-white': !isDark
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
        'text-sm font-medium',
        {
            'text-gray-300': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const inputClasses = (hasError: boolean) => cn(
        'w-full p-3 border rounded-[5px] focus:outline-none focus:ring-2 transition-all duration-300',
        {
            'border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-gray-400': isDark,
            'border-[#E9F5FE] bg-white text-[#5D7285] placeholder-[#5D7285] focus:ring-[#667A8A]': !isDark,
            'border-red-500': hasError
        }
    );

    const hintTextClasses = cn(
        'text-xs',
        {
            'text-gray-400': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const errorTextClasses = cn('text-red-500 text-sm mt-1');

    const cancelButtonClasses = cn(
        'flex-1 py-3 rounded-[5px] text-[16.74px] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border disabled:opacity-50 disabled:cursor-not-allowed',
        {
            'border-gray-600 text-gray-300 hover:bg-gray-700': isDark,
            'border-[#667A8A] text-[#667A8A] hover:bg-gray-100': !isDark
        }
    );

    const saveButtonClasses = cn(
        'flex-1 text-white py-3 rounded-[5px] text-[16.74px] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        {
            'bg-gray-600 hover:bg-gray-500': isDark,
            'bg-[#667A8A] hover:bg-[#5D7285]': !isDark
        }
    );

    const editButtonClasses = cn(
        'w-full text-white py-3 rounded-[5px] text-[16.74px] tracking-[1%] font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
        {
            'bg-gray-600 hover:bg-gray-500': isDark,
            'bg-[#667A8A] hover:bg-[#5D7285]': !isDark
        }
    );

    const nameTextClasses = cn(
        'text-2xl font-semibold text-center mb-2',
        {
            'text-gray-300': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const emailTextClasses = cn(
        'text-[16.74px] text-center mb-4',
        {
            'text-gray-400': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const bioContainerClasses = cn(
        'mt-6 pt-6 border-t',
        {
            'border-gray-700': isDark,
            'border-[#E9F5FE]': !isDark
        }
    );

    const bioTitleClasses = cn(
        'text-[16.74px] font-medium mb-3',
        {
            'text-gray-300': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    const bioTextClasses = cn(
        'text-[14px] leading-relaxed',
        {
            'text-gray-400': isDark,
            'text-[#5D7285]': !isDark
        }
    );

    return (
        <div className={containerClasses}>
            {/* Аватар */}
            <div className="flex flex-col items-center mb-6">
                <div className={avatarContainerClasses}>
                    {(watchAvatar || user.avatar) && isEditing ? (
                        <img 
                            src={watchAvatar || user.avatar} 
                            alt="avatar" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : user.avatar && !isEditing ? (
                        <img 
                            src={user.avatar} 
                            alt="avatar" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className={avatarTextClasses}>
                            {isEditing 
                                ? (watchUserName || user.name).split(' ').map(n => n[0]).join('')
                                : user.name.split(' ').map(n => n[0]).join('')
                            }
                        </div>
                    )}
                    {/* Индикатор онлайн статуса */}
                    <div className={statusIndicatorClasses}></div>
                </div>

                {/* Режим редактирования */}
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        {/* Сообщение об успехе/ошибке */}
                        {message && (
                            <div className={messageClasses}>
                                {message}
                            </div>
                        )}

                        {/* Поле имени */}
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>
                                Имя
                            </label>
                            <input 
                                type="text"
                                placeholder="Введите ваше имя"
                                className={inputClasses(!!errors.userName)}
                                {...register('userName')}
                            />
                            {errors.userName && (
                                <p className={errorTextClasses}>{errors.userName.message}</p>
                            )}
                        </div>

                        {/* Поле email */}
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>
                                Email
                            </label>
                            <input 
                                type="email"
                                placeholder="Введите ваш email"
                                className={inputClasses(!!errors.email)}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className={errorTextClasses}>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Поле аватарки */}
                        <div className="flex flex-col gap-2">
                            <label className={labelClasses}>
                                Ссылка на аватарку
                            </label>
                            <input 
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                className={inputClasses(!!errors.avatar)}
                                {...register('avatar')}
                            />
                            {errors.avatar && (
                                <p className={errorTextClasses}>{errors.avatar.message}</p>
                            )}
                            <p className={hintTextClasses}>
                                Оставьте пустым, чтобы использовать текущее изображение
                            </p>
                        </div>

                        {/* Кнопки в режиме редактирования */}
                        <div className="flex gap-3 pt-2">
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
                                disabled={!isValid || !isDirty || isLoading}
                                className={saveButtonClasses}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Режим просмотра */
                    <>
                        {/* Имя и email */}
                        <h2 className={nameTextClasses}>
                            {user.name}
                        </h2>
                        <p className={emailTextClasses}>
                            {user.email}
                        </p>

                        {/* Кнопка редактирования */}
                        <button 
                            onClick={handleEdit}
                            className={editButtonClasses}
                        >
                            Редактировать профиль
                        </button>
                    </>
                )}
            </div>

            {/* Дополнительная информация (только в режиме просмотра) */}
            {bio && !isEditing && (
                <div className={bioContainerClasses}>
                    <h3 className={bioTitleClasses}>
                        О себе
                    </h3>
                    <p className={bioTextClasses}>
                        {bio}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ProfileComponent;