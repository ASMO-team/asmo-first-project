import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthLayout } from './layouts/Auth/AuthLayout';
import { createHashRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import { Layout } from './layouts/Menu/Layout';
import MenuPage from './pages/MenuPage/MenuPage';
import { Error as ErrorPage } from './pages/Error/Error';
import { ThemeProvider } from './components/ThemProvider/ThemProvider';
import { SidebarProvider } from './components/SidebarContext/SidebarContext';
import AddPost from './pages/AddPost/AddPost';
import MyPosts from './pages/MyPosts/MyPosts';
import OtherUsersPosts from './pages/OtherUsersPosts/OtherUsersPosts';
import UserPost from './pages/UserPost/UserPost';
import EditPost from './pages/EditPost/EditPost';  
import { RequireAuth } from './helpers/Require';

const router = createHashRouter([
  {
    path: '/',
    element: <RequireAuth><Layout/></RequireAuth>,
    children: [
      {
        path: '/',
        element:  <Suspense fallback={<>Загрузка</>}><MenuPage/></Suspense>
      },
      {
        path: '/add-post',
        element: <AddPost/>
      },
      {
        path: '/myPosts',
        element: <MyPosts/>,
      },
      {
        path: '/posts',
        element: <OtherUsersPosts/>
      },
      {
        path: '/post/:postId',
        element: <UserPost/>
      },
      {
        path: '/edit-post/:postId',
        element: <EditPost/>  
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout/>,
    children: [ 
      {
        path: 'register',
        element: <Register/>
      },
      {
        path: 'login',
        element: <Login/>
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <RouterProvider router={router}/>
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)