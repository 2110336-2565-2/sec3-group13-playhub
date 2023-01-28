import Navbar from "@/components/Navbar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import CakeIcon from "@mui/icons-material/Cake";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

type User = {
  name: string;
  sex: string;
  brithdate: string;
  description: string;
  image: string;
};

export default function Home() {
  const tmpUser: User = {
    name: "Chanathip sombuthong",
    sex: "Male",
    brithdate: "26/4/2002",
    description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
    image: "/images/aom.jpg",
  };

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
          <Typography variant="h4">{tmpUser.name}</Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{ width: 200, height: 200 }}
            alt="Anya"
            src={tmpUser.image}
          />
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
        <Grid item sx={{ width: "20vw", minWidth: "260px" }}>
          <Divider />
        </Grid>
        <Grid item>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}
