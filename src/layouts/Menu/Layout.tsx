import {  Outlet } from "react-router-dom";
import style from './Layout.module.css';
import SideBar from "../../components/SideBar/SideBar";
import cn from "classnames";
import { useEffect, useState } from "react";
 
export function Layout()  {
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => {
    const toSetAnAvatar = localStorage.getItem('userAvatar');
    setAvatar(toSetAnAvatar);
  }, [avatar])
  return (
    <div className={cn(  style.menu)}>
      <header className={cn(style.header, 'flex items-center justify-end w-full opacity-100 border-b border-[#E9F5FE] dark:border-gray-700 py-6 px-[42px]')}>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E9F5FE] dark:border-gray-600">
          <img src={avatar === null?undefined:avatar} alt="avatar" className="w-full h-full object-cover"/>
        </div>
      </header>
      <main className={style.content}>
        <Outlet/>
      </main>
      <div className={cn(style.sidebar )}>
        <SideBar/>
      </div>
    </div>
  )
}

 

