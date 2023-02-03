import Image from "next/image"

export default function Logo({...props}){
    return (
        <Image 
            src="/images/logo.png" 
            alt="Logo" 
            width={props.width} 
            height={props.height}
        />)
}