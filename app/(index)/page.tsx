import ReviewList from "../purfect/section-eight";
import SectionFive from "../purfect/section-five";
import SectionFour from "../purfect/section-four";
import SectionOne from "../purfect/section-one";
import SectionSeven from "../purfect/section-seven";
import SectionSix from "../purfect/section-six";
import SectionThree from "../purfect/section-three";
import SectionTwo from "../purfect/section-two";

export default function Home() {
  return (
    <div className="bg-white ">
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
      <ReviewList />
    </div>
  );
}
