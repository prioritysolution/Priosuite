# -*- coding: utf-8 -*-
"""Insert auth locales and wire login + forgotPassword components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

AUTH = {
    "en": {
        "smarterBanking": "Smarter Banking",
        "strongerCommunities": "Stronger Communities",
        "subtitle": "A complete, secure and scalable Core Banking Solution designed to simplify modern financial operations.",
        "secureReliable": "Secure & Reliable",
        "scalableArchitecture": "Scalable Architecture",
        "fasterOperations": "Faster Operations",
        "betterMemberService": "Better Member Service",
        "illustrationAlt": "PrioSuite banking illustration",
        "loading": "Loading",
        "secureLogin": "Secure Login",
        "welcomeBack": "Welcome Back",
        "signInSubtitle": "Sign in to continue to your institution",
        "language": "Language",
        "financialYear": "Financial Year",
        "emailUsername": "Email / Username",
        "enterEmailUsername": "Enter your email or username",
        "password": "Password",
        "enterPassword": "Enter your password",
        "signIn": "Sign In",
        "forgotPasswordLink": "Forgot Password?",
        "poweredBy": "Powered by Priority Solutions",
        "terminateSession": "Want to terminate your session?",
        "cancel": "Cancel",
        "continue": "Continue",
        "otp": "OTP",
        "enterOtp": "Enter your OTP",
        "resendOtp": "Resend OTP",
        "submit": "Submit",
        "langEnglish": "English",
        "langBangla": "Bangla",
        "langHindi": "Hindi",
        "langUrdu": "Urdu",
        "secureReset": "Secure Reset",
        "forgotPassword": "Forgot Password",
        "resetPassword": "Reset Password",
        "forgotSubtitle": "Enter your email to receive a reset code",
        "resetSubtitle": "Enter the code sent to your email and set a new password",
        "email": "Email",
        "enterEmail": "Enter your email",
        "code": "Code",
        "enterCode": "Enter code",
        "newPassword": "New Password",
        "enterNewPassword": "Enter new password",
        "confirmPassword": "Confirm Password",
        "confirmNewPassword": "Confirm new password",
        "next": "Next",
        "backToSignIn": "Back to Sign In",
    },
    "hi": {
        "smarterBanking": "स्मार्ट बैंकिंग",
        "strongerCommunities": "मजबूत समुदाय",
        "subtitle": "आधुनिक वित्तीय संचालन को सरल बनाने के लिए एक पूर्ण, सुरक्षित और स्केलेबल कोर बैंकिंग समाधान।",
        "secureReliable": "सुरक्षित और विश्वसनीय",
        "scalableArchitecture": "स्केलेबल आर्किटेक्चर",
        "fasterOperations": "तेज़ संचालन",
        "betterMemberService": "बेहतर सदस्य सेवा",
        "illustrationAlt": "PrioSuite बैंकिंग चित्रण",
        "loading": "लोड हो रहा है",
        "secureLogin": "सुरक्षित लॉगिन",
        "welcomeBack": "वापसी पर स्वागत है",
        "signInSubtitle": "अपने संस्थान में जारी रखने के लिए साइन इन करें",
        "language": "भाषा",
        "financialYear": "वित्तीय वर्ष",
        "emailUsername": "ईमेल / उपयोगकर्ता नाम",
        "enterEmailUsername": "अपना ईमेल या उपयोगकर्ता नाम दर्ज करें",
        "password": "पासवर्ड",
        "enterPassword": "अपना पासवर्ड दर्ज करें",
        "signIn": "साइन इन",
        "forgotPasswordLink": "पासवर्ड भूल गए?",
        "poweredBy": "Priority Solutions द्वारा संचालित",
        "terminateSession": "क्या आप अपना सत्र समाप्त करना चाहते हैं?",
        "cancel": "रद्द करें",
        "continue": "जारी रखें",
        "otp": "OTP",
        "enterOtp": "अपना OTP दर्ज करें",
        "resendOtp": "OTP पुनः भेजें",
        "submit": "जमा करें",
        "langEnglish": "अंग्रेज़ी",
        "langBangla": "बांग्ला",
        "langHindi": "हिन्दी",
        "langUrdu": "उर्दू",
        "secureReset": "सुरक्षित रीसेट",
        "forgotPassword": "पासवर्ड भूल गए",
        "resetPassword": "पासवर्ड रीसेट करें",
        "forgotSubtitle": "रीसेट कोड प्राप्त करने के लिए अपना ईमेल दर्ज करें",
        "resetSubtitle": "ईमेल पर भेजा गया कोड दर्ज करें और नया पासवर्ड सेट करें",
        "email": "ईमेल",
        "enterEmail": "अपना ईमेल दर्ज करें",
        "code": "कोड",
        "enterCode": "कोड दर्ज करें",
        "newPassword": "नया पासवर्ड",
        "enterNewPassword": "नया पासवर्ड दर्ज करें",
        "confirmPassword": "पासवर्ड की पुष्टि करें",
        "confirmNewPassword": "नए पासवर्ड की पुष्टि करें",
        "next": "अगला",
        "backToSignIn": "साइन इन पर वापस जाएँ",
    },
    "bn": {
        "smarterBanking": "স্মার্টার ব্যাংকিং",
        "strongerCommunities": "শক্তিশালী সম্প্রদায়",
        "subtitle": "আধুনিক আর্থিক কার্যক্রম সহজ করতে একটি সম্পূর্ণ, নিরাপদ এবং স্কেলযোগ্য কোর ব্যাংকিং সমাধান।",
        "secureReliable": "নিরাপদ ও নির্ভরযোগ্য",
        "scalableArchitecture": "স্কেলযোগ্য আর্কিটেকচার",
        "fasterOperations": "দ্রুততর কার্যক্রম",
        "betterMemberService": "উন্নত সদস্য সেবা",
        "illustrationAlt": "PrioSuite ব্যাংকিং চিত্র",
        "loading": "লোড হচ্ছে",
        "secureLogin": "নিরাপদ লগইন",
        "welcomeBack": "ফিরে আসার জন্য স্বাগতম",
        "signInSubtitle": "আপনার প্রতিষ্ঠানে চালিয়ে যেতে সাইন ইন করুন",
        "language": "ভাষা",
        "financialYear": "অর্থবছর",
        "emailUsername": "ইমেইল / ব্যবহারকারীর নাম",
        "enterEmailUsername": "আপনার ইমেইল বা ব্যবহারকারীর নাম লিখুন",
        "password": "পাসওয়ার্ড",
        "enterPassword": "আপনার পাসওয়ার্ড লিখুন",
        "signIn": "সাইন ইন",
        "forgotPasswordLink": "পাসওয়ার্ড ভুলে গেছেন?",
        "poweredBy": "Priority Solutions দ্বারা পরিচালিত",
        "terminateSession": "আপনি কি আপনার সেশন শেষ করতে চান?",
        "cancel": "বাতিল",
        "continue": "চালিয়ে যান",
        "otp": "OTP",
        "enterOtp": "আপনার OTP লিখুন",
        "resendOtp": "OTP পুনরায় পাঠান",
        "submit": "জমা দিন",
        "langEnglish": "ইংরেজি",
        "langBangla": "বাংলা",
        "langHindi": "হিন্দি",
        "langUrdu": "উর্দু",
        "secureReset": "নিরাপদ রিসেট",
        "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন",
        "resetPassword": "পাসওয়ার্ড রিসেট",
        "forgotSubtitle": "রিসেট কোড পেতে আপনার ইমেইল লিখুন",
        "resetSubtitle": "ইমেইলে পাঠানো কোড লিখুন এবং নতুন পাসওয়ার্ড সেট করুন",
        "email": "ইমেইল",
        "enterEmail": "আপনার ইমেইল লিখুন",
        "code": "কোড",
        "enterCode": "কোড লিখুন",
        "newPassword": "নতুন পাসওয়ার্ড",
        "enterNewPassword": "নতুন পাসওয়ার্ড লিখুন",
        "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
        "confirmNewPassword": "নতুন পাসওয়ার্ড নিশ্চিত করুন",
        "next": "পরবর্তী",
        "backToSignIn": "সাইন ইনে ফিরে যান",
    },
    "or": {
        "smarterBanking": "ସ୍ମାର୍ଟର୍ ବ୍ୟାଙ୍କିଂ",
        "strongerCommunities": "ଶକ୍ତିଶାଳୀ ସମ୍ପ୍ରଦାୟ",
        "subtitle": "ଆଧୁନିକ ଆର୍ଥିକ କାର୍ଯ୍ୟକ୍ରମକୁ ସରଳ କରିବା ପାଇଁ ଏକ ସମ୍ପୂର୍ଣ୍ଣ, ସୁରକ୍ଷିତ ଏବଂ ସ୍କେଲେବଲ୍ କୋର୍ ବ୍ୟାଙ୍କିଂ ସମାଧାନ।",
        "secureReliable": "ସୁରକ୍ଷିତ ଏବଂ ବିଶ୍ୱସନୀୟ",
        "scalableArchitecture": "ସ୍କେଲେବଲ୍ ଆର୍କିଟେକଚର୍",
        "fasterOperations": "ଦ୍ରୁତ କାର୍ଯ୍ୟକ୍ରମ",
        "betterMemberService": "ଉନ୍ନତ ସଦସ୍ୟ ସେବା",
        "illustrationAlt": "PrioSuite ବ୍ୟାଙ୍କିଂ ଚିତ୍ର",
        "loading": "ଲୋଡ୍ ହେଉଛି",
        "secureLogin": "ସୁରକ୍ଷିତ ଲଗଇନ୍",
        "welcomeBack": "ପୁନଃ ସ୍ୱାଗତ",
        "signInSubtitle": "ଆପଣଙ୍କ ସଂସ୍ଥାରେ ଜାରି ରଖିବାକୁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
        "language": "ଭାଷା",
        "financialYear": "ଆର୍ଥିକ ବର୍ଷ",
        "emailUsername": "ଇମେଲ୍ / ଉପଭୋକ୍ତା ନାମ",
        "enterEmailUsername": "ଆପଣଙ୍କ ଇମେଲ୍ କିମ୍ବା ଉପଭୋକ୍ତା ନାମ ଲେଖନ୍ତୁ",
        "password": "ପାସୱାର୍ଡ",
        "enterPassword": "ଆପଣଙ୍କ ପାସୱାର୍ଡ ଲେଖନ୍ତୁ",
        "signIn": "ସାଇନ୍ ଇନ୍",
        "forgotPasswordLink": "ପାସୱାର୍ଡ ଭୁଲିଯାଇଛନ୍ତି?",
        "poweredBy": "Priority Solutions ଦ୍ୱାରା ପରିଚାଳିତ",
        "terminateSession": "ଆପଣ ଆପଣଙ୍କ ସେସନ୍ ଶେଷ କରିବାକୁ ଚାହାଁନ୍ତି କି?",
        "cancel": "ବାତିଲ୍",
        "continue": "ଜାରି ରଖନ୍ତୁ",
        "otp": "OTP",
        "enterOtp": "ଆପଣଙ୍କ OTP ଲେଖନ୍ତୁ",
        "resendOtp": "OTP ପୁନଃ ପଠାନ୍ତୁ",
        "submit": "ଦାଖଲ କରନ୍ତୁ",
        "langEnglish": "ଇଂରାଜୀ",
        "langBangla": "ବଙ୍ଗଳା",
        "langHindi": "ହିନ୍ଦୀ",
        "langUrdu": "ଉର୍ଦ୍ଦୁ",
        "secureReset": "ସୁରକ୍ଷିତ ରିସେଟ୍",
        "forgotPassword": "ପାସୱାର୍ଡ ଭୁଲିଯାଇଛନ୍ତି",
        "resetPassword": "ପାସୱାର୍ଡ ରିସେଟ୍",
        "forgotSubtitle": "ରିସେଟ୍ କୋଡ୍ ପାଇବା ପାଇଁ ଆପଣଙ୍କ ଇମେଲ୍ ଲେଖନ୍ତୁ",
        "resetSubtitle": "ଇମେଲରେ ପଠାଯାଇଥିବା କୋଡ୍ ଲେଖନ୍ତୁ ଏବଂ ନୂତନ ପାସୱାର୍ଡ ସେଟ୍ କରନ୍ତୁ",
        "email": "ଇମେଲ୍",
        "enterEmail": "ଆପଣଙ୍କ ଇମେଲ୍ ଲେଖନ୍ତୁ",
        "code": "କୋଡ୍",
        "enterCode": "କୋଡ୍ ଲେଖନ୍ତୁ",
        "newPassword": "ନୂତନ ପାସୱାର୍ଡ",
        "enterNewPassword": "ନୂତନ ପାସୱାର୍ଡ ଲେଖନ୍ତୁ",
        "confirmPassword": "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "confirmNewPassword": "ନୂତନ ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "next": "ପରବର୍ତ୍ତୀ",
        "backToSignIn": "ସାଇନ୍ ଇନ୍କୁ ଫେରନ୍ତୁ",
    },
}


def js_obj(d, indent=6):
    pad = " " * indent
    items = list(d.items())
    lines = []
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


def insert_after_top_block(text, block_name, new_block):
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"missing {block_name}")
    depth = 0
    i = m.end(1) - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                return text[:j] + "\n" + new_block + text[j:]
        i += 1
    raise SystemExit(f"unclosed {block_name}")


def insert_lang(lang):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    if re.search(r"\n    auth:\s*\{", text):
        print(f"{lang}: auth already present")
        return
    block = "    auth: {\n" + js_obj(AUTH[lang], indent=6) + "\n    },"
    for anchor in ("dashboard", "footer", "about"):
        if re.search(rf"\n    {anchor}:\s*\{{", text):
            text = insert_after_top_block(text, anchor, block)
            path.write_text(text, encoding="utf-8")
            print(f"{lang}: inserted after {anchor}")
            return
    raise SystemExit(f"{lang}: no anchor")


def wire_login():
    path = ROOT / "components/auth/login/index.jsx"
    text = path.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import BrandMark from "@/common/BrandMark";\n',
            'import BrandMark from "@/common/BrandMark";\n'
            'import { useTranslation } from "react-i18next";\n',
        )

    # Replace static languageOptions with t()-built inside component
    text = text.replace(
        """const languageOptions = [
  { Id: "en", Option_Value: "English" },
  { Id: "bn", Option_Value: "Bangla" },
  { Id: "hi", Option_Value: "Hindi" },
  { Id: "ur", Option_Value: "Urdu" },
];

""",
        "",
    )

    if "const { t } = useTranslation();" not in text.split("const Login")[1][:400]:
        text = text.replace(
            """}) => {
  const [showLoginLoading, setShowLoginLoading] = useState(false);""",
            """}) => {
  const { t } = useTranslation();
  const [showLoginLoading, setShowLoginLoading] = useState(false);

  const languageOptions = [
    { Id: "en", Option_Value: t("auth.langEnglish") },
    { Id: "bn", Option_Value: t("auth.langBangla") },
    { Id: "hi", Option_Value: t("auth.langHindi") },
    { Id: "ur", Option_Value: t("auth.langUrdu") },
  ];""",
        )

    repls = [
        (
            """          <p className="text-base font-medium tracking-wide text-gray-700 sm:text-lg">
            Loading
          </p>""",
            """          <p className="text-base font-medium tracking-wide text-gray-700 sm:text-lg">
            {t("auth.loading")}
          </p>""",
        ),
        (
            """            <h1 className="mt-7 whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#163A5F] xl:mt-8 xl:text-[26px] 2xl:text-[28px]">
              Smarter Banking
              <span className="mx-2.5 font-medium text-[#1B74D6]">|</span>
              Stronger Communities
            </h1>
            <p className="mt-3 max-w-[460px] text-[13px] leading-[1.55] text-[#6B849E] xl:text-[14px]">
              A complete, secure and scalable Core Banking Solution
              designed to simplify modern financial operations.
            </p>""",
            """            <h1 className="mt-7 whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#163A5F] xl:mt-8 xl:text-[26px] 2xl:text-[28px]">
              {t("auth.smarterBanking")}
              <span className="mx-2.5 font-medium text-[#1B74D6]">|</span>
              {t("auth.strongerCommunities")}
            </h1>
            <p className="mt-3 max-w-[460px] text-[13px] leading-[1.55] text-[#6B849E] xl:text-[14px]">
              {t("auth.subtitle")}
            </p>""",
        ),
        (
            'alt="PrioSuite banking illustration"',
            'alt={t("auth.illustrationAlt")}',
        ),
        (
            '<FeatureStripItem icon={ShieldCheck} label="Secure & Reliable"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={IoIosCloudOutline} label="Scalable Architecture"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Zap} label="Faster Operations"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Users} label="Better Member Service"  />',
            '<FeatureStripItem icon={ShieldCheck} label={t("auth.secureReliable")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={IoIosCloudOutline} label={t("auth.scalableArchitecture")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Zap} label={t("auth.fasterOperations")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Users} label={t("auth.betterMemberService")}  />',
        ),
        (
            """                <Lock className="h-3 w-3" />
                Secure Login
              </span>""",
            """                <Lock className="h-3 w-3" />
                {t("auth.secureLogin")}
              </span>""",
        ),
        (
            """              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                Welcome Back
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                Sign in to continue to your institution
              </p>""",
            """              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                {t("auth.welcomeBack")}
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                {t("auth.signInSubtitle")}
              </p>""",
        ),
        ('label="Language"', 'label={t("auth.language")}'),
        ('label="Financial Year"', 'label={t("auth.financialYear")}'),
        ('label="Email / Username"', 'label={t("auth.emailUsername")}'),
        (
            'placeholder="Enter your email or username"',
            'placeholder={t("auth.enterEmailUsername")}',
        ),
        ('label="Password"', 'label={t("auth.password")}'),
        (
            'placeholder="Enter your password"',
            'placeholder={t("auth.enterPassword")}',
        ),
        (
            """                    <span className="inline-flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>""",
            """                    <span className="inline-flex items-center gap-2">
                      {t("auth.signIn")}
                      <ArrowRight className="h-4 w-4" />
                    </span>""",
        ),
        (
            """                  >
                    Forgot Password?
                  </Link>""",
            """                  >
                    {t("auth.forgotPasswordLink")}
                  </Link>""",
        ),
        (
            """              >
                Powered by Priority Solutions
              </Link>""",
            """              >
                {t("auth.poweredBy")}
              </Link>""",
        ),
        (
            """                <p className="text-center text-base font-semibold text-[#1a2e44] sm:text-lg">
                  Want to terminate your session?
                </p>""",
            """                <p className="text-center text-base font-semibold text-[#1a2e44] sm:text-lg">
                  {t("auth.terminateSession")}
                </p>""",
        ),
        (
            """                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    onClick={handleShowOtpForm}
                  >
                    Continue
                  </Button>""",
            """                  >
                    {t("auth.cancel")}
                  </Button>
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    onClick={handleShowOtpForm}
                  >
                    {t("auth.continue")}
                  </Button>""",
        ),
        ('label="OTP"', 'label={t("auth.otp")}'),
        ('placeholder="Enter your OTP"', 'placeholder={t("auth.enterOtp")}'),
        (
            """                    >
                      Resend OTP
                    </button>""",
            """                    >
                      {t("auth.resendOtp")}
                    </button>""",
        ),
        (
            """                    ) : (
                      "Submit"
                    )}""",
            """                    ) : (
                      t("auth.submit")
                    )}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"LOGIN MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"LOGIN OK: {old[:45]!r}")
    path.write_text(text, encoding="utf-8")
    print("login done")


def wire_forgot():
    path = ROOT / "components/auth/forgotPassword/index.jsx"
    text = path.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import { cn } from "@/lib/utils";\n',
            'import { cn } from "@/lib/utils";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            """}) => {
  const isResetStep = page !== 1;""",
            """}) => {
  const { t } = useTranslation();
  const isResetStep = page !== 1;""",
        )

    repls = [
        (
            """            <h1 className="mt-7 whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#163A5F] xl:mt-8 xl:text-[26px] 2xl:text-[28px]">
              Smarter Banking
              <span className="mx-2.5 font-medium text-[#1B74D6]">|</span>
              Stronger Communities
            </h1>
            <p className="mt-3 max-w-[460px] text-[13px] leading-[1.55] text-[#6B849E] xl:text-[14px]">
              A complete, secure and scalable Core Banking Solution
              designed to simplify modern financial operations.
            </p>""",
            """            <h1 className="mt-7 whitespace-nowrap text-[22px] font-extrabold tracking-tight text-[#163A5F] xl:mt-8 xl:text-[26px] 2xl:text-[28px]">
              {t("auth.smarterBanking")}
              <span className="mx-2.5 font-medium text-[#1B74D6]">|</span>
              {t("auth.strongerCommunities")}
            </h1>
            <p className="mt-3 max-w-[460px] text-[13px] leading-[1.55] text-[#6B849E] xl:text-[14px]">
              {t("auth.subtitle")}
            </p>""",
        ),
        (
            'alt="PrioSuite banking illustration"',
            'alt={t("auth.illustrationAlt")}',
        ),
        (
            '<FeatureStripItem icon={ShieldCheck} label="Secure & Reliable"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={IoIosCloudOutline} label="Scalable Architecture"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Zap} label="Faster Operations"  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Users} label="Better Member Service"  />',
            '<FeatureStripItem icon={ShieldCheck} label={t("auth.secureReliable")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={IoIosCloudOutline} label={t("auth.scalableArchitecture")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Zap} label={t("auth.fasterOperations")}  className="border-r-2 border-r-[#1B74D6]" />\n'
            '              <FeatureStripItem icon={Users} label={t("auth.betterMemberService")}  />',
        ),
        (
            """                <Lock className="h-3 w-3" />
                Secure Reset
              </span>""",
            """                <Lock className="h-3 w-3" />
                {t("auth.secureReset")}
              </span>""",
        ),
        (
            """              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                {isResetStep ? "Reset Password" : "Forgot Password"}
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                {isResetStep
                  ? "Enter the code sent to your email and set a new password"
                  : "Enter your email to receive a reset code"}
              </p>""",
            """              <h2 className="text-[22px] font-extrabold leading-tight text-[#163A5F] sm:text-[24px]">
                {isResetStep
                  ? t("auth.resetPassword")
                  : t("auth.forgotPassword")}
              </h2>
              <p className="mt-1 text-[12px] text-[#7A93B0] sm:text-[13px]">
                {isResetStep
                  ? t("auth.resetSubtitle")
                  : t("auth.forgotSubtitle")}
              </p>""",
        ),
        ('label="Email"', 'label={t("auth.email")}'),
        ('placeholder="Enter your email"', 'placeholder={t("auth.enterEmail")}'),
        ('label="Code"', 'label={t("auth.code")}'),
        ('placeholder="Enter code"', 'placeholder={t("auth.enterCode")}'),
        (
            """                      >
                        Resend OTP
                      </button>""",
            """                      >
                        {t("auth.resendOtp")}
                      </button>""",
        ),
        ('label="New Password"', 'label={t("auth.newPassword")}'),
        (
            'placeholder="Enter new password"',
            'placeholder={t("auth.enterNewPassword")}',
        ),
        ('label="Confirm Password"', 'label={t("auth.confirmPassword")}'),
        (
            'placeholder="Confirm new password"',
            'placeholder={t("auth.confirmNewPassword")}',
        ),
        (
            '{isResetStep ? "Submit" : "Next"}',
            '{isResetStep ? t("auth.submit") : t("auth.next")}',
        ),
        (
            """                  >
                    Back to Sign In
                  </Link>""",
            """                  >
                    {t("auth.backToSignIn")}
                  </Link>""",
        ),
        (
            """              >
                Powered by Priority Solutions
              </Link>""",
            """              >
                {t("auth.poweredBy")}
              </Link>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"FORGOT MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"FORGOT OK: {old[:45]!r}")
    path.write_text(text, encoding="utf-8")
    print("forgot done")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_login()
    wire_forgot()
