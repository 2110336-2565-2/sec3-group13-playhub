import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState, useRef } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
const cancleDesign = {
  position: "absolute",
  top: 0,
  right: 0,
  cursor: "pointer",
  color: "red",
};
const addBoxDesign = {
  width: "200px",
  height: "200px",
  border: "2px dashed black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxshadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
};

const PictureList = () => {
  const [dataPics, setDataPics] = useState([]);

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
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
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

        <div style={addBoxDesign} onClick={handleClick}>
          <AddIcon style={{ width: "100px", height: "100px" }} />
        </div>
      </ImageList>

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
};

export default PictureList;
