import { Card, CardMedia } from "@mui/material";

type props = {
    src: string
}

export default function AdvertiseCard({ ...props }: props) {
    return (
        <Card
            sx={{
                aspectRatio: "970 / 250",
                width: "100%",
                boxShadow: "0px 0px 0px",
                margin: "0 auto"
            }}>
            <CardMedia
                sx={{ height: "100%", width: "100%" }}
                image={props.src}
                title="poster file"
            />
        </Card>
    )

}