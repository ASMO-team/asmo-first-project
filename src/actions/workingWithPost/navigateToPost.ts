import { API } from "../../helpers/API";
import type { PostForm } from "./addPost";

export default async function pickPost(id:number, jwt: string | null):Promise<PostForm | void> {
  try {
    const response = await fetch(`${API}/UserPost/getCertainPost`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(id)
    })
    
    if(response.ok){
      const responseData: PostForm = await response.json();
      console.log(responseData);
      return responseData;
    } 
  } catch(error) {
    console.error(error);
  }
}