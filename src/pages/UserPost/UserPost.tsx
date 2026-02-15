import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemProvider/ThemProvider';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import pickPost from '../../actions/workingWithPost/navigateToPost';

interface PostData {
    id: number;
    title: string;
    information: string;
    image: string;
    createdAt: string;
    user: null;
}

const UserPost = () => {
    const { isDark } = useTheme();
    const { postId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        const postFromState = location.state?.post;
        
        if (postFromState) {
            setPost(postFromState);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [location.state]);

    const handleGoBack = () => {
        if (location.state?.fromMyPosts) {
            navigate('/myPosts');
        } else if (location.state?.fromOtherUsersPosts) {
            navigate('/posts');
        } else {
            navigate(-1);
        }
    };

    const handleEditPost = async () => {
        try {
            setEditLoading(true);
            const token = localStorage.getItem('token');
            const postData = await pickPost(Number(postId), token);
            
            if (postData) {
                navigate(`/edit-post/${postId}`, { 
                    state: { 
                        post: postData,
                        fromMyPosts: true 
                    } 
                });
            } else {
                console.error('Не удалось загрузить данные поста для редактирования');
            }
        } catch (error) {
            console.error('Ошибка при загрузке поста для редактирования:', error);
        } finally {
            setEditLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const backgroundClasses = cn(
        'min-h-screen transition-colors duration-300',
        {
            'bg-gray-900': isDark,
            'bg-gray-50': !isDark
        }
    );

    const containerClasses = cn(
        'max-w-4xl mx-auto rounded-2xl shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] transition-colors duration-300',
        {
            'bg-gray-800': isDark,
            'bg-white': !isDark
        }
    );

    const textClasses = cn({
        'text-white': isDark,
        'text-gray-900': !isDark
    });

    const mutedTextClasses = cn({
        'text-gray-400': isDark,
        'text-gray-500': !isDark
    });

    const buttonClasses = cn(
        'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
        {
            'bg-blue-500 hover:bg-blue-600 text-white': isDark,
            'bg-blue-600 hover:bg-blue-700 text-white': !isDark
        }
    );

    const backButtonClasses = cn(
        'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border',
        {
            'border-gray-600 text-gray-300 hover:bg-gray-700': isDark,
            'border-gray-300 text-gray-600 hover:bg-gray-100': !isDark
        }
    );

    const editButtonClasses = (isLoading: boolean) => cn(
        'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2',
        {
            'bg-green-500 hover:bg-green-600 text-white': isDark && !isLoading,
            'bg-green-600 hover:bg-green-700 text-white': !isDark && !isLoading,
            'bg-gray-400 cursor-not-allowed': isLoading
        }
    );

    const dividerClasses = cn('border-t', {
        'border-gray-700': isDark,
        'border-gray-200': !isDark
    });

    const spinnerClasses = cn(
        'animate-spin rounded-full h-12 w-12 border-b-2 mx-auto',
        {
            'border-blue-400': isDark,
            'border-blue-600': !isDark
        }
    );

    const smallSpinnerClasses = cn(
        'animate-spin rounded-full h-4 w-4 border-b-2',
        {
            'border-white': true
        }
    );

    if (isLoading) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center min-h-screen')}>
                <div className="text-center">
                    <div className={spinnerClasses}></div>
                    <p className={cn('mt-4 text-lg', mutedTextClasses)}>
                        Загрузка поста...
                    </p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center min-h-screen')}>
                <div className="text-center">
                    <div className={cn('text-6xl mb-4', mutedTextClasses)}>📄</div>
                    <h2 className={cn('text-2xl font-semibold mb-2', textClasses)}>
                        Пост не найден
                    </h2>
                    <p className={cn('mb-6', mutedTextClasses)}>
                        Не удалось загрузить данные поста
                    </p>
                    <button 
                        onClick={handleGoBack}
                        className={buttonClasses}
                    >
                        Вернуться назад
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(backgroundClasses, 'py-8')}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button 
                        onClick={handleGoBack}
                        className={backButtonClasses}
                    >
                        ← Назад
                    </button>
                </div>

                <div className={containerClasses}>
                    {post.image && (
                        <div className="w-full h-80 overflow-hidden rounded-t-2xl">
                            <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <header className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn(
                                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                                    {
                                        'bg-blue-900 text-blue-200': isDark,
                                        'bg-blue-100 text-blue-800': !isDark
                                    }
                                )}>
                                    ID: {post.id}
                                </span>
                                {location.state?.fromMyPosts && (
                                    <span className={cn(
                                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                                        {
                                            'bg-green-900 text-green-200': isDark,
                                            'bg-green-100 text-green-800': !isDark
                                        }
                                    )}>
                                        Мой пост
                                    </span>
                                )}
                            </div>
                            
                            <h1 className={cn('text-3xl font-bold mb-4 leading-tight', textClasses)}>
                                {post.title}
                            </h1>
                            
                            <div className={cn('flex items-center gap-2 text-sm', mutedTextClasses)}>
                                <span>📅</span>
                                <time>{formatDate(post.createdAt)}</time>
                            </div>
                        </header>

                        <div className={dividerClasses}></div>

                        <article className="mt-8">
                            <div className={cn('prose max-w-none', {
                                'prose-invert': isDark,
                                'prose-gray': !isDark
                            })}>
                                <p className={cn('text-lg leading-relaxed whitespace-pre-line', textClasses)}>
                                    {post.information}
                                </p>
                            </div>
                        </article>

                        <footer className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className={cn('flex items-center gap-2', mutedTextClasses)}>
                                    <span>🆔</span>
                                    <span>ID поста: {post.id}</span>
                                </div>
                                <div className={cn('flex items-center gap-2', mutedTextClasses)}>
                                    <span>📊</span>
                                    <span>Символов: {post.information.length}</span>
                                </div>
                                {post.image && (
                                    <div className={cn('flex items-center gap-2', mutedTextClasses)}>
                                        <span>🖼️</span>
                                        <span>Есть изображение</span>
                                    </div>
                                )}
                            </div>
                        </footer>
                    </div>
                </div>

                <div className="mt-6 flex gap-4 justify-center">
                    <button 
                        onClick={handleGoBack}
                        className={backButtonClasses}
                    >
                        ← Вернуться к списку
                    </button>
                    
                    {location.state?.fromMyPosts && (
                        <button 
                            onClick={handleEditPost}
                            disabled={editLoading}
                            className={editButtonClasses(editLoading)}
                        >
                            {editLoading ? (
                                <>
                                    <div className={smallSpinnerClasses}></div>
                                    Загрузка...
                                </>
                            ) : (
                                <>✏️ Редактировать пост</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPost;