"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

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
        <h3 className="text-3xl font-semibold">
          {t("about.aboutUs")}
        </h3>

        <ScrollArea className="w-full h-full">
          <div className="w-full h-full px-2 lg:px-10 xl:px-20 flex flex-col gap-10">
            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                {t("about.empoweringCooperativeBanking")}
              </h4>
              <p>
                {t("about.description")}
              </p>
            </div>

            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                {t("about.keyFeatures")}
              </h4>

              <div className="text-start flex flex-col gap-3">
                <p>
                  <span className="text-lg font-semibold">
                    {t("about.coreBankingFunctionalityTitle")}
                  </span>{" "}
                  {t("about.coreBankingFunctionality")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.memberManagementTitle")}
                  </span>{" "}
                  {t("about.memberManagement")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.realTimeReportingTitle")}
                  </span>{" "}
                  {t("about.realTimeReporting")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.complianceAndSecurityTitle")}
                  </span>{" "}
                  {t("about.complianceAndSecurity")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.mobileAndOnlineBankingTitle")}
                  </span>{" "}
                  {t("about.mobileAndOnlineBanking")}
                </p>
              </div>
            </div>

            <div className="w-full text-center">
              <h4 className="text-xl mb-5 font-semibold text-[#a2294d] underline">
                {t("about.benefits")}
              </h4>

              <div className="text-start flex flex-col gap-3">
                <p>
                  <span className="text-lg font-semibold">
                    {t("about.enhancedEfficiencyTitle")}
                  </span>{" "}
                  {t("about.enhancedEfficiency")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.improvedMemberExperienceTitle")}
                  </span>{" "}
                  {t("about.improvedMemberExperience")}
                </p>

                <p>
                  <span className="text-lg font-semibold">
                    {t("about.scalabilityTitle")}
                  </span>{" "}
                  {t("about.scalability")}
                </p>
              </div>
            </div>

            <p className="">
              {t("about.futureOfCooperativeBanking")}{" "}
              <span className="font-libre text-lg italic">PrioSuite</span>,{" "}
              {t("about.innovationMeetsCommunity")}
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default About;
