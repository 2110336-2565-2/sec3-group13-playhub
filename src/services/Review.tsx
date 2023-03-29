import { Review } from "@/types/Review";
import { Database } from "supabase/db_types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function GetReviewsByRevieweeId(
    supabaseClient: SupabaseClient<Database>,
    revieweeId: string
): Promise<Review[]> {
    const reviewsResult = await supabaseClient.rpc(
        "get_reviews_by_reviewee_id",
        { id: revieweeId }
    );

    if (reviewsResult.error) {
        console.log(reviewsResult.error);
        throw new Error("Something went wrong!!");
    }

    return reviewsResult.data.map((review) => ({
        reviewerName: review.reviewer_name,
        appointmentTitle: review.appointment_title,
        description: review.description,
        score: review.score,
    }));
}