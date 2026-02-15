import { useEffect, useState } from 'react';
import { type PostFormWithId } from '../../interfaces/PostFormWithId';
import getUserTests from '../../actions/workingWithPost/getUserTests';
import { useTheme } from '../../components/ThemProvider/ThemProvider';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import pickPost from '../../actions/workingWithPost/navigateToPost';

const MyPosts = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostFormWithId[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingPostid, setLoadingPostid] = useState<number | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const userPosts = await getUserTests(token);
                setPosts(userPosts);
                console.log(userPosts);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePostClick = async (postid: number) => {
        try {
            setLoadingPostid(postid);
            const token = localStorage.getItem('token');
            const postData = await pickPost(postid, token);
            console.log(postid);
            if (postData) {
                navigate(`/post/${postid}`, { 
                    state: { 
                        post: postData,
                        fromMyPosts: true 
                    } 
                });
            } else {
                navigate(`/post/${postid}`);
            }
        } catch (error) {
            console.error('Ошибка при загрузке поста:', error);
            navigate(`/post/${postid}`);
        } finally {
            setLoadingPostid(null);
        }
    };

    const handleEditPost = async (postid: number) => {
        try {
            setLoadingPostid(postid);
            const token = localStorage.getItem('token');
            const postData = await pickPost(postid, token);
            console.log(postData);
            if (postData) {
                navigate(`/edit-post/${postid}`, { 
                    state: { 
                        post: postData,
                        isEditing: true 
                    } 
                });
            } else {
                navigate(`/edit-post/${postid}`);
            }
        } catch (error) {
            console.error('Ошибка при загрузке поста для редактирования:', error);
            navigate(`/edit-post/${postid}`);
        } finally {
            setLoadingPostid(null);
        }
    };

    const backgroundClasses = cn(
        'min-h-screen transition-colors duration-300',
        {
            'bg-gray-900': isDark,
            'bg-gray-50': !isDark
        }
    );

    const textClasses = cn({
        'text-white': isDark,
        'text-gray-900': !isDark
    });

    const secondaryTextClasses = cn({
        'text-gray-300': isDark,
        'text-gray-600': !isDark
    });

    const mutedTextClasses = cn({
        'text-gray-400': isDark,
        'text-gray-500': !isDark
    });

    const cardClasses = cn(
        'rounded-xl shadow-sm border transition-shadow duration-300 hover:shadow-md',
        {
            'bg-gray-800 border-gray-700 hover:shadow-gray-900': isDark,
            'bg-white border-gray-200': !isDark
        }
    );

    const statsCardClasses = cn(
        'rounded-lg p-6 shadow-sm border transition-colors duration-300',
        {
            'bg-gray-800 border-gray-700': isDark,
            'bg-white border-gray-200': !isDark
        }
    );

    const tagClasses = cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        {
            'bg-blue-900 text-blue-200': isDark,
            'bg-blue-100 text-blue-800': !isDark
        }
    );

    const buttonClasses = (isLoading: boolean) => cn(
        'font-medium text-sm transition-colors hover:underline flex items-center gap-2',
        {
            'text-blue-400 hover:text-blue-300': isDark && !isLoading,
            'text-blue-600 hover:text-blue-800': !isDark && !isLoading,
            'text-gray-400 cursor-not-allowed': isLoading,
            'opacity-50': isLoading
        }
    );

    const editButtonClasses = (isLoading: boolean) => cn(
        'font-medium text-sm transition-colors hover:underline flex items-center gap-2',
        {
            'text-green-400 hover:text-green-300': isDark && !isLoading,
            'text-green-600 hover:text-green-800': !isDark && !isLoading,
            'text-gray-400 cursor-not-allowed': isLoading,
            'opacity-50': isLoading
        }
    );

    const errorButtonClasses = cn(
        'mt-4 px-6 py-2 rounded-lg transition-colors',
        {
            'bg-blue-500 hover:bg-blue-600 text-white': isDark,
            'bg-blue-600 hover:bg-blue-700 text-white': !isDark
        }
    );

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
            'border-blue-400': isDark,
            'border-blue-600': !isDark
        }
    );

    if (isLoading) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center')}>
                <div className="text-center">
                    <div className={spinnerClasses}></div>
                    <p className={mutedTextClasses}>Загрузка постов...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center')}>
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className={cn('text-lg font-medium', {
                        'text-red-400': isDark,
                        'text-red-600': !isDark
                    })}>
                        {error}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className={errorButtonClasses}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className={cn(backgroundClasses, 'flex items-center justify-center')}>
                <div className="text-center">
                    <div className={cn('text-6xl mb-4', mutedTextClasses)}>📝</div>
                    <h2 className={cn('text-2xl font-semibold mb-2', textClasses)}>
                        У вас пока нет постов
                    </h2>
                    <p className={mutedTextClasses}>
                        Создайте свой первый пост, чтобы он появился здесь
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(backgroundClasses, 'py-8')}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className={cn('text-3xl font-bold', textClasses)}>Мои посты</h1>
                    <p className={cn('mt-2', secondaryTextClasses)}>
                        Всего постов: {posts.length}
                    </p>
                </div>

                <ul className="space-y-6">
                    {posts.map((post) => {
                        const isPostLoading = loadingPostid === post.id;
                        
                        return (
                            <li key={post.id} className={cardClasses}>
                                <article className="p-6">
                                    <header className="mb-4">
                                        <h2 className={cn('text-xl font-semibold line-clamp-2', textClasses)}>
                                            {post.title}
                                        </h2>
                                        <div className={cn('text-sm mt-2', mutedTextClasses)}>
                                            📅 {post.createdAt}
                                        </div>
                                    </header>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className={tagClasses}>id: {post.id}</span>
                                        
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleEditPost(post.id)}
                                                disabled={isPostLoading}
                                                className={editButtonClasses(isPostLoading)}
                                                title="Редактировать пост"
                                            >
                                                {isPostLoading ? (
                                                    <>
                                                        <div className={smallSpinnerClasses}></div>
                                                        Загрузка...
                                                    </>
                                                ) : (
                                                    <>✏️ Редактировать</>
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handlePostClick(post.id)}
                                                disabled={isPostLoading}
                                                className={buttonClasses(isPostLoading)}
                                            >
                                                {isPostLoading ? (
                                                    <>
                                                        <div className={smallSpinnerClasses}></div>
                                                        Загрузка...
                                                    </>
                                                ) : (
                                                    <>Подробнее →</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </li>
                        );
                    })}
                </ul>

                <div className={statsCardClasses}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className={cn('text-2xl font-bold', textClasses)}>{posts.length}</p>
                            <p className={mutedTextClasses}>Всего постов</p>
                        </div>
                        <div>
                            <p className={cn('text-2xl font-bold', textClasses)}>
                                {new Set(posts.map(p => p.createdAt.split('.')[2])).size}
                            </p>
                            <p className={mutedTextClasses}>За все время</p>
                        </div>
                        <div>
                            <p className={cn('text-2xl font-bold', textClasses)}>
                                {posts.filter(p => {
                                    const postDate = new Date(p.createdAt.split('.').reverse().join('-'));
                                    const today = new Date();
                                    return postDate.getMonth() === today.getMonth() && 
                                           postDate.getFullYear() === today.getFullYear();
                                }).length}
                            </p>
                            <p className={mutedTextClasses}>В этом месяце</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPosts;