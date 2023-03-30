export default function AdvertiseCard({ ...props }) {
    return (
        <img width={"100%"} src={props.src} style={{ marginTop: "50px", borderRadius: "16px" }} />
    )
}