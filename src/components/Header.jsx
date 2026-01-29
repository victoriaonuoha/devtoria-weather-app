import { ReactTyped } from "react-typed";
export default function Header() {
  return (
    <div className="fixed top-3 lg:left-20 left-3 w-full z-50 ">
      <h1 className="text-3xl font-extrabold text-white md:text-4xl">Weather Forcast 🌤️</h1>
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
