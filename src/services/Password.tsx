import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function RequestResetPassword(
  email: string,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const sendResetPasswordEmailResult = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_DOMAIN_NAME + "/resetPassword",
  });
  if (sendResetPasswordEmailResult.error) {
    throw new Error("Something went wrong!!");
  }
}

export async function ResetPassword(
  newPassword: string,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const resetPasswordResult = await supabaseClient.auth.updateUser({ password: newPassword });
  if (resetPasswordResult.error) {
    throw new Error("Something went wrong!!");
  }
}
