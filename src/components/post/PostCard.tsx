import Typography from "@mui/material/Typography";
import DeletePostButton from "@/components/post/DeletePostButton";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import React from "react";
import CommonButton from "@/components/public/CommonButton";
import Grow from "@mui/material/Grow";

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

export default function PostCard() {
  const [hidden, setHidden] = React.useState(true);

  return (
    <>
      <Card
        sx={{
          border: "solid 4px",
          width: "80vw",
          minWidth: "260px",
          borderRadius: "16px",
        }}
      >
        <CardHeader
          avatar={<Avatar alt="Anya" src="/images/aom.jpg" />}
          title="ชวนไปดูแงว"
          subheader="น้องออม"
          action={<DeletePostButton />}
        />
        <CardContent>
          <Typography>location</Typography>
          <Typography>time</Typography>
          <Collapse in={!hidden}>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
          </Collapse>
        </CardContent>
        <CardActions>
          <Box sx={{ flexGrow: 1 }}></Box>
          
            <Grow in={!hidden} style={{ transformOrigin: "0 0 0" }}>
              <Box>
              <CommonButton label="Join" />
              </Box>
            </Grow>
          
          <ExpandMore expand={!hidden} onClick={() => setHidden(!hidden)}>
            <ArrowDownwardIcon />
          </ExpandMore>
        </CardActions>
      </Card>
    </>
  );
}
