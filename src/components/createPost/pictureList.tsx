import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const itemPics = [
  {
    src: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    src: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    src: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
];

const cancleDesign = {
  position: "absolute",
  top: 0,
  right: 0,
  cursor: "pointer",
  color: "red",
};

const PictureList = () => {
  const [dataPics, setDataPics] = useState([]);
  const box_style = {
    width: "200px",
    height: "200px",
    background: "#FFFFFF",
    border: "1px dashed #000000",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    boxSizing: "border-box",
    margin: "auto",
  };

  const addlogo_style = {
    width: "100px",
    height: " 100px",
    margin: "auto",
  }; //using for addpicture

  const deletePicture = (index) => {
    setDataPics((prevPics) => prevPics.filter((pic, i) => i !== index));
  };

  const handleAddPicture = (e) => {
    const selectedFiles = e.target.files;
    const selfilesarr = Array.from(selectedFiles);

    const imgArr = selfilesarr.map((file) => {
      return URL.createObjectURL(file);
    });
    setDataPics((prevImg) => prevImg.concat(imgArr));
  };

  return (
    <>
      <ImageList cols={4} rowHeight={200}>
        {dataPics.map((image, index) => (
          <ImageListItem key={index}>
            <CancelIcon sx={cancleDesign} onClick={() => deletePicture(index)}>
              {" "}
            </CancelIcon>
            <img
              src={`${image}`}
              loading="lazy"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Button variant="contained" component="label">
        Upload
        <input hidden type="file" multiple accept="image/*" onChange={handleAddPicture} />
      </Button>
    </>
  );
};

export default PictureList;
