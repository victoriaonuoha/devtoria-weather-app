import { CloudSun, Sun, CloudRain, Wind } from "lucide-react";
import { ReactTyped } from "react-typed";
export default function Header() {
  return (
    <div className=" pt-3 lg:px-20 px-3 w-full z-50  ">
      <span className="text-3xl font-extrabold text-white md:text-4xl flex items-center justify-between">
        Weather Forcast
        <span>
          <CloudSun size={48} color="orange" />
        </span>
      </span>
      <h1 className="text-[20px] font-bold text-white text-center pt-4 md:text-4xl">
        <ReactTyped
          strings={["How's the weather today?", "Check the weather anywhere!"]}
          typeSpeed={100}
          backSpeed={60}
          showCursor={false}
          loop
        />
      </h1>
    </div>
  );
}
