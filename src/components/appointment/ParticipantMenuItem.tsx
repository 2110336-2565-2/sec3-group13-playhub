import { User } from "@/types/User";
import { Avatar, Card, Chip, Icon, MenuItem, Popover, Stack, Typography } from "@mui/material";
import { GENDER } from "enum/GENDER";
import React, { useState } from "react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";
import VerifiedIcon from "@mui/icons-material/Verified";
import { grey } from "@mui/material/colors";
import { COLOR_CODE } from "enum/COLOR";

type props = {
  index?: number;
  participant: User;
  onClick: () => void;
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

export default function ParticipantMenuItem(props: props) {
  const [displayParticipantCard, setDisplayParticipantCard] = useState<HTMLElement | null>(null);

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
      <MenuItem
        key={props.index}
        onMouseEnter={handleOpenParticipantCard}
        onMouseLeave={handleCloseParticipantCard}
        onClick={() => {
          handleCloseParticipantCard();
          props.onClick();
        }}
      >
        <Typography variant="body1">{props.participant.username}</Typography>
      </MenuItem>

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
          horizontal: "right",
        }}
        transformOrigin={{
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
            <Stack spacing={1} direction="row" alignItems="center" justifyContent="center">
              {props.participant.isVerified && (
                <Icon style={{ height: "35px", width: "35px", borderRadius: "100px" }}></Icon>
              )}

              {/* name */}
              <Typography
                variant="h2"
                align="center"
                sx={{
                  width: "10vw",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {props.participant.username}
              </Typography>

              {/* verify chip */}
              {props.participant.isVerified && (
                <Icon
                  sx={{ bgcolor: COLOR_CODE.PRIMARY }}
                  style={{ height: "35px", width: "35px", borderRadius: "100px" }}
                >
                  <VerifiedIcon color="secondary" fontSize="small" />
                </Icon>
              )}
            </Stack>

            <Stack spacing={1.5} alignItems="center" justifyContent="center">
              {/* image */}
              <Avatar
                sx={{ width: 150, height: 150, zIndex: "1" }}
                alt="Profile picture"
                src={props.participant.image as string}
              />

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
              {props.participant.description.split("\n").map((row, index) => (
                <Typography
                  variant="body1"
                  sx={{
                    ...ParticipantStyle.TextField,
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
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
