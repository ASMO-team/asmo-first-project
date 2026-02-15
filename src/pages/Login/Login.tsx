import { useState, type ChangeEvent, type FormEvent } from "react";
import { H } from "../../components/Htag/H";
import Input from "../../components/InputAuth/Input";
import userIcon from '../../assets/icons/user.svg';
import passwordIcon from '../../assets/icons/password.svg';
import { Link, useNavigate } from "react-router-dom";
import loginUser from "../../actions/auth/login";
import type { LoginForm } from "../../interfaces/LoginForm";
import cn from 'classnames';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(formData);
      
      if (result.success && result.user) {
        localStorage.setItem('token', result.user.token);
        navigate("/");
      } else {
        setError(result.message || "Произошла ошибка при входе");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем, заполнены ли оба поля
  const isFormValid = formData.email && formData.password;
  const isSubmitDisabled = !isFormValid || isLoading;

  // Классы для кнопки
  const buttonClasses = cn(
    "w-full py-4 text-[16px] font-medium text-white rounded-xl transition-all duration-300 transform",
    {
      "bg-gray-400 cursor-not-allowed opacity-60": isSubmitDisabled,
      "bg-[#A3DCFF] hover:bg-[#8bcfff] hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg": !isSubmitDisabled,
      "animate-pulse": isLoading
    }
  );

  // Классы для спиннера загрузки
  const spinnerClasses = cn(
    "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
  );

  // Классы для сообщения об ошибке
  const errorClasses = cn(
    "text-red-500 text-center p-3 bg-red-50 rounded-lg border border-red-200"
  );

  // Классы для ссылки регистрации
  const linkClasses = cn(
    "text-[#A3DCFF] text-[14px] font-medium hover:underline transition-all duration-200"
  );

  return (
    <div className="bg-white w-[408px] rounded-2xl shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] p-8">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <H tag="h2" className="text-center text-[#5D7285]">Login your account!</H>  
        
        {error && (
          <div className={errorClasses}>
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          <p className="text-[16px] text-[#5D7285] text-center font-medium">
            enter your credentials
          </p>

          <div className="flex flex-col gap-4">
            <Input 
              placeholder="Email" 
              name="email" 
              type="email" 
              logo={userIcon}
              value={formData.email}
              onChange={handleChange}
            />
            
            <Input 
              placeholder="Password" 
              type="password" 
              name="password" 
              logo={passwordIcon}
              value={formData.password}
              onChange={handleChange}
            />

            {/* Кнопка с использованием classnames */}
            <button 
              type="submit"
              className={buttonClasses}
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className={spinnerClasses}></div>
                  Loading...
                </div>
              ) : (
                "Continue"
              )}
            </button>
            
            {/* Ссылка с использованием classnames */}
            <div className="flex gap-1 items-center justify-center pt-2">
              <div className="text-[14px] text-gray-600">
                don't have an account yet ?
              </div>
              <Link 
                to="/auth/register" 
                className={linkClasses}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;