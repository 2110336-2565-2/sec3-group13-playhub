import { User } from "@/types/User";
import { Avatar, Card, Chip, IconButton, Popover, Stack, Typography } from "@mui/material";
import { GENDER } from "enum/GENDER";
import { PAGE_PATHS } from "enum/PAGES";
import { useRouter } from "next/router";
import React, { useState } from "react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";
import VerifyChip from "@/components/profile/VerifyChip";
import { grey } from "@mui/material/colors";

type props = {
  participant: User;
};

const ParticipantStyle = {
  TextField: {
    width: "10vw",
    minWidth: "70px",
  },
  Chip: {
    "& .MuiChip-icon": {
      color: "black",
    },
  },
};

export default function Participant(props: props) {
  const router = useRouter();

  const [displayParticipantCard, setDisplayParticipantCard] = useState<HTMLElement | null>(null);

  function handleGoToParticipantProfile(): void {
    router.push(PAGE_PATHS.PROFILE + props.participant.userId);
    return;
  }

  function handleOpenParticipantCard(event: React.MouseEvent<HTMLElement>): void {
    setDisplayParticipantCard(event.currentTarget);
  }

  function handleCloseParticipantCard(): void {
    setDisplayParticipantCard(null);
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

  return (
    <>
      <IconButton
        sx={{ padding: 0 }}
        onClick={handleGoToParticipantProfile}
        onMouseEnter={handleOpenParticipantCard}
        onMouseLeave={handleCloseParticipantCard}
      >
        <Avatar
          sx={{ width: 50, height: 50, zIndex: "1", border: "3px #000000 solid", }}
          alt="Profile picture"
          src={props.participant.image as string}
        />
      </IconButton>

      <Popover
        sx={{
          pointerEvents: "none",
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
          },
        }}
        open={Boolean(displayParticipantCard)}
        anchorEl={displayParticipantCard}
        onClose={handleCloseParticipantCard}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Card
          style={{
            padding: "10px",
            width: "15vw",
            minWidth: "100px",
            boxShadow: "0px 0px 0px",
            borderColor: grey[400],
          }}
        >
          <Stack spacing={2} alignItems="center" justifyContent="center">
            {/* name */}
            <Typography variant="h2" align="center" sx={ParticipantStyle.TextField}>
              {props.participant.username}
            </Typography>

            <Stack spacing={1.5} alignItems="center" justifyContent="center">
              {/* image */}
              <Avatar
                sx={{ width: 150, height: 150, zIndex: "1" }}
                alt="Profile picture"
                src={props.participant.image as string}
              />

              {/* verify chip */}
              {props.participant.isVerified && <VerifyChip />}

              {/* gender chip */}
              <Chip
                icon={displayGenderIcon(props.participant.sex)}
                label={props.participant.sex}
                sx={ParticipantStyle.Chip}
              />

              {/* birthdate chip */}
              <Chip
                icon={<CakeIcon />}
                label={props.participant.birthdate}
                sx={ParticipantStyle.Chip}
              />
            </Stack>
            <Stack spacing={0}>
              {`" ${props.participant.description} "`.split("\n").map((row, index) => (
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
          </Stack>
        </Card>
      </Popover>
    </>
  );
}
