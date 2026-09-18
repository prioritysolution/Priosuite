# -*- coding: utf-8 -*-
"""Insert userRole locales and wire tools/userRole component."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "tools" / "userRole" / "index.jsx"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


USER_ROLE = {
    "en": {
        "userRole": "User Role",
        "user": "User",
        "selectUser": "Select user",
        "searchUser": "Search user...",
        "selectRole": "Select Role",
    },
    "hi": {
        "userRole": "उपयोगकर्ता भूमिका",
        "user": "उपयोगकर्ता",
        "selectUser": "उपयोगकर्ता चुनें",
        "searchUser": "उपयोगकर्ता खोजें...",
        "selectRole": "भूमिका चुनें",
    },
    "bn": {
        "userRole": "ব্যবহারকারীর ভূমিকা",
        "user": "ব্যবহারকারী",
        "selectUser": "ব্যবহারকারী নির্বাচন করুন",
        "searchUser": "ব্যবহারকারী অনুসন্ধান করুন...",
        "selectRole": "ভূমিকা নির্বাচন করুন",
    },
    "or": {
        "userRole": "ବ୍ୟବହାରକାରୀ ଭୂମିକା",
        "user": "ବ୍ୟବହାରକାରୀ",
        "selectUser": "ବ୍ୟବହାରକାରୀ ଚୟନ କରନ୍ତୁ",
        "searchUser": "ବ୍ୟବହାରକାରୀ ଖୋଜନ୍ତୁ...",
        "selectRole": "ଭୂମିକା ଚୟନ କରନ୍ତୁ",
    },
}


def insert_after_top_block(text: str, block_name: str, new_block: str) -> str:
    """Insert after a 4-space top-level translation sibling like report:."""
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

    if re.search(r"\n    userRole:\s*\{", text):
        print(f"{lang}: userRole already present")
    else:
        block = (
            "    userRole: {\n"
            + js_obj(USER_ROLE[lang], indent=6)
            + "\n    },"
        )
        text = insert_after_top_block(text, "report", block)
        print(f"{lang}: inserted userRole after report")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_component():
    t = COMP.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { useSelector } from "react-redux";\n',
            'import { useSelector } from "react-redux";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "}) => {\n  const userListData = useSelector((state) => state?.userRole?.userData);",
            "}) => {\n  const { t } = useTranslation();\n\n  const userListData = useSelector((state) => state?.userRole?.userData);",
            1,
        )

    repls = [
        (
            '<h3 className="text-2xl font-semibold ">User Role</h3>',
            '<h3 className="text-2xl font-semibold ">\n          {t("userRole.userRole")}\n        </h3>',
        ),
        ('label="User"', 'label={t("userRole.user")}'),
        ('placeholder="Select user"', 'placeholder={t("userRole.selectUser")}'),
        (
            'searchPlaceholder="Search user..."',
            'searchPlaceholder={t("userRole.searchUser")}',
        ),
        (
            """                    >
                      Add
                    </Button>""",
            """                    >
                      {t("common.add")}
                    </Button>""",
        ),
        (
            '<h3 className="font-semibold text-lg pb-5">Select Role</h3>',
            '<h3 className="font-semibold text-lg pb-5">\n                      {t("userRole.selectRole")}\n                    </h3>',
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("OK:", old[:50].replace("\n", " "))

    COMP.write_text(t, encoding="utf-8")
    print("component done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_component()


if __name__ == "__main__":
    main()
