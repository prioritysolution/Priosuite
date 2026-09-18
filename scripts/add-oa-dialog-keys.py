# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "i18n" / "locales"
inserts = {
    "en": """        heading: \"Operational Area — {{name}}\",
        addItem: \"Add {{name}}\",
        dialogUpdate: \"Update the selected {{name}} details below.\",
        dialogAdd: \"Fill in the details to add a new {{name}}.\",
""",
    "hi": """        heading: \"परिचालन क्षेत्र — {{name}}\",
        addItem: \"{{name}} जोड़ें\",
        dialogUpdate: \"नीचे चयनित {{name}} विवरण अपडेट करें।\",
        dialogAdd: \"नया {{name}} जोड़ने के लिए विवरण भरें।\",
""",
    "bn": """        heading: \"অপারেশনাল এরিয়া — {{name}}\",
        addItem: \"{{name}} যোগ করুন\",
        dialogUpdate: \"নীচে নির্বাচিত {{name}} বিবরণ আপডেট করুন।\",
        dialogAdd: \"নতুন {{name}} যোগ করতে বিবরণ পূরণ করুন।\",
""",
    "or": """        heading: \"ଅପରେସନାଲ୍ ଏରିଆ — {{name}}\",
        addItem: \"{{name}} ଯୋଡନ୍ତୁ\",
        dialogUpdate: \"ନିମ୍ନରେ ଚୟନିତ {{name}} ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ।\",
        dialogAdd: \"ନୂଆ {{name}} ଯୋଡିବା ପାଇଁ ବିବରଣୀ ପୁରଣ କରନ୍ତୁ।\",
""",
}

for lang, block in inserts.items():
    path = root / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    i = text.find("      operationalArea: {")
    title_end = text.find("\n", text.find("title:", i)) + 1
    oa_end = text.find("passbookSettings:", i)
    if "heading:" in text[i:oa_end]:
        print("skip", lang)
        continue
    text = text[:title_end] + block + text[title_end:]
    path.write_text(text, encoding="utf-8")
    print("ok", lang)
