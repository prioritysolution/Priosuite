# -*- coding: utf-8 -*-
"""Insert common + master i18n blocks into locale files."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "i18n" / "locales"

COMMON = {
    "en": """
    common: {
      buttons: {
        add: "Add",
        edit: "Edit",
        update: "Update",
        save: "Save",
        submit: "Submit",
        cancel: "Cancel",
      },
      actions: "Actions",
      serialNo: "Serial No",
      previous: "Previous",
      next: "Next",
      noResults: "No results.",
      search: "Search",
      select: "Select",
    },
""",
    "hi": """
    common: {
      buttons: {
        add: "जोड़ें",
        edit: "संपादित करें",
        update: "अपडेट करें",
        save: "सहेजें",
        submit: "सबमिट करें",
        cancel: "रद्द करें",
      },
      actions: "क्रियाएँ",
      serialNo: "क्रम संख्या",
      previous: "पिछला",
      next: "अगला",
      noResults: "कोई परिणाम नहीं।",
      search: "खोजें",
      select: "चुनें",
    },
""",
    "bn": """
    common: {
      buttons: {
        add: "যোগ করুন",
        edit: "সম্পাদনা করুন",
        update: "আপডেট করুন",
        save: "সংরক্ষণ করুন",
        submit: "জমা দিন",
        cancel: "বাতিল করুন",
      },
      actions: "কার্যক্রম",
      serialNo: "ক্রমিক নং",
      previous: "পূর্ববর্তী",
      next: "পরবর্তী",
      noResults: "কোনো ফলাফল পাওয়া যায়নি।",
      search: "অনুসন্ধান করুন",
      select: "নির্বাচন করুন",
    },
""",
    "or": """
    common: {
      buttons: {
        add: "ଯୋଡନ୍ତୁ",
        edit: "ସମ୍ପାଦନ କରନ୍ତୁ",
        update: "ଅପଡେଟ୍ କରନ୍ତୁ",
        save: "ସଂରକ୍ଷଣ କରନ୍ତୁ",
        submit: "ଦାଖଲ କରନ୍ତୁ",
        cancel: "ବାତିଲ୍ କରନ୍ତୁ",
      },
      actions: "କାର୍ଯ୍ୟ",
      serialNo: "କ୍ରମିକ ସଂଖ୍ୟା",
      previous: "ପୂର୍ବବର୍ତ୍ତୀ",
      next: "ପରବର୍ତ୍ତୀ",
      noResults: "କୌଣସି ଫଳାଫଳ ନାହିଁ।",
      search: "ଖୋଜନ୍ତୁ",
      select: "ଚୟନ କରନ୍ତୁ",
    },
""",
}

# master blocks loaded from sibling file content written below
MASTER_PATH = Path(__file__).with_name("master_locale_blocks.py")


def main():
    from master_locale_blocks import MASTER

    for lang in ("en", "hi", "bn", "or"):
        path = root / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        if "\n    master: {" in text or "\n    master:{" in text:
            print(f"skip master in {path.name}")
        else:
            needle = "    memberSearch:"
            if needle not in text:
                raise SystemExit(f"memberSearch missing in {path.name}")
            insert = COMMON[lang] + "\n" + MASTER[lang] + "\n"
            text = text.replace(needle, insert + needle, 1)
            path.write_text(text, encoding="utf-8")
            print(f"inserted master+common into {path.name}")


if __name__ == "__main__":
    main()
