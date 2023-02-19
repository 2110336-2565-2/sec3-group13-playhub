import { PostInfo } from "@/types/Post";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function CreatePost(
  newPost: PostInfo,
  supabaseClient: SupabaseClient<Database, "public", any>
): Promise<void> {
  const addPostResult = await supabaseClient.rpc("add_post", {
    title: newPost.title,
    location: newPost.location,
    description: newPost.description,
    owner_id: newPost.userId,
    start_timestamp: newPost.startTime,
    end_timestamp: newPost.endTime,
  });
  if (addPostResult.error) {
    console.log(addPostResult.error);
    throw new Error("Something went wrong!!");
  }

  newPost.tags.forEach(async (e) => {
    await supabaseClient.rpc("add_post_tag", {
      tag_id: e.id,
      post_id: addPostResult.data,
    });
  });

  const now = Date.now();
  let index = 0;
  for (const e of newPost.images) {
    const filePath =
      addPostResult.data.toString() + index.toString() + now.toString();
    const fileBlob = await fetch(e).then((r) => r.blob());
    const uploadResult = await supabaseClient.storage
      .from("locationimage")
      .upload(filePath, fileBlob);
    if (uploadResult.error) return;
    const imageUrlResult = await supabaseClient.storage
      .from("locationimage")
      .getPublicUrl(filePath);
    await supabaseClient.rpc("add_post_image", {
      post_id: addPostResult.data,
      image: imageUrlResult.data.publicUrl,
    });
    index += 1;
  }
}

export async function UpdatePost(
  postId: number,
  originalImages: string[],
  updatedPost: PostInfo,
  supabaseClient: SupabaseClient<Database, "public", any>
): Promise<void> {
  const sendData = {
    post_id: postId,
    post_title: updatedPost.title,
    post_location: updatedPost.location,
    post_start_time: updatedPost.startTime,
    post_end_time: updatedPost.endTime,
    post_description: updatedPost.description,
  };

  const updatePostResult = await supabaseClient.rpc(
    "update_post_by_post_id",
    sendData
  );
  if (updatePostResult.error) {
    console.log(updatePostResult.error);
    throw new Error("Something went wrong!!");
  }

  // const deleteOldTagResult = await supabaseClient.rpc("delete_post_tag", {
  //   target_post_id: postId,
  // });

  updatedPost.tags.forEach(async (e) => {
    await supabaseClient.rpc("add_post_tag", {
      tag_id: e.id,
      post_id: postId,
    });
  });

  let index = 0;
  for (const image of originalImages) {
    if (!updatedPost.images.includes(image)) {
      const deleteImage = image.split("/").at(-1) as string;
      const deleteImageResult = await supabaseClient.storage
        .from("locationimage")
        .remove([deleteImage]);
      if (deleteImageResult.error != null) {
        console.log(deleteImageResult.error);
        throw new Error("Something went wrong!!");
      }

      const deleteImageFromTableResult = await supabaseClient.rpc(
        "delete_image_by_link",
        { target_image_link: image }
      );
      if (deleteImageFromTableResult.error) {
        console.log(deleteImageFromTableResult.error);
        throw new Error("Something went wrong!!");
      }
    }
    index += 1;
  }

  index = 0;
  for (const image of updatedPost.images) {
    const timeStamp = Date.now();

    if (!originalImages.includes(image)) {
      const uploadImageFile = await fetch(image).then((r) => r.blob());
      const uploadImageResult = await supabaseClient.storage
        .from("locationimage")
        .upload(postId.toString() + index + timeStamp, uploadImageFile);
      if (uploadImageResult.error != null) {
        console.log(uploadImageResult.error);
        throw new Error("Something went wrong!!");
      }

      const getImageURLResult = await supabaseClient.storage
        .from("locationimage")
        .getPublicUrl(postId.toString() + index + timeStamp);

      const addImageToTable = await supabaseClient.rpc("add_location_image", {
        target_post_id: postId,
        target_image_link: getImageURLResult.data.publicUrl,
      });
      if (addImageToTable.error != null) {
        console.log(addImageToTable.error);
        throw new Error("Something went wrong!!");
      }
    }
  }
}
