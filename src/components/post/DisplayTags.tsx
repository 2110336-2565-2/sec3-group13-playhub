import { Tag } from "@/types/Tag";
import { Chip, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

type props = {
  tags: string[];
};

export default function DisplayTags(props: props) {
  return (
    <>
      <Grid container spacing={1}>
        {props.tags.map((tag, index) => (
          <Grid item key={index}>
            <Chip
              label={
                <>
                  <Typography variant="body1" color="primary">
                    {tag}
                  </Typography>
                </>
              }
              variant="outlined"
              style={{
                padding: "5px 0px 5px 0px",
                border: "3px solid lightgrey",
                borderRadius: "4px",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
