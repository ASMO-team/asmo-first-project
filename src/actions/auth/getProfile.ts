import { API } from "../../helpers/API";
import { type UserWithoutToken } from "../../interfaces/UserWithoutToken";
export default async function getProfile(jwt:string | null):Promise<UserWithoutToken>{
    try {
        const response = await fetch(`${API}/UserRegistration/getProfile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}` ,
                "Content-Type": "application/json"
            },
        })
        if(!response.ok){
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();
        console.log(profileData);
        return profileData
    }catch(error){
        console.error("Profile fetch failed:", error);
        throw error;  
    }
}