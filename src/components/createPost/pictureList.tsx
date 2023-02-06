import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const itemPics = [
    {
      src: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      src: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    }
  ];

const PictureList = () => {
  return (
    <ImageList  cols={4} rowHeight={200}>
      {itemPics.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.src}?w=200&h=200&fit=crop&auto=format`}
            srcSet={`${item.src}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default PictureList;