import { Suspense, useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Avatar, IconButton, Chip, Typography, Stack, Card, IconButtonProps, styled, CardHeader, Rating, CardContent, Box, Collapse, Divider } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";
import EditIcon from "@mui/icons-material/Edit";

import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";
import VerifyChip from "@/components/profile/VerifyChip";

import { User } from "@/types/User";
import { PAGE_PATHS } from "enum/PAGES";
import { GENDER } from "enum/GENDER";
import { GetUserByUserId } from "@/services/User";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { COLOR_CODE } from "enum/COLOR";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

type Rating = {
  ratingOwnerName: string;
  appointmentTitle: string;
  ratingScore: number;
  rationDescription: string;
}

// for actual feedbacks, this should be deleted
const mockRatings: Rating[] = [{
  ratingOwnerName: "Anonymous",
  appointmentTitle: "ไปเล่นบอร์ดเกมกัน แถวสยาม",
  ratingScore: 4,
  rationDescription: "พี่ออมดูแลหนูดีมากเลยค่ะ <3"
},
{
  ratingOwnerName: "AbCd",
  appointmentTitle: "ไปกู้โลกกันเถอะ",
  ratingScore: 5,
  rationDescription: ""
},
{
  ratingOwnerName: "ครัยนร้า",
  appointmentTitle: "จะเป็นวิลเลิน",
  ratingScore: 4,
  rationDescription: "kksfnaklsndfklasd fkajdsklfajsdklfjasdkfjaksdjfakljdalsjdkalsjdfksjdfsdkfasdfljadskfljadsklfjakldjfaklsdjfklajsdkljdkjsdkfjsdklfjdfalksdjfalksdjasdaksjfklasdjfklasjdlkajdsfkajsdflkjasdklfjaklsdjfalkjsdflajfkjdlfjl;fl"
}]

const MyProfileStyle = {
  Card: {
    width: "50vw",
    minWidth: "300px",

    marginTop: "3vh",
    marginBottom: "3vh",

    paddingTop: "10vh",
    paddingBottom: "15vh",
  },
  TextField: {
    width: "30vw",
    minWidth: "200px",
  },
  Avatar: {
    width: 200,
    height: 200,
    border: "4px black solid",
  },
  Chip: {
    border: "2px black solid",
    boxShadow: "4px 4px 1px grey",
    "& .MuiChip-icon": {
      color: "black",
    },
  },
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [targetUserData, setTargetUserData] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<Rating[]>([])

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function getTargetUserData() {
      if (!userStatus.user || !router.query.user_id || targetUserData) return;
      const userData = await GetUserByUserId(router.query.user_id as string, supabaseClient);
      setTargetUserData(userData);
    }

    getTargetUserData();

    // require some services for setting feedbacks
  }, [router.query.user_id, supabaseClient, userStatus.user, targetUserData]);

  function handleEditProfile(): void {
    router.push(PAGE_PATHS.EDIT_PROFILE);
    return;
  }

  function displayGenderIcon(gender: string) {
    if (gender === GENDER.MALE) {
      return <MaleIcon />;
    } else if (gender === GENDER.FEMALE) {
      return <FemaleIcon />;
    } else if (gender === GENDER.OTHERS) {
      return <TransgenderIcon />;
    } else if (gender === GENDER.PREFERS_NOT_TO_SAY) {
      return <FavoriteIcon />;
    } else {
      return <div></div>;
    }
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PAGE_PATHS.ADMIN_PROFILE + router.query.user_id);
    return;
  }
  if (!targetUserData) return <Loading />;
  if (targetUserData.isAdmin) {
    router.push(PAGE_PATHS.HOME + userStatus.user.userId);
    return;
  }
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Stack alignItems="center">
          <Card sx={MyProfileStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              <Typography variant="h1" align="center" sx={MyProfileStyle.TextField}>
                {targetUserData.username}
              </Typography>

              {router.query.user_id === userStatus.user.userId && (
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ ...MyProfileStyle.TextField, fontWeight: 500 }}
                >
                  {targetUserData.email}
                </Typography>
              )}

              <Avatar
                sx={MyProfileStyle.Avatar}
                alt="Profile picture"
                src={targetUserData.image as string}
              />

              <Stack spacing={1.5} alignItems="center" justifyContent="center">
                {targetUserData.isVerified && <VerifyChip />}
                <Chip
                  icon={displayGenderIcon(targetUserData.sex)}
                  label={targetUserData.sex}
                  sx={MyProfileStyle.Chip}
                />
                <Chip
                  icon={<CakeIcon />}
                  label={targetUserData.birthdate}
                  sx={MyProfileStyle.Chip}
                />
              </Stack>
              <Stack spacing={0}>
                {`" ${targetUserData.description} "`.split("\n").map((row, index) => (
                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: "30vw",
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                    key={index}
                  >
                    {row}
                  </Typography>
                ))}
              </Stack>
              {router.query.user_id === userStatus.user.userId && (
                <IconButton onClick={handleEditProfile}>
                  <EditIcon color="secondary" />
                </IconButton>
              )}
            </Stack>
          </Card>

          {/* Feedback */}
          <Card sx={{
            width: "50vw",
            minWidth: "300px",

            marginBottom: "2vh",
          }}>
            <CardContent style={{ paddingBottom: 0, }}>
              {/* header */}
              <Box display="flex" sx={{ alignItems: "center" }}>
                <Box sx={{ flexGlow: 1 }}>
                  <Typography variant="h2">Review</Typography>
                </Box>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ArrowDownwardIcon color="secondary" />
                </ExpandMore>
              </Box>

              <Collapse in={expanded} sx={{ marginTop: 2, marginBottom: 1 }}>
                <Stack spacing={2}>
                  {/* for actual feedbacks need to change mackRating to feedabcks */}
                  {mockRatings.map((rating: Rating, index) => (
                    <>
                      <Divider sx={{ height: "2px" }} color={COLOR_CODE.BLACK} />
                      <Stack
                        spacing={2}
                        alignItems="center"
                      >
                        {/* rating title */}
                        <Box display="flex">
                          <Typography variant="h3">{rating.ratingOwnerName}</Typography>
                          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{"\u00A0"}from{"\u00A0"}</Typography>
                          <Typography variant="h3">{rating.appointmentTitle}</Typography>
                        </Box>

                        {/* rating score */}
                        <Rating
                          defaultValue={rating.ratingScore}
                          size="large"
                          readOnly
                          icon={<StarIcon style={{ width: "40px", height: "40px" }} color="secondary"></StarIcon>}
                          emptyIcon={<StarOutlineIcon style={{ width: "40px", height: "40px" }} color="secondary"></StarOutlineIcon>}
                        />

                        {/* rating description */}
                        {rating.rationDescription !== "" &&
                          <Stack spacing={0}>
                            {`" ${rating.rationDescription} "`.split("\n").map((row, index) => (
                              <Typography
                                variant="body1"
                                sx={{
                                  maxWidth: "45vw",
                                  wordBreak: "break-word",
                                  textAlign: "center",
                                }}
                                key={index}
                              >
                                {row}
                              </Typography>
                            ))}
                          </Stack>
                        }
                      </Stack>
                    </>
                  ))}
                </Stack>
              </Collapse>
            </CardContent>
          </Card>
        </Stack>
      </Suspense>
    </>
  );
}
