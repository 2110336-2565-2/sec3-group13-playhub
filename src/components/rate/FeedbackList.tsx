import { ReviewExtend } from "@/types/Review";
import { Box, Divider, Rating, Stack, Typography } from "@mui/material";
import { COLOR_CODE } from "enum/COLOR";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

type props = {
  feedbacks: ReviewExtend[];
};

export default function FeedBackList(props: props) {
  return (
    <>
      {props.feedbacks.length === 0 ? (
        <>
          <Divider sx={{ height: "2px" }} color={COLOR_CODE.BLACK} />
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ heught: "15vh", minHeight: "150px" }}
          >
            <Typography variant="h2">No Review Yet.</Typography>
          </Stack>
        </>
      ) : (
        <Stack spacing={2}>
          {/* for actual feedbacks need to change mackRating to feedabcks */}
          {props.feedbacks.map((rating: ReviewExtend, index) => (
            <>
              <Divider sx={{ height: "2px" }} color={COLOR_CODE.BLACK} />
              <Stack spacing={2} alignItems="center">
                {/* rating title */}
                <Box display="flex">
                  <Typography variant="h3">
                    {rating.isAnonymous ? "Anonymous" : rating.reviewerName}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    {"\u00A0"}from{"\u00A0"}
                  </Typography>
                  <Typography variant="h3">{rating.appointmentTitle}</Typography>
                </Box>

                {/* rating score */}
                <Rating
                  defaultValue={rating.score}
                  size="large"
                  readOnly
                  icon={
                    <StarIcon
                      style={{ width: "40px", height: "40px" }}
                      color="secondary"
                    ></StarIcon>
                  }
                  emptyIcon={
                    <StarOutlineIcon
                      style={{ width: "40px", height: "40px" }}
                      color="secondary"
                    ></StarOutlineIcon>
                  }
                />

                {/* rating description */}
                {rating.description !== "" && (
                  <Stack spacing={0}>
                    {`" ${rating.description} "`.split("\n").map((row, index) => (
                      <Typography
                        variant="body1"
                        sx={{
                          maxWidth: "45vw",
                          wordBreak: "break-word",
                          textAlign: "center",
                        }}
                        key={index}
                      >
                        {row}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Stack>
            </>
          ))}
        </Stack>
      )}
    </>
  );
}
