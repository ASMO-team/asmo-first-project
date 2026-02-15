import { API } from "../../helpers/API";
import { type PostFormWithId } from "../../interfaces/PostFormWithId";

export default async function getUserTests(jwt: string | null):Promise<PostFormWithId[]> {
    try {
        const response = await fetch(`${API}/UserPost/GetUserPosts`, {
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
        const userTests = await response.json();
        console.log(userTests);
        return userTests;
    }catch(error){
        console.error("user tests fetch failed:", error);
        throw error;  
    }
}
