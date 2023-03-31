import { Card, CardMedia } from "@mui/material";

type props = {
    src: string
}

export default function AdvertiseCard({ ...props }: props) {
    return (
        <Card
            sx={{
                width: "970px",
                height: "250px",
                maxWidth: "100%",
                boxShadow: "0px 0px 0px",
                margin: "50px auto 0 auto"
            }}>
            <CardMedia
                sx={{ height: "100%", width: "100%" }}
                image={props.src}
                title="poster file"
            />
        </Card>
    )

}