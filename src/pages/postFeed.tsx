import PostCard from "@/components/post/PostCard";
import Navbar from "@/components/public/Navbar";
import { Post } from "@/types/Post";
import { alignProperty } from "@mui/material/styles/cssUtils";
import Typography from "@mui/material/Typography";

const mockPosts: Post[] = [
  {
    title: "ชวนไปดูแงว",
    ownerName: "น้องออม",
    ownerProfilePic: "/images/aom.jpg",
    tags: ["A", "B"],
    description: "ฟกกฟหกฟหกฟกฟกฟกหปฉผกอหก\nฟหกฟก่ฟสรกฟสกร่ฟก\nadadad",
    image: ["/images/avatar.png", "/images/avatar.png", "/images/aom.jpg"],
    location: "หอใน",
    time: "2/4/2023",
    // there are more data but omitted for now
  },
  {
    title: "ชวนไปดูแงว",
    ownerName: "น้องออม",
    ownerProfilePic: "/images/aom.jpg",
    tags: ["A", "B"],
    description: "ฟกกฟหกฟหกฟกฟกฟกหปฉผกอหก\nฟหกฟก่ฟสรกฟสกร่ฟก\nadadad",
    image: ["/images/avatar.png", "/images/avatar.png", "/images/aom.jpg"],
    location: "หอใน",
    time: "2/4/2023",
    // there are more data but omitted for now
  },
  {
    title: "ชวนไปดูแงว",
    ownerName: "น้องออม",
    ownerProfilePic: "/images/aom.jpg",
    tags: ["A", "B"],
    description: "ฟกกฟหกฟหกฟกฟกฟกหปฉผกอหก\nฟหกฟก่ฟสรกฟสกร่ฟก\nadadad",
    image: ["/images/avatar.png", "/images/avatar.png", "/images/aom.jpg"],
    location: "หอใน",
    time: "2/4/2023",
    // there are more data but omitted for now
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column" }}>
        <Typography variant="h1" sx={{ marginTop: "30px" }}>
          My post
        </Typography>
        {mockPosts.map((item, index) => (
          <PostCard key={index} {...item} />
        ))}
      </div>
    </>
  );
}
