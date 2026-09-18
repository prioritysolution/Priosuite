# -*- coding: utf-8 -*-
"""Insert about locales and wire components/about/index.jsx."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "about" / "index.jsx"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


ABOUT = {
    "en": {
        "aboutUs": "About Us",
        "empoweringCooperativeBanking": "PrioSuite : Empowering Cooperative Banking",
        "description": "PrioSuite is a comprehensive co-operative banking software designed to streamline operations, enhance member engagement, and optimize financial management. Built with a user-friendly interface and advanced technology, PrioSuite offers a robust suite of core banking features tailored specifically for co-operative banks.",
        "keyFeatures": "Key Features",
        "coreBankingFunctionalityTitle": "Core Banking Functionality :",
        "coreBankingFunctionality": "Manage accounts, loans, deposits, and transactions seamlessly with our integrated core banking system.",
        "memberManagementTitle": "Member Management :",
        "memberManagement": "Enhance member relationships with tools for tracking interactions, preferences, and financial history.",
        "realTimeReportingTitle": "Real-Time Reporting :",
        "realTimeReporting": "Gain insights into your financial performance with real-time analytics and customizable reporting tools.",
        "complianceAndSecurityTitle": "Compliance and Security :",
        "complianceAndSecurity": "Stay compliant with industry regulations while ensuring data security with our advanced encryption and security protocols.",
        "mobileAndOnlineBankingTitle": "Mobile and Online Banking :",
        "mobileAndOnlineBanking": "Provide members with convenient access to their accounts anytime, anywhere, through our responsive mobile and web platforms.",
        "benefits": "Benefits",
        "enhancedEfficiencyTitle": "Enhanced Efficiency :",
        "enhancedEfficiency": "Automate routine tasks and streamline workflows to improve operational efficiency.",
        "improvedMemberExperienceTitle": "Improved Member Experience :",
        "improvedMemberExperience": "Foster stronger member relationships through personalized services and easy access to financial information.",
        "scalabilityTitle": "Scalability :",
        "scalability": "PrioSuite grows with your institution, accommodating increasing demands as your member base expands.",
        "futureOfCooperativeBanking": "Join the future of cooperative banking with",
        "innovationMeetsCommunity": "where innovation meets community-focused financial solutions.",
    },
    "hi": {
        "aboutUs": "हमारे बारे में",
        "empoweringCooperativeBanking": "PrioSuite : सहकारी बैंकिंग को सशक्त बनाना",
        "description": "PrioSuite एक व्यापक सहकारी बैंकिंग सॉफ्टवेयर है जिसे संचालन को सुव्यवस्थित करने, सदस्यों की सहभागिता बढ़ाने और वित्तीय प्रबंधन को बेहतर बनाने के लिए डिज़ाइन किया गया है। उपयोगकर्ता-अनुकूल इंटरफ़ेस और उन्नत तकनीक के साथ निर्मित, PrioSuite विशेष रूप से सहकारी बैंकों के लिए तैयार की गई मुख्य बैंकिंग सुविधाओं का एक मजबूत समूह प्रदान करता है।",
        "keyFeatures": "मुख्य विशेषताएं",
        "coreBankingFunctionalityTitle": "मुख्य बैंकिंग कार्यक्षमता :",
        "coreBankingFunctionality": "हमारी एकीकृत मुख्य बैंकिंग प्रणाली के साथ खातों, ऋणों, जमा और लेनदेन को आसानी से प्रबंधित करें।",
        "memberManagementTitle": "सदस्य प्रबंधन :",
        "memberManagement": "सदस्यों की बातचीत, प्राथमिकताओं और वित्तीय इतिहास को ट्रैक करने वाले उपकरणों के माध्यम से सदस्य संबंधों को बेहतर बनाएं।",
        "realTimeReportingTitle": "रियल-टाइम रिपोर्टिंग :",
        "realTimeReporting": "रियल-टाइम एनालिटिक्स और अनुकूलन योग्य रिपोर्टिंग टूल्स के साथ अपने वित्तीय प्रदर्शन की जानकारी प्राप्त करें।",
        "complianceAndSecurityTitle": "अनुपालन और सुरक्षा :",
        "complianceAndSecurity": "उन्नत एन्क्रिप्शन और सुरक्षा प्रोटोकॉल के साथ डेटा सुरक्षा सुनिश्चित करते हुए उद्योग नियमों का अनुपालन करें।",
        "mobileAndOnlineBankingTitle": "मोबाइल और ऑनलाइन बैंकिंग :",
        "mobileAndOnlineBanking": "हमारे रिस्पॉन्सिव मोबाइल और वेब प्लेटफॉर्म के माध्यम से सदस्यों को कभी भी, कहीं भी अपने खातों तक सुविधाजनक पहुंच प्रदान करें।",
        "benefits": "लाभ",
        "enhancedEfficiencyTitle": "बेहतर दक्षता :",
        "enhancedEfficiency": "नियमित कार्यों को स्वचालित करें और परिचालन दक्षता बढ़ाने के लिए कार्यप्रवाह को सुव्यवस्थित करें।",
        "improvedMemberExperienceTitle": "बेहतर सदस्य अनुभव :",
        "improvedMemberExperience": "व्यक्तिगत सेवाओं और वित्तीय जानकारी तक आसान पहुंच के माध्यम से सदस्यों के साथ मजबूत संबंध विकसित करें।",
        "scalabilityTitle": "स्केलेबिलिटी :",
        "scalability": "PrioSuite आपके संस्थान के साथ बढ़ता है और सदस्य आधार बढ़ने के साथ बढ़ती मांगों को पूरा करता है।",
        "futureOfCooperativeBanking": "PrioSuite के साथ सहकारी बैंकिंग के भविष्य से जुड़ें,",
        "innovationMeetsCommunity": "जहां नवाचार समुदाय-केंद्रित वित्तीय समाधानों से मिलता है।",
    },
    "bn": {
        "aboutUs": "আমাদের সম্পর্কে",
        "empoweringCooperativeBanking": "PrioSuite : সমবায় ব্যাংকিংকে শক্তিশালী করা",
        "description": "PrioSuite একটি ব্যাপক সমবায় ব্যাংকিং সফটওয়্যার যা কার্যক্রমকে সহজতর করা, সদস্যদের সম্পৃক্ততা বৃদ্ধি করা এবং আর্থিক ব্যবস্থাপনাকে উন্নত করার জন্য ডিজাইন করা হয়েছে। ব্যবহারকারী-বান্ধব ইন্টারফেস এবং উন্নত প্রযুক্তির মাধ্যমে তৈরি PrioSuite সমবায় ব্যাংকের জন্য বিশেষভাবে তৈরি শক্তিশালী কোর ব্যাংকিং সুবিধা প্রদান করে।",
        "keyFeatures": "প্রধান বৈশিষ্ট্য",
        "coreBankingFunctionalityTitle": "কোর ব্যাংকিং কার্যকারিতা :",
        "coreBankingFunctionality": "আমাদের সমন্বিত কোর ব্যাংকিং সিস্টেমের মাধ্যমে অ্যাকাউন্ট, ঋণ, আমানত এবং লেনদেন সহজে পরিচালনা করুন।",
        "memberManagementTitle": "সদস্য ব্যবস্থাপনা :",
        "memberManagement": "সদস্যদের যোগাযোগ, পছন্দ এবং আর্থিক ইতিহাস ট্র্যাক করার সরঞ্জামের মাধ্যমে সদস্য সম্পর্ক উন্নত করুন।",
        "realTimeReportingTitle": "রিয়েল-টাইম রিপোর্টিং :",
        "realTimeReporting": "রিয়েল-টাইম অ্যানালিটিক্স এবং কাস্টমাইজযোগ্য রিপোর্টিং টুলের মাধ্যমে আপনার আর্থিক কর্মক্ষমতা সম্পর্কে তথ্য পান।",
        "complianceAndSecurityTitle": "অনুগত্য এবং নিরাপত্তা :",
        "complianceAndSecurity": "উন্নত এনক্রিপশন এবং নিরাপত্তা প্রোটোকলের মাধ্যমে ডেটা নিরাপত্তা নিশ্চিত করার পাশাপাশি শিল্পের নিয়ম মেনে চলুন।",
        "mobileAndOnlineBankingTitle": "মোবাইল এবং অনলাইন ব্যাংকিং :",
        "mobileAndOnlineBanking": "আমাদের রেসপন্সিভ মোবাইল এবং ওয়েব প্ল্যাটফর্মের মাধ্যমে সদস্যদের যেকোনো সময়, যেকোনো জায়গা থেকে তাদের অ্যাকাউন্টে সুবিধাজনক অ্যাক্সেস প্রদান করুন।",
        "benefits": "সুবিধা",
        "enhancedEfficiencyTitle": "উন্নত দক্ষতা :",
        "enhancedEfficiency": "নিয়মিত কাজ স্বয়ংক্রিয় করুন এবং কার্যক্ষমতা উন্নত করতে ওয়ার্কফ্লো সহজতর করুন।",
        "improvedMemberExperienceTitle": "উন্নত সদস্য অভিজ্ঞতা :",
        "improvedMemberExperience": "ব্যক্তিগতকৃত পরিষেবা এবং আর্থিক তথ্যের সহজ অ্যাক্সেসের মাধ্যমে সদস্যদের সঙ্গে আরও শক্তিশালী সম্পর্ক গড়ে তুলুন।",
        "scalabilityTitle": "স্কেলেবিলিটি :",
        "scalability": "PrioSuite আপনার প্রতিষ্ঠানের সঙ্গে বৃদ্ধি পায় এবং সদস্য সংখ্যা বাড়ার সঙ্গে সঙ্গে বাড়তি চাহিদা পূরণ করে।",
        "futureOfCooperativeBanking": "PrioSuite-এর সঙ্গে সমবায় ব্যাংকিংয়ের ভবিষ্যতে যোগ দিন,",
        "innovationMeetsCommunity": "যেখানে উদ্ভাবন সম্প্রদায়-কেন্দ্রিক আর্থিক সমাধানের সঙ্গে মিলিত হয়।",
    },
    "or": {
        "aboutUs": "ଆମ ବିଷୟରେ",
        "empoweringCooperativeBanking": "PrioSuite : ସମବାୟ ବ୍ୟାଙ୍କିଙ୍ଗକୁ ସଶକ୍ତ କରିବା",
        "description": "PrioSuite ହେଉଛି ଏକ ବ୍ୟାପକ ସମବାୟ ବ୍ୟାଙ୍କିଙ୍ଗ ସଫ୍ଟୱେର୍ ଯାହା କାର୍ଯ୍ୟକଳାପକୁ ସରଳ କରିବା, ସଦସ୍ୟଙ୍କ ଯୋଗଦାନ ବୃଦ୍ଧି କରିବା ଏବଂ ଆର୍ଥିକ ପରିଚାଳନାକୁ ଉନ୍ନତ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି। ବ୍ୟବହାରକାରୀ-ଅନୁକୂଳ ଇଣ୍ଟରଫେସ୍ ଏବଂ ଉନ୍ନତ ପ୍ରଯୁକ୍ତି ସହିତ ନିର୍ମିତ PrioSuite ସମବାୟ ବ୍ୟାଙ୍କଗୁଡ଼ିକ ପାଇଁ ବିଶେଷ ଭାବେ ପ୍ରସ୍ତୁତ ମୁଖ୍ୟ ବ୍ୟାଙ୍କିଙ୍ଗ ସୁବିଧାର ଏକ ଶକ୍ତିଶାଳୀ ସମୂହ ପ୍ରଦାନ କରେ।",
        "keyFeatures": "ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟ",
        "coreBankingFunctionalityTitle": "ମୁଖ୍ୟ ବ୍ୟାଙ୍କିଙ୍ଗ କାର୍ଯ୍ୟକ୍ଷମତା :",
        "coreBankingFunctionality": "ଆମର ସମନ୍ୱିତ ମୁଖ୍ୟ ବ୍ୟାଙ୍କିଙ୍ଗ ସିଷ୍ଟମ୍ ସହିତ ଖାତା, ଋଣ, ଜମା ଏବଂ କାରବାରକୁ ସହଜରେ ପରିଚାଳନା କରନ୍ତୁ।",
        "memberManagementTitle": "ସଦସ୍ୟ ପରିଚାଳନା :",
        "memberManagement": "ସଦସ୍ୟଙ୍କ ଯୋଗାଯୋଗ, ପସନ୍ଦ ଏବଂ ଆର୍ଥିକ ଇତିହାସ ଟ୍ରାକ୍ କରିବା ପାଇଁ ଉପକରଣ ମାଧ୍ୟମରେ ସଦସ୍ୟ ସମ୍ପର୍କକୁ ଉନ୍ନତ କରନ୍ତୁ।",
        "realTimeReportingTitle": "ରିୟଲ୍-ଟାଇମ୍ ରିପୋର୍ଟିଂ :",
        "realTimeReporting": "ରିୟଲ୍-ଟାଇମ୍ ଆନାଲିଟିକ୍ସ ଏବଂ କଷ୍ଟମାଇଜ୍ କରିପାରିବା ରିପୋର୍ଟିଂ ଟୁଲ୍ ମାଧ୍ୟମରେ ଆପଣଙ୍କ ଆର୍ଥିକ ପ୍ରଦର୍ଶନ ବିଷୟରେ ଜାଣନ୍ତୁ।",
        "complianceAndSecurityTitle": "ଅନୁପାଳନ ଏବଂ ସୁରକ୍ଷା :",
        "complianceAndSecurity": "ଉନ୍ନତ ଏନକ୍ରିପ୍ସନ୍ ଏବଂ ସୁରକ୍ଷା ପ୍ରୋଟୋକଲ୍ ସହିତ ଡାଟା ସୁରକ୍ଷା ନିଶ୍ଚିତ କରି ଶିଳ୍ପ ନିୟମାବଳୀ ପାଳନ କରନ୍ତୁ।",
        "mobileAndOnlineBankingTitle": "ମୋବାଇଲ୍ ଏବଂ ଅନଲାଇନ୍ ବ୍ୟାଙ୍କିଙ୍ଗ :",
        "mobileAndOnlineBanking": "ଆମର ରେସ୍ପନ୍ସିଭ୍ ମୋବାଇଲ୍ ଏବଂ ୱେବ୍ ପ୍ଲାଟଫର୍ମ ମାଧ୍ୟମରେ ସଦସ୍ୟମାନଙ୍କୁ ଯେକୌଣସି ସମୟରେ, ଯେକୌଣସି ସ୍ଥାନରୁ ନିଜ ଖାତାକୁ ସୁବିଧାଜନକ ଭାବରେ ଆକ୍ସେସ୍ ପ୍ରଦାନ କରନ୍ତୁ।",
        "benefits": "ଲାଭ",
        "enhancedEfficiencyTitle": "ଉନ୍ନତ ଦକ୍ଷତା :",
        "enhancedEfficiency": "ନିୟମିତ କାର୍ଯ୍ୟଗୁଡ଼ିକୁ ସ୍ୱୟଂଚାଳିତ କରନ୍ତୁ ଏବଂ କାର୍ଯ୍ୟକ୍ଷମତା ବଢ଼ାଇବା ପାଇଁ ୱର୍କଫ୍ଲୋକୁ ସରଳ କରନ୍ତୁ।",
        "improvedMemberExperienceTitle": "ଉନ୍ନତ ସଦସ୍ୟ ଅନୁଭୂତି :",
        "improvedMemberExperience": "ବ୍ୟକ୍ତିଗତ ସେବା ଏବଂ ଆର୍ଥିକ ସୂଚନାକୁ ସହଜ ଆକ୍ସେସ୍ ମାଧ୍ୟମରେ ସଦସ୍ୟମାନଙ୍କ ସହିତ ଅଧିକ ଦୃଢ଼ ସମ୍ପର୍କ ଗଢ଼ନ୍ତୁ।",
        "scalabilityTitle": "ସ୍କେଲେବିଲିଟି :",
        "scalability": "PrioSuite ଆପଣଙ୍କ ସଂସ୍ଥା ସହିତ ବୃଦ୍ଧି ପାଏ ଏବଂ ସଦସ୍ୟ ସଂଖ୍ୟା ବଢ଼ିବା ସହିତ ବଢ଼ୁଥିବା ଚାହିଦା ପୂରଣ କରେ।",
        "futureOfCooperativeBanking": "PrioSuite ସହିତ ସମବାୟ ବ୍ୟାଙ୍କିଙ୍ଗର ଭବିଷ୍ୟତରେ ଯୋଗ ଦିଅନ୍ତୁ,",
        "innovationMeetsCommunity": "ଯେଉଁଠାରେ ନବସୃଜନ ସମୁଦାୟ-କେନ୍ଦ୍ରିତ ଆର୍ଥିକ ସମାଧାନ ସହିତ ମିଳିଥାଏ।",
    },
}


def insert_after_top_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"top-level {block_name} not found")
    depth = 0
    i = m.end(1) - 1
    end = None
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                end = j
                break
        i += 1
    if end is None:
        raise SystemExit(f"could not close {block_name}")
    return text[:end] + "\n" + new_block + text[end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    if re.search(r"\n    about:\s*\{", text):
        print(f"{lang}: about already present")
    else:
        block = "    about: {\n" + js_obj(ABOUT[lang], indent=6) + "\n    },"
        for anchor in ("createUser", "userRole", "report"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted about after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


WIRED = '''"use client";

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
'''


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    COMP.write_text(WIRED, encoding="utf-8")
    print("component wired")


if __name__ == "__main__":
    main()
