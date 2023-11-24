import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ButtonCheckout from "./ButtonCheckout";
import { Button } from "./ui/button";
import ButtonSignin from "./ButtonSignin";

const CTA = () => {
  return (
    <section className="relative hero overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-[-1]">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="rounded-md object-cover"
            layout="fill"
          />
        </AspectRatio>
      </div>
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 invert">
            Use AI and Learn dynamically
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6 invert">
            Don&apos;t hurt your education with only using
            old ways of learning...
          </p>

          <ButtonSignin/>
        </div>
      </div>
    </section>
  );
};

export default CTA;
