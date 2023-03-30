import { Suspense, useCallback, useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import {
  Avatar,
  IconButton,
  Chip,
  Typography,
  Stack,
  Card,
  IconButtonProps,
  styled,
  CardHeader,
  Rating,
  CardContent,
  Box,
  Collapse,
  Divider,
  useScrollTrigger,
  Fab,
  Zoom,
} from "@mui/material";
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
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { COLOR_CODE } from "enum/COLOR";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { ReviewExtend } from "@/types/Review";
import { GetReviewsByRevieweeId } from "@/services/Review";
import FeedBackList from "@/components/rate/FeedbackList";

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
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [targetUserData, setTargetUserData] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<ReviewExtend[]>([]);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const trigger = useScrollTrigger({ threshold: 100 });
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    async function getTargetUserData() {
      if (!userStatus.user || !router.query.user_id || targetUserData) return;
      const userData = await GetUserByUserId(router.query.user_id as string, supabaseClient);
      setTargetUserData(userData);
    }
    getTargetUserData();

    if (router.query.user_id) {
      GetReviewsByRevieweeId(supabaseClient, router.query.user_id as string).then((reviews) =>
        setFeedbacks(reviews)
      );
    }
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
          <Card
            sx={{
              width: "50vw",
              minWidth: "300px",

              marginBottom: "2vh",
            }}
          >
            <CardContent style={{ paddingBottom: 0 }}>
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
                <FeedBackList feedbacks={feedbacks} />
              </Collapse>
            </CardContent>
          </Card>
        </Stack>

        {/* scroll to top button */}
        <Zoom in={trigger}>
          <Fab
            onClick={scrollToTop}
            color="primary"
            sx={{
              position: "fixed",
              right: "20px",
              bottom: "20px",
              borderRadius: "15px",
              border: "3px #000000 solid",
            }}
          >
            <ArrowUpwardIcon fontSize="large" />
          </Fab>
        </Zoom>
      </Suspense>
    </>
  );
}
