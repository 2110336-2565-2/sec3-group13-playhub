import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import dayjs, { Dayjs } from "dayjs";

export async function CreateAdvertisement(
  title: string,
  duration: number,
  image: File,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const currentDate: Dayjs = dayjs();
  const endDate: Dayjs = currentDate.add(duration, "day");
  const uploadImageResult = await supabaseClient.storage
    .from("advertise")
    .upload(currentDate.valueOf() + image.name, image);
  if (uploadImageResult.error) {
    console.log(uploadImageResult.error);
    throw new Error("UploadImage Error!!!");
  }
  const imageUrlResult = supabaseClient.storage.from("advertise").getPublicUrl(currentDate.valueOf() + image.name);
  const addAdvertisementResult = await supabaseClient.rpc("create_advertisement", {
    title: title,
    end_date: endDate.toISOString(),
    image_url: imageUrlResult.data.publicUrl,
  });

  if (addAdvertisementResult.error) {
    console.log(addAdvertisementResult.error);
    throw new Error("Add Advertise Error!!");
  }

  return;
}

export async function GetAdvertisement(supabaseClient: SupabaseClient<Database>): Promise<any> {
  const advertisement = await supabaseClient.rpc("get_advertisement");
  if (advertisement.error) {
    console.log(advertisement.error)
    throw new Error("Get Advertisement Error!!");
  }
  if (!advertisement.data) {
    throw new Error("No advertisement data found");
  }
  return advertisement.data;
}