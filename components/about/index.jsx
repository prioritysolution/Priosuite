import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const About = () => {
  return (
    <div className="w-full h-full flex justify-center items-center p-1 bg-[#fefefe] rounded-lg relative">
      {/* Background Image with Absolute Positioning */}
      <div className="w-full h-full absolute flex justify-center items-center">
        <Image
          src="/prioritySolutionLogo.png"
          width={100}
          height={100}
          alt="Logo"
          className="h-full w-full object-contain opacity-10"
          style={{
            aspectRatio: "1 / 1", // Maintain 1:1 aspect ratio
          }}
        />
      </div>

      <div className="relative h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden z-10">
        <h3 className="text-3xl font-semibold">About Us</h3>

        <ScrollArea className="w-full h-full">
          <div className="w-full h-full px-2 lg:px-10 xl:px-20 flex flex-col gap-10">
            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                PrioSuite : Empowering Cooperative Banking
              </h4>
              <p>
                PrioSuite is a comprehensive co-operative banking software
                designed to streamline operations, enhance member engagement,
                and optimize financial management. Built with a user-friendly
                interface and advanced technology, PrioSuite offers a robust
                suite of core banking features tailored specifically for
                co-operative banks.
              </p>
            </div>

            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                Key Features
              </h4>
              <div className="text-start flex flex-col gap-3">
                <p>
                  <span className="text-lg font-semibold">
                    Core Banking Functionality :
                  </span>{" "}
                  Manage accounts, loans, deposits, and transactions seamlessly
                  with our integrated core banking system.
                </p>
                <p>
                  <span className="text-lg font-semibold">
                    Member Management :
                  </span>{" "}
                  Enhance member relationships with tools for tracking
                  interactions, preferences, and financial history.
                </p>
                <p>
                  <span className="text-lg font-semibold">
                    Real-Time Reporting :
                  </span>{" "}
                  Gain insights into your financial performance with real-time
                  analytics and customizable reporting tools.
                </p>
                <p>
                  <span className="text-lg font-semibold">
                    Compliance and Security :
                  </span>{" "}
                  Stay compliant with industry regulations while ensuring data
                  security with our advanced encryption and security protocols.
                </p>
                <p>
                  <span className="text-lg font-semibold">
                    Mobile and Online Banking :
                  </span>{" "}
                  Provide members with convenient access to their accounts
                  anytime, anywhere, through our responsive mobile and web
                  platforms.
                </p>
              </div>
            </div>

            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                Benefits
              </h4>
              <div className="text-start flex flex-col gap-3">
                <p>
                  <span className="text-lg font-semibold">
                    Enhanced Efficiency :
                  </span>{" "}
                  Automate routine tasks and streamline workflows to improve
                  operational efficiency.
                </p>
                <p>
                  <span className="text-lg font-semibold">
                    Improved Member Experience :
                  </span>{" "}
                  Foster stronger member relationships through personalized
                  services and easy access to financial information.
                </p>
                <p>
                  <span className="text-lg font-semibold">Scalability :</span>{" "}
                  PrioSuite grows with your institution, accommodating increasing
                  demands as your member base expands.
                </p>
              </div>
            </div>
            <p className="">
              Join the future of cooperative banking with{" "}
              <span className="font-libre text-lg italic">PrioSuite</span>, where
              innovation meets community-focused financial solutions.
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default About;
