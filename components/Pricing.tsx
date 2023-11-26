import config from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section className="bg-base-200 overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">Pricing</p>
          <h2 className="font-bold text-2xl lg:text-5xl text-transparent gradient-text animate-gradient">
            Raise, Save, and be Compliant 
          </h2>
          <h2 className="font-bold text-2xl lg:text-5xl mt-6">😄</h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <Card key={plan.priceId} className="relative w-full max-w-lg">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    POPULAR
                  </h3>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent>
                {/* Price and Discount Section */}
                <div className="flex gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[4px] text-lg ">
                      <p className="relative">
                        <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                        <del className="text-base-content/80">
                          ${plan.priceAnchor}
                        </del>
                      </p>
                    </div>
                  )}
                  <p className={`text-5xl tracking-tight font-extrabold`}>
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">
                      USD
                    </p>
                  </div>
                </div>


                {plan.features && (
                  <ul className="space-y-2.5 leading-relaxed text-base">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-[18px] h-[18px] opacity-80 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span>{feature.name} </span>
                      </li>
                    ))}
                  </ul>
                )}
                </CardContent>

                <CardFooter>
                <ButtonCheckout
                  mode="subscription"
                  priceId={config.stripe.plans[0].priceId}
                />
                </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
