import { PostInfo } from "@/types/Post";
import { User } from "@/types/User";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function CreatePost(
  newPost: PostInfo,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const now = Date.now();
  let index = 0;
  let images: string[] = [];
  for (const e of newPost.images) {
    const filePath = newPost.userId + index.toString() + now.toString();
    const fileBlob = await fetch(e).then((r) => r.blob());
    const uploadResult = await supabaseClient.storage
      .from("locationimage")
      .upload(filePath, fileBlob);
    if (uploadResult.error) return;
    const imageUrlResult = supabaseClient.storage
      .from("locationimage")
      .getPublicUrl(filePath);
    images.push(imageUrlResult.data.publicUrl);
    index += 1;
  }

  const addPostResult = await supabaseClient.rpc("create_post", {
    title: newPost.title,
    location: newPost.location,
    description: newPost.description,
    owner_id: newPost.userId,
    start_time: newPost.startTime.toString(),
    end_time: newPost.endTime.toString(),
    tags: newPost.tags.map((e) => e.id),
    images: images
  });

  if (addPostResult.error) {
    console.log(addPostResult.error);
    throw new Error("Something went wrong!!");
  }
}

export async function UpdatePost(
  postId: number,
  originalImages: string[],
  updatedPost: PostInfo,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  let images = [...originalImages];
  let index = 0;
  for (const image of originalImages) {
    if (!updatedPost.images.includes(image)) {
      const deleteImage = image.split("/").at(-1) as string;
      const deleteImageResult = await supabaseClient.storage
        .from("locationimage")
        .remove([deleteImage]);
      if (deleteImageResult.error) {
        console.log(deleteImageResult.error);
        throw new Error("Something went wrong!!");
      }
      images.splice(images.findIndex((value, index) => image == value));
    }
    index += 1;
  }

  index = 0;
  for (const image of updatedPost.images) {
    const timeStamp = Date.now();
    const filePath = updatedPost.userId + index + timeStamp;
    if (!originalImages.includes(image)) {
      const uploadImageFile = await fetch(image).then((r) => r.blob());
      const uploadImageResult = await supabaseClient.storage
        .from("locationimage")
        .upload(filePath, uploadImageFile);
      if (uploadImageResult.error != null) {
        console.log(uploadImageResult.error);
        throw new Error("Something went wrong!!");
      }

      const getImageURLResult = supabaseClient.storage
        .from("locationimage")
        .getPublicUrl(filePath);
      images.push(getImageURLResult.data.publicUrl);
    }
  }

  const sendData = {
    id: postId,
    title: updatedPost.title,
    location: updatedPost.location,
    start_time: updatedPost.startTime.toString(),
    end_time: updatedPost.endTime.toString(),
    description: updatedPost.description,
    tags: updatedPost.tags.map((e) => e.id),
    images: images
  };

  const updatePostResult = await supabaseClient.rpc(
    "update_post_by_post_id",
    sendData
  );

  if (updatePostResult.error) {
    console.log(updatePostResult.error);
    throw new Error("Something went wrong!!");
  }
}

export async function DeletePost(
  id: number,
  supabaseClient: SupabaseClient<Database, "public", any>
) : Promise <void> {
  const deletePostResult = await supabaseClient.rpc("delete_post_by_post_id", {id});

  if (deletePostResult.error) {
    console.error(deletePostResult.error);
    throw new Error("Something went wrong!!");
  }
}