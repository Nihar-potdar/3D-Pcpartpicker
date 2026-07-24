import Card from "@/components/ui organized/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LineByLineSlide from "@/components/smoothui/line-by-line-slide/index";
import PixelSnow from "@/components/ui/PixelSnow";
import LineSidebar from "@/components/ui/LineSidebar";

const MotionButton = motion.create(Button);
const MotionCard = motion.create(Card);

export default function Home() {
  return (
    <>
      <div className="relative z-50 flex flex-col items-center justify-center h-dvh w-dvw">
        <div className="fixed top-0 flex items-center gap-8 justify-center h-12 bg-black/40 w-dvw  rgba(20,20,20,.65 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,.45)] border border-white/10 rounded-full">
          <input
            placeholder="search components"
            className="flex items-center justify-center w-1/4 p-2 outline-none border-box rounded-xl bg-input"
          />
        </div>
        <div className="absolute -translate-y-1/2 left-[64px] top-1/2 space-y-8">
          <LineSidebar
            items={["Home", "Components", "Compare", "Showcase"]}
            accentColor="#EF4444"
            textColor="#c4c4c4"
            markerColor="#6c6c6c"
            showIndex = {false}
            showMarker = {true}
            proximityRadius={100}
            maxShift={30}
            falloff="smooth"
            markerLength={60}
            markerGap={0}
            tickScale={0.5}
            scaleTick
            itemGap={31}
            fontSize={2}
            smoothing={100}
            defaultActive={0}
            onItemClick={(index, label) => console.log(index, label)}
          />
        </div>
        <PixelSnow
          className="absolute w-dvw h-dvh z-[-1]"
          color="#ebdbdb"
          flakeSize={0.01}
          minFlakeSize={0.5}
          pixelResolution={530}
          speed={1.25}
          density={0.1}
          direction={125}
          brightness={2}
          depthFade={11}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
        <LineByLineSlide className="font-bold text-7xl font-Inter text-50 font-headline">
          {" Build Your Dream PC in 3D"}
        </LineByLineSlide>
        <LineByLineSlide
          className="flex flex-wrap items-center justify-center max-w-xl p-6 font-serif text-2xl font-light text-center rounded-full text-muted-foreground font-Inter text-50"
          delay={400}
          lines={[
            "Select components",
            "watch your build come together in real time",
            "check compatibility instantly",
            "and compare performance before you buy",
          ]}
        />
        <div className="absolute bottom-0 w-full h-48 bg-linear-to-b from-transparent via-orange-500/5 to-transparent" />


        <div className="flex *:m-2 cursor-pointer">
          <MotionButton size="2xl" variant="secondary" className="rounded-full bg-accent text-secondary hover:bg-accent/80 ">
            Create your own Build
          </MotionButton>
          <Button size="2xl" className="rounded-full bg-accent-foreground text-primary hover:bg-accent-foreground/80">
            Explore Builds
          </Button>
        </div>
        <h2 className="p-3 mt-32 text-3xl font-semibold rounded-xl border-border text-50">
        <span className="text-accent">●</span> Popular Builds
        </h2>
        <div className="flex items-center justify-center gap-8 p-6 mt-2 overflow-hidden rounded-xl  transition-all duration-300 ease-in-out *:aspect-4/3 cursor-pointer *:hover:scale-[1.02]  drop-shadow-[0_30px_80px_rgba(255,120,0,.35)]">
          <MotionCard text="Budget Build" image="/lowerendpc.png" />
          <MotionCard text="Mid-tier Build" image="/gamingpc.png" />
          <MotionCard text="High-end Build" image="/gamingpc.png" />
        </div>
        <div className=" bg-[radial-gradient(circle,rgba(255,132,43,1)_0%,rgba(0,0,0,1)_100%)] w-[700px] h-[700px] bottom-0 blur-[900px] opacity-25% pointer-events-none rounded-full absolute -z-1"></div>
      </div>
    </>
  );
}
