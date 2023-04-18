import { Post, PostInfo } from "@/types/Post";
import { User } from "@/types/User";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";
import dayjs, { Dayjs } from "dayjs";
import { SUPABASE_CONNECTING_ERROR } from "@/constants/supabase";

export function dayjsWithoutTZ(date: string): Dayjs {
  const dateWithoutTZ = date.substring(0, date.indexOf("+"));
  return dayjs(dateWithoutTZ);
}

export class PostService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async CreatePost(newPost: PostInfo): Promise<void> {
    const now = Date.now();
    let index = 0;
    let images: string[] = [];
    for (const e of newPost.images) {
      const filePath = newPost.userId + index.toString() + now.toString();
      const fileBlob = await fetch(e).then((r) => r.blob());
      const uploadResult = await this.supabaseClient.storage
        .from("locationimage")
        .upload(filePath, fileBlob);
      if (uploadResult.error) return;
      const imageUrlResult = this.supabaseClient.storage
        .from("locationimage")
        .getPublicUrl(filePath);
      images.push(imageUrlResult.data.publicUrl);
      index += 1;
    }

    const addPostResult = await this.supabaseClient.rpc("create_post", {
      title: newPost.title,
      location: newPost.location,
      description: newPost.description,
      owner_id: newPost.userId,
      start_time: newPost.startTime.format("MM/DD/YYYY HH:mm:ss"),
      end_time: newPost.endTime.format("MM/DD/YYYY HH:mm:ss"),
      tags: newPost.tags.map((e) => e.id),
      images: images,
    });

    if (addPostResult.error) {
      console.log(addPostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
  }

  async UpdatePost(postId: number, originalImages: string[], updatedPost: PostInfo): Promise<void> {
    console.log(updatedPost);
    let images = [...originalImages];
    let index = 0;
    for (const image of originalImages) {
      if (!updatedPost.images.includes(image)) {
        const deleteImage = image.split("/").at(-1) as string;
        const deleteImageResult = await this.supabaseClient.storage
          .from("locationimage")
          .remove([deleteImage]);
        if (deleteImageResult.error) {
          console.log(deleteImageResult.error);
          throw new Error(SUPABASE_CONNECTING_ERROR);
        }
        images.splice(images.findIndex((value) => image == value));
      }
      index += 1;
    }

    index = 0;
    for (const image of updatedPost.images) {
      const timeStamp = Date.now();
      const filePath = updatedPost.userId + index + timeStamp;
      if (!originalImages.includes(image)) {
        const uploadImageFile = await fetch(image).then((r) => r.blob());
        const uploadImageResult = await this.supabaseClient.storage
          .from("locationimage")
          .upload(filePath, uploadImageFile);
        if (uploadImageResult.error != null) {
          console.log(uploadImageResult.error);
          throw new Error(SUPABASE_CONNECTING_ERROR);
        }

        const getImageURLResult = this.supabaseClient.storage
          .from("locationimage")
          .getPublicUrl(filePath);
        images.push(getImageURLResult.data.publicUrl);
      }
    }

    const sendData = {
      id: postId,
      title: updatedPost.title,
      location: updatedPost.location,
      start_time: updatedPost.startTime.format("MM/DD/YYYY HH:mm:ss"),
      end_time: updatedPost.endTime.format("MM/DD/YYYY HH:mm:ss"),
      description: updatedPost.description,
      tags: updatedPost.tags.map((e) => e.id),
      images: images,
    };

    const updatePostResult = await this.supabaseClient.rpc("update_post_by_post_id", sendData);

    if (updatePostResult.error) {
      console.log(updatePostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
  }

  async DeletePost(id: number): Promise<void> {
    const deletePostResult = await this.supabaseClient.rpc("delete_post_by_post_id", { id });

    if (deletePostResult.error) {
      console.error(deletePostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
  }

  async GetCurrentUserPosts(user: User): Promise<Post[]> {
    const getAllUserPostResult = await this.supabaseClient.rpc("get_posts_by_user_id", {
      id: user.userId,
    });
    if (getAllUserPostResult.error) {
      console.log(getAllUserPostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }

    if (!getAllUserPostResult.data) throw new Error(SUPABASE_CONNECTING_ERROR);

    return getAllUserPostResult.data.map((post) => ({
      postId: post.id,
      title: post.title,
      ownerId: post.owner_id,
      ownerName: post.owner_name,
      ownerProfilePic: post.owner_profile,
      tags: post.tag_names,
      description: post.description,
      image: post.images,
      location: post.location,
      startDateTime: dayjsWithoutTZ(post.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjsWithoutTZ(post.end_time).format("DD/MM/YYYY hh:mm A"),
    }));
  }

  async GetPosts(): Promise<Post[]> {
    const getAllUserPostResult = await this.supabaseClient.rpc("get_posts");
    if (getAllUserPostResult.error) {
      console.log(getAllUserPostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
    return getAllUserPostResult.data.map((post) => ({
      postId: post.id,
      title: post.title,
      ownerId: post.owner_id,
      ownerName: post.owner_name,
      ownerProfilePic: post.owner_profile,
      tags: post.tag_names,
      description: post.description,
      image: post.images,
      location: post.location,
      startDateTime: dayjsWithoutTZ(post.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjsWithoutTZ(post.end_time).format("DD/MM/YYYY hh:mm A"),
    }));
  }

  async GetPostsWithParticipants(): Promise<Post[]> {
    const getAllUserPostResult = await this.supabaseClient.rpc("get_posts_with_participants");
    if (getAllUserPostResult.error) {
      console.log(getAllUserPostResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }
    return getAllUserPostResult.data.map((post) => ({
      postId: post.id,
      title: post.title,
      ownerId: post.owner_id,
      ownerName: post.owner_name,
      ownerProfilePic: post.owner_profile,
      tags: post.tags.map((tag: any) => tag.name),
      description: post.description,
      image: post.images,
      location: post.location,
      startDateTime: dayjsWithoutTZ(post.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjsWithoutTZ(post.end_time).format("DD/MM/YYYY hh:mm A"),
      participants: post.participants.map((e: any) => ({
        userId: e.id,
        username: e.username,
        sex: e.sex,
        isVerified: e.is_verified,
        birthdate: e.birthdate,
        description: e.description,
        image: e.image,
        email: "",
        isAdmin: false,
      })),
    }));
  }

  async GetPostByPostId(user: User, postId: number): Promise<PostInfo> {
    const getPostDataResult = await this.supabaseClient.rpc("get_post_by_post_id", {
      id: postId,
    });
    if (getPostDataResult.error || !getPostDataResult.data) {
      console.log(getPostDataResult.error);
      throw new Error(SUPABASE_CONNECTING_ERROR);
    }

    let tag_name = [...getPostDataResult.data[0].tag_names].sort();
    let tag_ids = [...getPostDataResult.data[0].tags].sort();

    const postData: PostInfo = {
      userId: user.userId,
      title: getPostDataResult.data[0].title,
      description: getPostDataResult.data[0].description,
      location: getPostDataResult.data[0].location,
      startTime: dayjsWithoutTZ(getPostDataResult.data[0].start_time),
      endTime: dayjsWithoutTZ(getPostDataResult.data[0].end_time),
      images: getPostDataResult.data[0].images,
      tags: getPostDataResult.data[0].tag_names.map((_: any, idx: number) => ({
        id: tag_ids[idx],
        name: tag_name[idx],
      })),
    };
    return postData;
  }

  async GetPostWithParticipantsByPostId(postId: number): Promise<PostInfo> {
    const getPostDataResult = await this.supabaseClient.rpc(
      "get_post_with_participants_by_post_id",
      {
        id: postId,
      }
    );
    if (getPostDataResult.error || !getPostDataResult.data) {
      console.log(getPostDataResult.error);
      throw new Error("Cant get posts data");
    }
    const postData = getPostDataResult.data[0];
    return {
      title: postData.title,
      userId: postData.owner_id,
      tags: postData.tags,
      description: postData.description,
      images: postData.images,
      location: postData.location,
      startTime: dayjs(postData.start_time),
      endTime: dayjs(postData.end_time),
      participants: postData.participants.map((e: any) => ({
        userId: e.id,
        username: e.username,
        sex: e.sex,
        isVerified: e.is_verified,
        birthdate: e.birthdate,
        description: e.description,
        image: e.image,
        email: "",
        isAdmin: false,
      })),
    };
  }
}
