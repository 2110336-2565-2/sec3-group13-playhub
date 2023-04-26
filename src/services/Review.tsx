import { Review, ReviewExtend } from "@/types/Review";
import { Database } from "supabase/db_types";
import { SupabaseClient } from "@supabase/supabase-js";

export class ReviewService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async GetReviewByReviewerAndAppointmentId(
    reviewerId: string,
    appointmentId: number
  ): Promise<Review | null> {
    const reviewResult = await this.supabaseClient.rpc(
      "get_review_by_reviewer_and_appointment_id",
      {
        reviewer_id: reviewerId,
        appointment_id: appointmentId,
      }
    );

    if (reviewResult.error) {
      console.log(reviewResult.error);
      throw new Error("Something went wrong!!");
    }

    if (reviewResult.data.length == 0) {
      return null;
    }
    const review = reviewResult.data[0];
    return {
      id: review.id,
      score: review.score,
      description: review.description,
      isAnonymous: review.is_anonymous,
    };
  }

  async GetReviewsByRevieweeId(revieweeId: string): Promise<ReviewExtend[]> {
    const reviewsResult = await this.supabaseClient.rpc("get_reviews_by_reviewee_id", {
      id: revieweeId,
    });

    if (reviewsResult.error) {
      console.log(reviewsResult.error);
      throw new Error("Something went wrong!!");
    }

    return reviewsResult.data.map((review) => ({
      reviewerName: review.reviewer_name,
      appointmentTitle: review.appointment_title,
      description: review.description,
      score: review.score,
      isAnonymous: review.is_anonymous,
    }));
  }

  async GetIsUserReviewedAppointment(userId: string, appointmentId: number): Promise<boolean> {
    const isReviewedResult = await this.supabaseClient.rpc("get_is_user_reviewed_appointment", {
      user_id: userId,
      appointment_id: appointmentId,
    });

    if (isReviewedResult.error) {
      console.log(isReviewedResult.error);
      throw new Error("Something went wrong!!");
    }

    if (isReviewedResult.data) {
      return true;
    } else {
      return false;
    }
  }

  async CreateReview(
    description: string,
    score: number,
    appointmentId: number,
    reviewerId: string,
    isAnonymous: boolean
  ): Promise<void> {
    const createReviewResult = await this.supabaseClient.rpc("create_review", {
      description: description,
      score: score,
      appointment_id: appointmentId,
      reviewer_id: reviewerId,
      is_anonymous: isAnonymous,
    });

    if (createReviewResult.error) {
      console.log(createReviewResult.error);
      throw new Error("Something went wrong!!");
    }
  }

  async UpdateReview(
    id: number,
    description: string,
    score: number,
    isAnonymous: boolean
  ): Promise<void> {
    const updateReviewResult = await this.supabaseClient.rpc("update_review", {
      id: id,
      description: description,
      score: score,
      is_anonymous: isAnonymous,
    });

    if (updateReviewResult.error) {
      console.log(updateReviewResult.error);
      throw new Error("Something went wrong!!");
    }
  }
}
