# -*- coding: utf-8 -*-
"""Add beginpage keys under auth and wire beginpage/page.tsx."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
PAGE = ROOT / "app" / "(auth)" / "beginpage" / "page.tsx"

KEYS = {
    "en": {
        "welcomeTo": "Welcome to",
        "priosuite": "Priosuite",
        "loginImageAlt": "Login Image",
        "organisationName": "Organisation Name",
        "branchName": "Branch Name",
        "workingDate": "Working Date",
        "processToDayBegin": "Process To Day Begin",
        "logout": "Logout",
        "designedBy": "Designed and Developed by",
        "generalComputer": "General Computer",
        "failedToStartBusinessDay": "Failed to start business day",
        "anErrorOccurred": "An error occurred. Please try again.",
    },
    "hi": {
        "welcomeTo": "स्वागत है",
        "priosuite": "Priosuite",
        "loginImageAlt": "लॉगिन छवि",
        "organisationName": "संगठन का नाम",
        "branchName": "शाखा का नाम",
        "workingDate": "कार्य दिनांक",
        "processToDayBegin": "दिन प्रारंभ करें",
        "logout": "लॉग आउट",
        "designedBy": "डिज़ाइन और विकास द्वारा",
        "generalComputer": "General Computer",
        "failedToStartBusinessDay": "व्यावसायिक दिन शुरू करने में विफल",
        "anErrorOccurred": "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    },
    "bn": {
        "welcomeTo": "স্বাগতম",
        "priosuite": "Priosuite",
        "loginImageAlt": "লগইন ছবি",
        "organisationName": "প্রতিষ্ঠানের নাম",
        "branchName": "শাখার নাম",
        "workingDate": "কর্মদিবস",
        "processToDayBegin": "দিন শুরু করুন",
        "logout": "লগ আউট",
        "designedBy": "ডিজাইন ও উন্নয়ন করেছে",
        "generalComputer": "General Computer",
        "failedToStartBusinessDay": "ব্যবসায়িক দিন শুরু করতে ব্যর্থ",
        "anErrorOccurred": "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    },
    "or": {
        "welcomeTo": "ସ୍ୱାଗତ",
        "priosuite": "Priosuite",
        "loginImageAlt": "ଲଗଇନ୍ ପ୍ରତିଛବି",
        "organisationName": "ସଂସ୍ଥା ନାମ",
        "branchName": "ଶାଖା ନାମ",
        "workingDate": "କାର୍ଯ୍ୟ ତାରିଖ",
        "processToDayBegin": "ଦିନ ଆରମ୍ଭ କରନ୍ତୁ",
        "logout": "ଲଗଆଉଟ୍",
        "designedBy": "ଡିଜାଇନ୍ ଏବଂ ବିକାଶ କରିଛନ୍ତି",
        "generalComputer": "General Computer",
        "failedToStartBusinessDay": "ବ୍ୟବସାୟିକ ଦିନ ଆରମ୍ଭ କରିବାରେ ବିଫଳ",
        "anErrorOccurred": "ଏକ ତ୍ରୁଟି ଘଟିଛି। ଦୟାକରି ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।",
    },
}


def ensure_auth_keys(text: str, lang: str) -> str:
    m = re.search(r"\n    auth:\s*\{", text)
    if not m:
        raise SystemExit(f"{lang}: auth missing")
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i
                block = text[m.start() : end]
                break
        i += 1
    extras = []
    for k, v in KEYS[lang].items():
        if re.search(rf"\n      {k}:", block):
            continue
        esc = v.replace("\\", "\\\\").replace('"', '\\"')
        extras.append(f'      {k}: "{esc}"')
    if not extras:
        print(f"{lang}: beginpage keys already present")
        return text
    prefix = text[:end].rstrip()
    if not prefix.endswith(","):
        prefix += ","
    print(f"{lang}: added {len(extras)} keys")
    return prefix + "\n" + ",\n".join(extras) + "\n    " + text[end:]


def wire_page():
    text = PAGE.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import { useLogout } from "@/container/navbar/Hooks";\n',
            'import { useLogout } from "@/container/navbar/Hooks";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "const BeginPage = () => {\n  const [loading, setLoading] = useState(false);",
            "const BeginPage = () => {\n  const { t } = useTranslation();\n  const [loading, setLoading] = useState(false);",
        )

    repls = [
        (
            'toast.error(\n          error.response.data?.details || "Failed to start business day",\n        );',
            'toast.error(\n          error.response.data?.details || t("auth.failedToStartBusinessDay"),\n        );',
        ),
        (
            'toast.error("An error occurred. Please try again.");',
            'toast.error(t("auth.anErrorOccurred"));',
        ),
        ('alt="Login Image"', 'alt={t("auth.loginImageAlt")}'),
        (
            """            <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-[600] mb-1 sm:mb-2 text-primary leading-tight">
              Welcome to{" "}
              <span className={cn("text-blue-500 italic font-libre font-bold")}>
                Priosuite
              </span>
            </h1>""",
            """            <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-[600] mb-1 sm:mb-2 text-primary leading-tight">
              {t("auth.welcomeTo")}{" "}
              <span className={cn("text-blue-500 italic font-libre font-bold")}>
                {t("auth.priosuite")}
              </span>
            </h1>""",
        ),
        (
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Organisation Name
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {orgName || "N/A"}
              </p>""",
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                {t("auth.organisationName")}
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {orgName || t("common.notAvailable")}
              </p>""",
        ),
        (
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Branch Name
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {branchName || "N/A"}
              </p>""",
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                {t("auth.branchName")}
              </p>
              <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800 truncate">
                {branchName || t("common.notAvailable")}
              </p>""",
        ),
        (
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                Working Date
              </p>""",
            """              <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                {t("auth.workingDate")}
              </p>""",
        ),
        (
            """              ) : (
                "Process To Day Begin"
              )}""",
            """              ) : (
                t("auth.processToDayBegin")
              )}""",
        ),
        (
            """            >
              Logout
            </button>""",
            """            >
              {t("auth.logout")}
            </button>""",
        ),
        (
            """        <p>
          Designed and Developed by{" "}
          <Link href="#" target="_blank" className="font-[500]">
            General Computer
          </Link>
        </p>""",
            """        <p>
          {t("auth.designedBy")}{" "}
          <Link href="#" target="_blank" className="font-[500]">
            {t("auth.generalComputer")}
          </Link>
        </p>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"OK: {old[:50]!r}")
    PAGE.write_text(text, encoding="utf-8")
    print("page done")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        path = LOC / f"{lang}.js"
        text = ensure_auth_keys(path.read_text(encoding="utf-8"), lang)
        path.write_text(text, encoding="utf-8")
    wire_page()
