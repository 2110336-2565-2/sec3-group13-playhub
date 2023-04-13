import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";
import { UserService } from "./User";
import { AdvertisementService } from "./Advertisement";
import { AppointmentService } from "./Appointment";
import { ParticipantService } from "./Participant";
import { PasswordService } from "./Password";
import { PostService } from "./Posts";
import { ProfileService } from "./Profile";
import { ReviewService } from "./Review";
import { SearchService } from "./Search";
import { TagService } from "./Tags";

export class Service {
  supabaseClient: SupabaseClient<Database>;
  advertisement: AdvertisementService;
  appointment: AppointmentService;
  participant: ParticipantService;
  password: PasswordService;
  post: PostService;
  profile: ProfileService;
  review: ReviewService;
  search: SearchService;
  tag: TagService;
  user: UserService;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
    this.advertisement = new AdvertisementService(this.supabaseClient);
    this.appointment = new AppointmentService(this.supabaseClient);
    this.participant = new ParticipantService(this.supabaseClient);
    this.password = new PasswordService(this.supabaseClient);
    this.post = new PostService(this.supabaseClient);
    this.profile = new ProfileService(this.supabaseClient);
    this.review = new ReviewService(this.supabaseClient);
    this.search = new SearchService(this.supabaseClient);
    this.tag = new TagService(this.supabaseClient);
    this.user = new UserService(this.supabaseClient);
  }
}
