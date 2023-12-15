import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";
import ButtonLead from "./ButtonLead";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          ai acc agent
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
        CPA Kit arms you with cutting-edge tools to hone expertise,
        conquer exams, and uncover new insights in mere minutes - no matter your starting point.
        </p>
        <ButtonLead />
      </div>

      <div className="lg:w-full">
        <Image
          src="https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Product Demo"
          className="w-full rounded-md"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
