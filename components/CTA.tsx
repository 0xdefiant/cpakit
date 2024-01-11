import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ButtonSignin from "./ButtonSignin";

const CTA = () => {
  return (
    <section className="relative flex justify-center items-center overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-[-1]">
          <Image
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="rounded-md object-cover"
            layout="fill"
          />
      </div>
      <div className="relative z-10 p-8">
        <h2 className="font-bold text-2xl lg:text-4xl text-transparent gradient-text animate-gradient mb-8">
          Use AI and Learn dynamically
        </h2>
        <ButtonSignin />
      </div>
    </section>
  );
};

export default CTA;
