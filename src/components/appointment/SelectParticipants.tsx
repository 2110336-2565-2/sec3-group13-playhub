import { User } from "@/types/User";
import { Box, FormHelperText, Grid, IconButton, Menu, Stack, Typography } from "@mui/material";
import Participant from "../post/Participant";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import ParticipantMenuItem from "./ParticipantMenuItem";
import { COLOR_CODE } from "enum/COLOR";
import CloseIcon from "@mui/icons-material/Close";

type props = {
  header?: string;
  availableParticipants: User[] | null;
  selectedParticipants: User[];
  handleAddParticipant: (participant: User) => void;
  handleDeleteParticipant: (participant: User) => void;
  participantCountError: boolean;
};

export default function SelectParticipants(props: props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {}, [props.availableParticipants, props.selectedParticipants]);

  const addParticipantBorderStyle: string = props.participantCountError
    ? COLOR_CODE.ERROR
    : COLOR_CODE.BLACK;

  return (
    <>
      <Stack spacing={0.5} alignItems="start" justifyContent="center">
        <Typography variant="h3">{props?.header}</Typography>
        <Box display="flex">
          {props.availableParticipants &&
            props.availableParticipants.length + props.selectedParticipants.length == 0 && (
              <Typography variant="body1" color="error">
                No one is interested in this activity yet.
              </Typography>
            )}
        </Box>
        <Grid container spacing={1} style={{ marginLeft: -5 }}>
          {props.selectedParticipants?.map((participant: User, index) => (
            <Grid item key={index} style={{ height: "64px", width: "70px" }}>
              <Participant participant={participant} />
              <IconButton
                onClick={() => props.handleDeleteParticipant(participant)}
                color="secondary"
                style={{
                  padding: 0,
                  backgroundColor: "black",
                  position: "relative",
                  top: "-57px",
                  left: "40px",
                  zIndex: "1",
                }}
              >
                <CloseIcon color="primary" fontSize="medium" />
              </IconButton>
            </Grid>
          ))}

          {/* Add button */}
          {props.availableParticipants && props.availableParticipants.length != 0 && (
            <Grid item key={props.availableParticipants.length + 1}>
              <IconButton
                onClick={handleOpenMenu}
                style={{ border: "2px dashed", borderColor: addParticipantBorderStyle }}
              >
                <AddIcon
                  color={props.participantCountError ? "error" : "secondary"}
                  fontSize="large"
                />
              </IconButton>
            </Grid>
          )}
        </Grid>
        <FormHelperText error>
          {props.participantCountError && "Select at least 1 participant"}
          {"\u00A0"}
        </FormHelperText>
      </Stack>

      {/* Participants list */}
      <Menu
        sx={{ alignContent: "center", maxHeight: "300px" }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {props.availableParticipants?.map((user, index) => (
          <ParticipantMenuItem
            key={index}
            index={index}
            participant={user}
            onClick={() => {
              props.handleAddParticipant(user);
              handleCloseMenu();
            }}
          />
        ))}
      </Menu>
    </>
  );
}
