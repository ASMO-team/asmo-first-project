import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { H } from "../../components/Htag/H";
import Input from "../../components/InputAuth/Input";
import userIcon from '../../assets/icons/user.svg';
import passwordIcon from '../../assets/icons/password.svg';
import { Link, useNavigate } from "react-router-dom";
import { validationSchema, type RegisterForm } from "../../actions/auth/register";
import registerUser from "../../actions/auth/register";
import { useState } from "react";
import cn from 'classnames';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError
  } = useForm<RegisterForm>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await registerUser(data);
      
      if (result.success) {
        console.log("Registration successful:", result.user);
        if (result.user?.token) {
          localStorage.setItem('token', result.user.token);
        }
        navigate("/");
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof RegisterForm, {
              type: "server",
              message: messages?.[0] || "Server error"
            });
          });
        }
        if (result.message) {
          setServerError(result.message);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Кнопка disabled если форма невалидна ИЛИ не была изменена ИЛИ идет загрузка
  const isSubmitDisabled = !isValid || !isDirty || isLoading;

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

  // Классы для ссылки входа
  const linkClasses = cn(
    "text-[#A3DCFF] text-[14px] font-medium hover:underline transition-all duration-200"
  );

  return (
    <div className="bg-white w-[408px] rounded-2xl shadow-[0_3.57px_40.21px_0_rgba(0,0,0,0.08)] p-8">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <H tag="h2" className="text-center text-[#5D7285]">Create your account</H> 
        
        <div className="flex flex-col gap-6">
          <p className="text-[16px] text-[#5D7285] text-center font-medium">
            enter your full details
          </p>
          
          {serverError && (
            <div className={errorClasses}>
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Username */}
            <Input 
              placeholder="Username" 
              type="text" 
              logo={userIcon}
              {...register("userName")}
              error={errors.userName?.message}
            />
            
            {/* Email */}
            <Input 
              placeholder="Email" 
              type="email" 
              logo={userIcon}
              {...register("email")}
              error={errors.email?.message}
            />
            
            {/* Password */}
            <Input 
              placeholder="Password" 
              type="password" 
              logo={passwordIcon}
              {...register("password")}
              error={errors.password?.message}
            />
            
            {/* Confirm Password */}
            <Input 
              placeholder="Confirm Password" 
              type="password" 
              logo={passwordIcon}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
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
                have an account ?
              </div>
              <Link 
                to="/auth/login" 
                className={linkClasses}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div> 
      </form>
    </div>
  );
}

export default Register;