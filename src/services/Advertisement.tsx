import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import dayjs, { Dayjs } from "dayjs";
import { Advertise } from "@/types/Advertisement";

export class AdvertisementService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async CreateAdvertisement(title: string, duration: number, image: File): Promise<void> {
    const currentDate: Dayjs = dayjs();
    const endDate: Dayjs = currentDate.add(duration, "day");
    const imageName = `${currentDate.valueOf()}-${endDate.valueOf()}`;
    const uploadImageResult = await this.supabaseClient.storage
      .from("advertise")
      .upload(imageName, image);
    if (uploadImageResult.error) {
      console.log(uploadImageResult.error);
      throw new Error("UploadImage Error!!!");
    }
    const imageUrlResult = this.supabaseClient.storage.from("advertise").getPublicUrl(imageName);
    const addAdvertisementResult = await this.supabaseClient.rpc("create_advertisement", {
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

  async GetAdvertisementUrl(): Promise<Advertise[]> {
    const advertisementResult = await this.supabaseClient.rpc("get_advertisement");
    if (advertisementResult.error) {
      console.log(advertisementResult.error);
      throw new Error("Get Advertisement Error!!");
    }
    if (!advertisementResult.data) {
      throw new Error("No advertisement data found");
    }
    return advertisementResult.data.map((ad) => ({
      image_url: ad.image_url,
    }));
  }
}

export async function GetAdvertisementUrl(
  supabaseClient: SupabaseClient<Database>
): Promise<Advertise[]> {
  const advertisementResult = await supabaseClient.rpc("get_advertisement");
  if (advertisementResult.error) {
    console.log(advertisementResult.error);
    throw new Error("Get Advertisement Error!!");
  }
  if (!advertisementResult.data) {
    throw new Error("No advertisement data found");
  }
  return advertisementResult.data.map((ad) => ({
    image_url: ad.image_url,
  }));
}
