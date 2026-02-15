import ProfileComponent from "../../components/ProfileComponent/ProfileComponent";
import { useEffect, useState } from "react";
import getProfile from "../../actions/auth/getProfile";
import { type UserWithoutToken } from "../../interfaces/UserWithoutToken";
import editProfileDate from "../../actions/workingWithUserDate/editProfile";

const MenuPage = () => {
  const [userData, setUserData] = useState<UserWithoutToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Пользователь не авторизован");
          return;
        }

        const profileData = await getProfile(token);
        setUserData(profileData);
        
        if (profileData.userProfilePicture) {
          localStorage.setItem('userAvatar', profileData.userProfilePicture);
        }
        
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
        setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (userData: { name: string; email: string; avatar?: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Пользователь не авторизован");
      }

      // Преобразуем данные в формат для editProfileDate
      const formData = {
        userName: userData.name,
        email: userData.email,
        avatar: userData.avatar 
      };
      console.log(formData);
      const result = await editProfileDate(formData, token);
      
      // Обновляем локальное состояние
      setUserData(prev => prev ? {
        ...prev,
        name: userData.name,
        email: userData.email,
        userProfilePicture: userData.avatar || prev.userProfilePicture
      } : null);

      // Обновляем localStorage если аватар изменился
      if (userData.avatar) {
        localStorage.setItem('userAvatar', userData.avatar);
      } else if (userData.avatar === '') {
        localStorage.removeItem('userAvatar');
      }

      console.log("Профиль успешно обновлен:", result.message);
      return result;
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#5D7285]">Загрузка профиля...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#5D7285]">Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ProfileComponent
        user={{
          name: userData.name,
          email: userData.email,
          avatar: userData.userProfilePicture
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

export default MenuPage;