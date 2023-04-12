import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import dayjs, { Dayjs } from "dayjs";
import { Advertise } from "@/types/Advertisement";

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

export async function GetAdvertisementUrl(supabaseClient: SupabaseClient<Database>): Promise<Advertise[]> {
  const advertisementResult = await supabaseClient.rpc("get_advertisement");
  if (advertisementResult.error) {
    console.log(advertisementResult.error)
    throw new Error("Get Advertisement Error!!");
  }
  if (!advertisementResult.data) {
    throw new Error("No advertisement data found");
  }
  return advertisementResult.data.map((ad) => ({
    image_url: ad.image_url,
  }));
}