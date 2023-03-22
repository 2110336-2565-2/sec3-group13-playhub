import { ImageList, ImageListItem, Stack } from "@mui/material";
import Image from "next/image";

type props = {
  images: string[];
};

export default function DisplayImages(props: props) {
  return (
    <>
      <ImageList
        sx={{
          width: "29vw",
          height: `calc(10vw* (${props.images.length}+2)/3))`,
          minWidth: "410px",
          minHeight: `calc(270px/2* (${props.images.length}+2)/3))`,
          alignContent: "start",
        }}
        variant="woven"
        cols={3}
        gap={5}
      >
        {props.images.map((image, index) => {
          return (
            <>
              <Stack justifySelf="start">
                <ImageListItem
                  key={index}
                  sx={{
                    width: "9vw",
                    minWidth: "120px",
                    height: "9vw",
                    minHeight: "120px",
                  }}
                  style={{ marginTop: "10px" }}
                  cols={1}
                >
                  <Image alt="Post_Image" src={image} style={{ objectFit: "contain" }} />
                </ImageListItem>
              </Stack>
            </>
          );
        })}
      </ImageList>
    </>
  );
}
