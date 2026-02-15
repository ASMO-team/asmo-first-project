import { API } from "../../helpers/API";
import { type ApiResponseTest } from "../../interfaces/ApiResponce";
import type { PostForm } from "./addPost";

export default async function editPost(post:PostForm, jwt:string | null) {
    try {
        const response = await fetch(`${API}/UserPost/editPost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(post)
        })

        const responseData: ApiResponseTest = await response.json();
        return responseData.message
    } catch(error) {
    console.error(error);
  }
}