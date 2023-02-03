import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import CakeIcon from "@mui/icons-material/Cake";

import { User } from "@/types/User";
import Navbar from "@/components/public/Navbar";
import PostCard from "@/components/post/PostCard";

// mocked user information
const tmpUser: User = {
  name: "Chanathip sombuthong",
  sex: "Male",
  brithdate: "26/4/2002",
  description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
  image: "/images/aom.jpg",
  email: "aom@gmail.com",
};
const owner: boolean = true;
const avatar = { width: 200, height: 200 };

export default function Home() {
  return (
    <>
      <Navbar />
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh" }}
      >
        <Grid item>
            <Typography variant="h1" sx={{m:1}}>{tmpUser.name}</Typography>
            {owner && <Typography variant="body1" sx={{m:1,textAlign:"center"}}>
              {tmpUser.email}</Typography> 
            }
        </Grid>
        <Grid item>
          <Avatar sx={avatar} alt="Profile picture" src={tmpUser.image} />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={1}>
            <Grid item>
              <Chip icon={<MaleIcon />} label={tmpUser.sex} />
            </Grid>
            <Grid item>
              <Chip icon={<CakeIcon />} label={tmpUser.brithdate} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="body1">{tmpUser.description}</Typography>
        </Grid>
        {owner &&
          <Grid item>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Grid>
        }
        <Grid item>
          <PostCard />
        </Grid>
      </Grid>
    </>
  );
}
