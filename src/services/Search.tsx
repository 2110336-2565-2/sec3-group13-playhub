import { PostInfo } from "@/types/Post"
import { SupabaseClient } from "@supabase/supabase-js"
import dayjs from "dayjs";
import { Database } from "supabase/db_types"

export async function SearchPostByConditions(
    tagIds: number[],
    hostNames: string[],
    postNames: string[],
    supabaseClient: SupabaseClient<Database>
): Promise<PostInfo[]> {
    const searchResult = await supabaseClient.rpc("search_posts_by_conditions", {
        tag_ids: tagIds,
        host_names: hostNames,
        post_names: postNames
    });

    if (searchResult.error) {
        throw new Error("Something went wrong!!");
    }

    return searchResult.data.map((post) => ({
        title: post.title,
        userId: post.owner_id,
        location: post.location,
        tags: post.tags.map((tag) => ({
            id: tag.id,
            name: tag.name
        })),
        description: post.description,
        images: post.images,
        startTime: dayjs(post.start_time),
        endTime: dayjs(post.end_time),
        participants: post.participants.map((user) => ({
            userId: user.id,
            username: user.username,
            sex: user.sex,
            birthdate: user.birthdate,
            description: user.description,
            image: user.image,
            email: "",
            isAdmin: false,
            isVerified: user.is_verified,
        })),
    }));
}