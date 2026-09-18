# -*- coding: utf-8 -*-
"""Insert createUser locales and wire tools/createUser component."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "tools" / "createUser" / "index.jsx"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


CREATE_USER = {
    "en": {
        "createUser": "Create User",
        "addUser": "Add User",
        "addNewUser": "Add New User",
        "enterName": "Enter name",
        "enterEmail": "Enter email",
        "enterMobile": "Enter mobile",
        "enterPassword": "Enter password",
        "confirmPassword": "Confirm Password",
        "enterConfirmPassword": "Enter confirm password",
        "userRole": "User Role",
        "selectRole": "Select role",
        "searchRole": "Search role...",
    },
    "hi": {
        "createUser": "उपयोगकर्ता बनाएं",
        "addUser": "उपयोगकर्ता जोड़ें",
        "addNewUser": "नया उपयोगकर्ता जोड़ें",
        "enterName": "नाम दर्ज करें",
        "enterEmail": "ईमेल दर्ज करें",
        "enterMobile": "मोबाइल दर्ज करें",
        "enterPassword": "पासवर्ड दर्ज करें",
        "confirmPassword": "पासवर्ड की पुष्टि करें",
        "enterConfirmPassword": "पुष्टि पासवर्ड दर्ज करें",
        "userRole": "उपयोगकर्ता भूमिका",
        "selectRole": "भूमिका चुनें",
        "searchRole": "भूमिका खोजें...",
    },
    "bn": {
        "createUser": "ব্যবহারকারী তৈরি করুন",
        "addUser": "ব্যবহারকারী যোগ করুন",
        "addNewUser": "নতুন ব্যবহারকারী যোগ করুন",
        "enterName": "নাম লিখুন",
        "enterEmail": "ইমেল লিখুন",
        "enterMobile": "মোবাইল লিখুন",
        "enterPassword": "পাসওয়ার্ড লিখুন",
        "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
        "enterConfirmPassword": "নিশ্চিত পাসওয়ার্ড লিখুন",
        "userRole": "ব্যবহারকারীর ভূমিকা",
        "selectRole": "ভূমিকা নির্বাচন করুন",
        "searchRole": "ভূমিকা অনুসন্ধান করুন...",
    },
    "or": {
        "createUser": "ବ୍ୟବହାରକାରୀ ସୃଷ୍ଟି କରନ୍ତୁ",
        "addUser": "ବ୍ୟବହାରକାରୀ ଯୋଡନ୍ତୁ",
        "addNewUser": "ନୂତନ ବ୍ୟବହାରକାରୀ ଯୋଡନ୍ତୁ",
        "enterName": "ନାମ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterEmail": "ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterMobile": "ମୋବାଇଲ୍ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterPassword": "ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ",
        "confirmPassword": "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "enterConfirmPassword": "ନିଶ୍ଚିତ ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ",
        "userRole": "ବ୍ୟବହାରକାରୀ ଭୂମିକା",
        "selectRole": "ଭୂମିକା ଚୟନ କରନ୍ତୁ",
        "searchRole": "ଭୂମିକା ଖୋଜନ୍ତୁ...",
    },
}

COMMON_EXTRA = {
    "en": {
        "name": "Name",
        "email": "Email",
        "mobile": "Mobile",
        "password": "Password",
        "role": "Role",
        "mail": "Mail",
        "serialNo": "Serial No.",
    },
    "hi": {
        "name": "नाम",
        "email": "ईमेल",
        "mobile": "मोबाइल",
        "password": "पासवर्ड",
        "role": "भूमिका",
        "mail": "मेल",
        "serialNo": "क्रमांक",
    },
    "bn": {
        "name": "নাম",
        "email": "ইমেল",
        "mobile": "মোবাইল",
        "password": "পাসওয়ার্ড",
        "role": "ভূমিকা",
        "mail": "মেইল",
        "serialNo": "ক্রমিক নং",
    },
    "or": {
        "name": "ନାମ",
        "email": "ଇମେଲ୍",
        "mobile": "ମୋବାଇଲ୍",
        "password": "ପାସୱାର୍ଡ",
        "role": "ଭୂମିକା",
        "mail": "ମେଲ୍",
        "serialNo": "କ୍ରମିକ ନମ୍ବର",
    },
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    if bank < 0:
        raise SystemExit("bank: not found")
    common_start = text.rfind("\n    common: {", 0, bank)
    if common_start < 0:
        raise SystemExit("bank-era common not found")
    body_start = common_start + len("\n    common: {")
    pre = text[body_start:bank]
    inner_end = pre.rfind("\n    },")
    body = pre[:inner_end]
    adds = []
    for k, v in extras.items():
        if re.search(rf"\n      {re.escape(k)}:", body):
            continue
        esc = v.replace("\\", "\\\\").replace('"', '\\"')
        adds.append(f'      {k}: "{esc}"')
    if not adds:
        return text
    body = body.rstrip()
    if body and not body.endswith(","):
        body += ","
    body = body + "\n" + ",\n".join(adds) + "\n"
    return text[:body_start] + body + pre[inner_end:] + text[bank:]


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

    if re.search(r"\n    createUser:\s*\{", text):
        print(f"{lang}: createUser already present")
    else:
        block = (
            "    createUser: {\n"
            + js_obj(CREATE_USER[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("userRole", "report"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted createUser after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common extras")
        text = text2
    else:
        print(f"{lang}: common ok")

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
            "const CreateUser = ({ loading, form, handleSubmit, showForm, setShowForm }) => {\n  const userData",
            'const CreateUser = ({ loading, form, handleSubmit, showForm, setShowForm }) => {\n  const { t } = useTranslation();\n\n  const userData',
            1,
        )

    repls = [
        (
            '<h3 className="text-2xl font-semibold ">Create User</h3>',
            '<h3 className="text-2xl font-semibold ">\n          {t("createUser.createUser")}\n        </h3>',
        ),
        (
            '<Button className="">Add User</Button>',
            '<Button className="">{t("createUser.addUser")}</Button>',
        ),
        (
            """                  <DialogTitle className="text-center">
                    Add New User
                  </DialogTitle>""",
            """                  <DialogTitle className="text-center">
                    {t("createUser.addNewUser")}
                  </DialogTitle>""",
        ),
        (
            """                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />""",
            """                          <FormLabel>{t("common.name")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("createUser.enterName")}
                              {...field}
                            />""",
        ),
        (
            """                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email"
                              {...field}
                            />""",
            """                          <FormLabel>{t("common.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("createUser.enterEmail")}
                              {...field}
                            />""",
        ),
        (
            """                          <FormLabel>Mobile</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter mobile" {...field} />""",
            """                          <FormLabel>{t("common.mobile")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("createUser.enterMobile")}
                              {...field}
                            />""",
        ),
        (
            """                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />""",
            """                          <FormLabel>{t("common.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("createUser.enterPassword")}
                              {...field}
                            />""",
        ),
        (
            """                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter confirm password"
                              {...field}
                            />""",
            """                          <FormLabel>
                            {t("createUser.confirmPassword")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t(
                                "createUser.enterConfirmPassword"
                              )}
                              {...field}
                            />""",
        ),
        ('label="User Role"', 'label={t("createUser.userRole")}'),
        ('placeholder="Select role"', 'placeholder={t("createUser.selectRole")}'),
        (
            'searchPlaceholder="Search role..."',
            'searchPlaceholder={t("createUser.searchRole")}',
        ),
        (
            """                    <Button type="submit" className="w-full">
                      Add
                    </Button>""",
            """                    <Button type="submit" className="w-full">
                      {t("common.add")}
                    </Button>""",
        ),
        (
            """                    <TableHead className="w-[100px] text-center">
                      Serial No.
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mail</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Role</TableHead>""",
            """                    <TableHead className="w-[100px] text-center">
                      {t("common.serialNo")}
                    </TableHead>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.mail")}</TableHead>
                    <TableHead>{t("common.mobile")}</TableHead>
                    <TableHead>{t("common.role")}</TableHead>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("MISSING:", repr(old[:100]))
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
