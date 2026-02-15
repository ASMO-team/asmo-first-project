import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const jwt = localStorage.getItem('token');  
    if (!jwt) {
        return <Navigate to="/auth/login" replace />;
    }
    return children;
};