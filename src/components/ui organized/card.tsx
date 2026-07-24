import SpotlightCard from "@/components/ui/SpotlightCard";
import Image from "next/image";
import { motion } from "framer-motion";

type CardProps = {
  text?: string;
  image?: string;
  size?: string;
};

const MotionImage = motion.create(SpotlightCard);

export default function Card({text, image, size}: CardProps) {
  return (
    <MotionImage
      spotlightColor="rgba(249, 115, 22, 0.6)"
      className="relative flex flex-col items-center justify-center gap-4 transition-all duration-300 ease-in-out shadow-lg rounded-xl custom-spotlight-card w-120 h-120 bg-card"
    >
      <Image className="object-fill" src={image || "/gamingpc.png"} alt="Gaming PC" width={420} height={520}  />
      <h1>{text || "Gaming Pc"}</h1>
    </MotionImage>
  );
}
