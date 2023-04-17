import { SUPABASE_CONNECTING_ERROR } from "@/constants/supabase";
import { User } from "@/types/User";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export class ProfileService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async UpdateProfile(
    newDisplayName: string,
    newGender: string,
    newDescription: string,
    newFileImage: File | null,
    user: User
  ): Promise<void> {
    const timeStamp = Date.now();
    if (newFileImage) {
      if (user.image) {
        const deleteImageResult = await this.supabaseClient.storage
          .from("profileimage")
          .remove([user.image.split("/").at(-1) as string]);
        if (deleteImageResult.error != null) {
          console.log(deleteImageResult.error);
          throw new Error(SUPABASE_CONNECTING_ERROR);
        }
      }

      const uploadImageResult = await this.supabaseClient.storage
        .from("profileimage")
        .upload(user.userId + timeStamp, newFileImage);
      if (uploadImageResult.error != null) {
        console.log(uploadImageResult.error);
        throw new Error(SUPABASE_CONNECTING_ERROR);
      }
    }
    const getImageURLResult = await this.supabaseClient.storage
      .from("profileimage")
      .getPublicUrl(user.userId + timeStamp);

    const sendData =
      newFileImage != null
        ? {
            id: user.userId,
            username: newDisplayName,
            sex: newGender,
            description: newDescription,
            image: getImageURLResult.data.publicUrl,
          }
        : {
            id: user.userId,
            username: newDisplayName,
            sex: newGender,
            description: newDescription,
            image: null,
          };

    const updateResult = await this.supabaseClient.rpc("update_user_by_user_id", sendData);

    if (updateResult.error) {
      console.log(updateResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
    console.log("Edit success");
  }
}
