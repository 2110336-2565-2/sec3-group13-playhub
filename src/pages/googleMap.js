import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/googleMap/Header";
import List from "@/components/googleMap/List";
import Map from "@/components/googleMap/Map";
import { getPlacesData } from "./api/mapApi";
const Home = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);
  const [type, setType] = useState("restaurants");
  const [ratings, setRatings] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // get the users current location on intial login

    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      console.log({ latitude, longitude });
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    const filteredData = places.filter((place) => place.rating > ratings);
    setFilteredPlaces(filteredData);
    console.log({ ratings });
  }, [ratings]);

  useEffect(() => {
    setIsLoading(true);
    getPlacesData(type, bounds?.sw, bounds?.ne).then((data) => {
      console.log(data);
      setPlaces(data);
      setIsLoading(false);
    });
  }, [type, coordinates, bounds]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      maxWidth={"100vw"}
      maxHeight={"100vh"}
      position={"relative"}
    >
      <Head>
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=Your_API_KEY"></script>
      </Head>

      <Header setType={setType} setRatings={setRatings} setCoordinates={setCoordinates} />

      <List places={filteredPlaces.length ? filteredPlaces : places} isLoading={isLoading} />

      <Map
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        setBounds={setBounds}
        places={filteredPlaces.length ? filteredPlaces : places}
      />
    </Flex>
  );
};

export default Home;
