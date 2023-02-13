import React from "react";
import {
  Typography,
  Avatar,
  Box,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grow,
  Button,
  IconButton,
  Grid,
  Stack,
  Chip,
  Snackbar,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";

import { Post } from "../../types/Post";
import { NextRouter, useRouter } from "next/router";
import { PagePaths } from "enum/pages";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type props = {
  post: Post;
};

export default function PostCard(props: props) {
  const router: NextRouter = useRouter();
  const [hiddenPostDetail, setHiddenPostDetail] = React.useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = React.useState<boolean>(false);
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

  return (
    <>
      <Card
        sx={{
          border: "solid 4px",
          borderRadius: "16px",
          minWidth: "260px",
          maxWidth: "1200px",
          margin: "40px",
        }}
      >
        {/* Post Card Header */}
        <CardHeader
          avatar={
            <IconButton
              onClick={() => {
                router.push(PagePaths.profile + props.post.ownerName);
              }}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                alt="Profile picture"
                src={props.post.ownerProfilePic}
              />
            </IconButton>
          }
          title={props.post.title}
          subheader={props.post.ownerName}
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}>
          {/* post preview details start here */}
          <Stack direction={!hiddenPostDetail ? "row" : "column"} spacing={2} marginBottom={2}>
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.post.location}</span>
            </Typography>
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.post.time}</span>
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {props.post.tags.map((e) => (
              <Grid item>
                <Chip
                  label={e}
                  variant="outlined"
                  style={{
                    minWidth: 100,
                    height: 40,
                    border: "1px solid gray",
                    fontSize: 18,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* post preview details end here */}
          <Collapse in={!hiddenPostDetail} sx={{ marginTop: 2, marginBottom: 1 }}>
            {/* post hidden details start here */}
            {props.post.description.split("\n").map((row) => (
              <Typography key={row}>{row}</Typography>
            ))}
            <Grid container spacing={2}>
              {props.post.image.map((e) => (
                <Grid item>
                  <Image src={e} alt="location" width={300} height={350} />
                </Grid>
              ))}
            </Grid>
            {/* post hidden details end here */}
          </Collapse>
        </CardContent>

        {/* Post Card Footer */}
        <CardActions style={{ padding: "4px 8px" }}>
          <Box sx={{ flexGrow: 1 }}></Box>

          {/* <Grow in={!hiddenPostDetail} style={{ transformOrigin: "0 0 0" }}>
            <Button onClick={() => setOpenSnackBar(true)} variant="contained">
              Join
            </Button>
          </Grow> */}

          <ExpandMore expand={!hiddenPostDetail} onClick={handleExpandDetail}>
            <ArrowDownwardIcon />
          </ExpandMore>
        </CardActions>
      </Card>

      {/* Comfirm Delete Dialog */}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        message="ได้เวลาสนุกแล้วสิ"
        onClose={() => setOpenSnackBar(false)}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        message="ได้เวลาสนุกแล้วสิ"
        onClose={() => setOpenSnackBar(false)}
      />
    </>
  );
}
