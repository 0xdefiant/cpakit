import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ButtonSignin from "./ButtonSignin";

const CTA = () => {
  return (
    <section className="relative flex justify-center items-center overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-[-1]">
        <AspectRatio ratio={16 / 9} className="w-full h-full">
        //
        </AspectRatio>
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
