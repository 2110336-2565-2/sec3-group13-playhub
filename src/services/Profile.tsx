import { User } from "@/types/User";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";


export async function UpdateProfile(
    newDisplayName: string,
    newGender: string,
    newDescription: string,
    newFileImage: File|null,
    user: User,
    supabaseClient: SupabaseClient<Database, "public", any>
): Promise <void> {
    const timeStamp = Date.now();
      if (newFileImage) {
        if (user.image) {
          const deleteImageResult = await supabaseClient.storage
            .from("profileimage")
            .remove([user.image.split("/").at(-1) as string]);
          if (deleteImageResult.error != null) {
            console.log(deleteImageResult.error);
            throw new Error("Something went wrong!!");
          }
        }

        const uploadImageResult = await supabaseClient.storage
          .from("profileimage")
          .upload(user.user_id + timeStamp, newFileImage);
        if (uploadImageResult.error != null) {
          console.log(uploadImageResult.error);
          throw new Error("Something went wrong!!");
        }
      }
      const getImageURLResult = await supabaseClient.storage
        .from("profileimage")
        .getPublicUrl(user.user_id + timeStamp);

      const sendData =
        newFileImage != null
          ? {
              target_id: user.user_id,
              target_username: newDisplayName,
              target_sex: newGender,
              target_description: newDescription,
              target_image: getImageURLResult.data.publicUrl,
            }
          : {
              target_id: user.user_id,
              target_username: newDisplayName,
              target_sex: newGender,
              target_description: newDescription,
              target_image: null
            };

      const updateResult = await supabaseClient
        .rpc('update_user_profile', sendData);

      if (updateResult.error) {
        console.log(updateResult.error);
        throw new Error("Something went wrong!!");
      }
      console.log("Edit success");
    }
