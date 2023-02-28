import Navbar from "@/components/public/Navbar";
import { Box, Link, Typography, Grid, Stack, CardContent } from "@mui/material";
import { AppointmentDetailHeader, AppointmentDetail } from "@/types/Appointment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";
import { Tag } from "@/types/Tag";
import { PagePaths } from "enum/pages";
import { GetAllTags, GetTagsByPost } from "@/services/Tags";
import { GetPostByPostId, UpdatePost } from "@/services/Posts";
import LeftCard from "@/components/createAppointment/LeftCard";
import RightCard from "@/components/createAppointment/RightCard";
import { User } from "@/types/User";
import { UserStatus } from "@/types/User";
type props = {
  appointmentDetail: AppointmentDetail;
};
{
  ["เสี่ยโอ", "เสี่ยที", "Monk God", "อุบลราชธานี", "ไอบอด"];
}
const person: User[] = [
  {
    userId: 1,
    username: "เสี่ยโอ",
    sex: "male",
    birthdate: "28-07-1959",
    description: "เจ้าชู้\nชอบขับเครื่องบินไปเที่ยว\nมีแฟนหลายคนเยอะ",
    image: "https://i.im.ge/2023/02/28/77PS0P.download.jpg",
    email: "siaO@gmail.com",
    isAdmin: false,
  },
  {
    userId: 2,
    username: "เสี่ยที",
    sex: "male",
    birthdate: "12-05-1990",
    description: "แองกรี้เบิร์ด",
    image: "https://i.im.ge/2023/02/28/77fcLJ.EWwNZFtXsAA7Iw9.jpg",
    email: "siaT@gmail.com",
    isAdmin: false,
  },
  {
    userId: 3,
    username: "Monk God",
    sex: "female",
    birthdate: "30-10-1980",
    description: "รวย",
    image: null,
    email: "MonkGod@gmail.com",
    isAdmin: false,
  },
  {
    userId: 4,
    username: "อุบลราชธานี",
    sex: "male",
    birthdate: "14-04-1999",
    description: "ชอบเล่นติ๊กต๊อก",
    image: null,
    email: "Ubon@gmail.com",
    isAdmin: false,
  },
  {
    userId: 5,
    username: "ไอบอด",
    sex: "male",
    birthdate: "05-12-1900",
    description: "ชอบเล่นเกมยิงปืน",
    image: null,
    email: "Ibod@hotmail.com",
    isAdmin: false,
  },
];
export default function Home(props: props) {
  //----Props saving----(Although Refresh)
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const [savedPostId, setSavedPostId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const savedPostIdString = localStorage.getItem("myAppSavedPostId");
      return savedPostIdString ? parseInt(savedPostIdString) : null;
    } else {
      return null;
    }
  });
  const postId = parseInt(router.query.createAppointment as string);

  useEffect(() => {
    // Save the postId to localStorage whenever it changes
    if (typeof window !== "undefined") {
      if (postId) {
        localStorage.setItem("myAppSavedPostId", postId.toString());
        setSavedPostId(postId);
      } else {
        localStorage.removeItem("myAppSavedPostId");
        setSavedPostId(null);
      }
    }
  }, [postId]);

  // Use the savedPostId value if it exists, otherwise use the postId value
  const finalPostId = savedPostId !== null ? savedPostId : postId;

  const userStatus = useContext(userContext);
  console.log(userStatus, finalPostId);

  const [participant, setParticipant] = useState<User[]>([]);
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  function handleParticipantChange(newParticipant: User[]): void {
    setParticipant(newParticipant);
  }

  useEffect(() => {
    GetAllTags(supabaseClient)
      .then()
      .catch((err) => console.log(err));
  }, [supabaseClient]);
  useEffect(() => {
    async function getPostData() {
      if (!finalPostId || !userStatus.user) {
        console.log("error2");
        return;
      }
      GetPostByPostId(userStatus.user, finalPostId, supabaseClient)
        .then((p) => {
          setTitle(p.title);
          setDescription(p.description);
          setLocation(p.location);
          setStartDate(p.startTime);
          setEndDate(p.endTime);
          setImages(p.images);
          setTags(p.tags);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
    getPostData();
  }, [supabaseClient, router.query.post_id]);
  const leftSideData: AppointmentDetailHeader = {
    title: title,
    location: location,
    startDateTime: startDate,
    endDateTime: endDate,
    tags: tags,
    description: description,
  };
  const rightSideData: AppointmentDetail = {
    detailHeader: leftSideData,
    images: images,
    participantAmount: 10,
    pendingParticipants: person,
    acceptParticipants: [],
    rejectParticipants: [],
  };
  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }

  function handleClick() {
    router.back(); // Navigate back to the previous page
  }

  return (
    <>
      <Navbar />
      {/*  ArrowBackIcon */}

      <Box display="flex" paddingBottom="40px">
        <Link>
          <ArrowBackIcon
            fontSize="large"
            sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
            onClick={handleClick}
          />
        </Link>
      </Box>
      {/*  Title */}
      <Box>
        <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "40px" }}>
          Create Appointment
        </Typography>
      </Box>
      {/*  Left and Right Card */}
      <Box display="flex" justifyContent="center" padding="40px">
        <Grid container spacing="40px" width="80vw">
          {/*  Left Card */}
          <Grid item xs={12} md={6} style={{ display: "flex" }}>
            {finalPostId && (
              <LeftCard
                leftSideData={leftSideData}
                isUnClick={true} /* isUnClick mean in text block cannot click or fill value */
              />
            )}
          </Grid>
          {/*  Right Card */}
          <Grid item xs={12} md={6} style={{ display: "flex" }}>
            <RightCard
              rightSideData={rightSideData}
              /*
              Try to send data from this
              IsSubmit through right card 
              and 
              Participant<User[]> through AddParicipant through right card.
              */

              /*
              sendParticipant={childToParent1}
              sendIsSubmit={childToParent2}
              */
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
