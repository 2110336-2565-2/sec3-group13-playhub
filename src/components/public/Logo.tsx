import Image from "next/image";

type props = {
  width: number;
  height: number;
  bgColor?: "trans" | "white";
};

Logo.defaultProps = {
  width: 200,
  height: 200,
  bgColor: "white",
};

export default function Logo(props: props) {
  return (
    <Image
      src={`/images/logo_bg_${props.bgColor}.png`}
      alt="Logo"
      width={props.width}
      height={props.height}
    />
  );
}
