import LogoIcon from '../../assets/icons/Logo.svg';
import HomeIcon from '../../assets/icons/home.svg';
import PostsIcon from '../../assets/icons/posts.svg';
import AddPostIcon from '../../assets/icons/addPost.svg';
import LogoutIcon from '../../assets/icons/Logout.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemProvider/ThemProvider';
import MoonIcon from '../../assets/icons/moon.svg';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { useSidebar } from '../SidebarContext/SidebarContext';
import cn from 'classnames';

const SideBar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    
    // Функция для выхода
    const handleLogout = () => {
         
        localStorage.removeItem('token');
   
        window.location.reload();
         
    };
    
    // Базовые классы
    const sidebarClasses = cn(
        'flex flex-col py-[33.48px] gap-[50.22px] shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] min-h-full relative transition-all duration-300',
        {
            'w-20 px-2.5': isCollapsed,
            'w-[340px] px-[25.11px]': !isCollapsed
        }
    );

    const logoContainerClasses = cn(
        'flex items-center gap-[16.74px]'
    );

    const listItemClasses = cn(
        'list-none p-[8.37px] hover:bg-[#E9F5FE]'
    );

    const linkClasses = cn(
        'flex gap-3.5 items-center no-underline'
    );

    const linkTextClasses = cn(
        'text-[16.74px] tracking-[1%] text-[#5D7285]'
    );

    const bottomSectionClasses = cn(
        'absolute bottom-[25.11px] left-[25.11px] right-[25.11px] flex flex-col gap-[25.11px]'
    );

    const themeToggleClasses = cn(
        'flex items-center p-[8.37px] hover:bg-[#E9F5FE] rounded',
        {
            'justify-center': isCollapsed,
            'justify-between': !isCollapsed
        }
    );

    const themeTextClasses = cn(
        'text-[16.74px] tracking-[1%] text-[#5D7285]'
    );

    const logoutButtonClasses = cn(
        'bg-[#667A8A] flex gap-4 items-center p-[8.37px] cursor-pointer rounded-[5px] border-none',
        {
            'justify-center': isCollapsed
        }
    );

    const logoutTextClasses = cn(
        'text-[16.74px] tracking-[1%] text-white'
    );

    return (
        <div className={sidebarClasses}>
            <div className={logoContainerClasses}>
                <img 
                    src={LogoIcon} 
                    alt="logo" 
                    onClick={toggleSidebar}
                    className="cursor-pointer"
                />
                {!isCollapsed && (
                    <h1 className='text-[24.06px] text-[#5D7285] tracking-[0.5%]'>
                        Asmo
                    </h1>
                )}
            </div>
            <ul className='flex flex-col gap-[16px] p-[8.37px]'>
                <li className={listItemClasses}>
                    <Link to="/" className={linkClasses}>
                        <img src={HomeIcon} alt="home" />
                        {!isCollapsed && (
                            <div className={linkTextClasses}>home</div>
                        )}
                    </Link>
                </li>
                <li className={listItemClasses}>
                    <Link to="/add-post" className={linkClasses}>
                        <img src={AddPostIcon} alt="addPost" />
                        {!isCollapsed && (
                            <div className={linkTextClasses}>addPost</div>
                        )}
                    </Link>
                </li>
                <li className={listItemClasses}>
                    <Link to="/myPosts" className={linkClasses}>
                        <img src={AddPostIcon} alt="addPost" />
                        {!isCollapsed && (
                            <div className={linkTextClasses}>My Posts</div>
                        )}
                    </Link>
                </li>
                <li className={listItemClasses}>
                    <Link to="/posts" className={linkClasses}>
                        <img src={PostsIcon} alt="otherUsersPost" />
                        {!isCollapsed && (
                            <div className={linkTextClasses}>otherUsersPost</div>
                        )}
                    </Link>
                </li>
            </ul>
            <div className={bottomSectionClasses}>
                <div className={themeToggleClasses}>
                    {!isCollapsed && (
                        <div className='flex items-center gap-3.5'>
                            <img src={MoonIcon} alt='moon'/>
                            <span className={themeTextClasses}>
                                {isDark ? 'Темная тема' : 'Светлая тема'}
                            </span>
                        </div>
                    )}
                    <ToggleSwitch isOn={isDark} handleToggle={toggleTheme} />
                </div>
                <button 
                    className={logoutButtonClasses}
                    onClick={handleLogout} // Добавляем обработчик клика
                >
                    <img src={LogoutIcon} alt='LogoutIcon'/>
                    {!isCollapsed && (
                        <div className={logoutTextClasses}>
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}

export default SideBar;