import { useState, useRef, useEffect } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { Box, Container, FormHelperText, IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { IMAGE_LIMIT } from "enum/INPUT_LIMIT";

// style
const image_layout = {
  width: "10vw",
  minWidth: "140px",
  height: "10vw",
  minHeight: "140px",
};

const addIcon_layout = {
  width: "6vw",
  minWidth: "90px",
  height: "6vw",
  minHeight: "90px",
};

// type
type props = {
  header?: string;
  note?: string;
  imgs: string[];
  stateChanger: (images: string[]) => void;
  isErr: boolean;
  errMsg: string;
};

export default function PictureList(props: props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setImages(props.imgs);
  }, [props.imgs]);

  const deletePicture = (index: number) => {
    setImages((prevPics) => prevPics.filter((pic, i) => i !== index));
    props.stateChanger(images.filter((pic, i) => i !== index));
    // props.st(false);
  };

  const handleAddPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files;
      console.log(URL.createObjectURL(selectedFiles[0]));
      const selfilesarr = Array.from(selectedFiles).filter((file) =>
        file.type.startsWith("image/")
      );

      if (selfilesarr.length + images.length > 3) {
        //alert("more than 3");
        // props.st(true);
        return;
      }

      const imgArr = selfilesarr.map((file) => {
        return URL.createObjectURL(file);
      });
      setImages((prevImg) => prevImg.concat(imgArr));
      props.stateChanger(images.concat(imgArr));
      // props.st(false);
    }
  };

  const handleClick = () => {
    if (!fileInputRef || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <>
      <Box display="flex">
        <Typography variant="body1">
          {props.header}
          {"\u00A0"}
        </Typography>
        <Typography variant="body1" sx={{ color: grey[500] }}>
          {props.note}
        </Typography>
      </Box>

      <Container disableGutters>
        <ImageList variant="woven" cols={Math.min(3, images.length + 2)} gap={10}>
          {images.map((image, index) => {
            // const imageErr :validation = validateImage(image.type, image.size);
            return (
              <>
                <Stack>
                  <Box key={index} sx={image_layout}>
                    <ImageListItem cols={1}>
                      <IconButton
                        color="error"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: 0,
                        }}
                        onClick={() => deletePicture(index)}
                      >
                        <CancelIcon />
                      </IconButton>
                      <img alt="Post_Image" src={image} style={{ objectFit: "contain" }} />
                    </ImageListItem>
                  </Box>
                  {false && <FormHelperText error>{props.errMsg}</FormHelperText>}
                </Stack>
              </>
            );
          })}
          {images.length < IMAGE_LIMIT.MAX_IMAGE && (
            <Box key={4} sx={image_layout}>
              <ImageListItem cols={1}>
                <IconButton
                  color="secondary"
                  sx={{
                    borderRadius: 0,
                    border: "2px dashed black",
                    ...image_layout,
                  }}
                  onClick={handleClick}
                >
                  <AddIcon style={addIcon_layout} />
                </IconButton>
              </ImageListItem>
            </Box>
          )}
        </ImageList>
      </Container>

      {false && <FormHelperText error>{props.errMsg}</FormHelperText>}
      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple
        accept="image/*"
        onChange={handleAddPicture}
      />
    </>
  );
}
