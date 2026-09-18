# -*- coding: utf-8 -*-
"""Fix useTranslation hook wrongly inserted inside props destructuring."""
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "master"

HOOK = "  const { t } = useTranslation();\n"

pattern = re.compile(
    r"const\s+(\w+)\s*=\s*\(\{\s*\n\s*const \{ t \} = useTranslation\(\);\s*\n\s*",
    re.M,
)


def fix_text(text: str) -> str:
    # Remove misplaced hooks inside ({ ... }) => {
    # Strategy: for each match of "const Name = ({\n  const { t } = useTranslation();\n"
    # remove the hook line from inside props, then insert after "}) => {" or ") => {"

    def replacer(m):
        name = m.group(1)
        # return opening without hook
        return f"const {name} = ({{\n  "

    new_text, n = pattern.subn(replacer, text)
    if n == 0:
        # also handle single-line props: const X = ({\n  const { t }...\n loading }) =>
        pass

    # Now insert hook after each component that uses t( but missing hook in body
    # Find functions that use t( and ensure hook after ) => {
    # Simpler: after removing, for every `}) => {` or `) => {` of components that contain t("
    # insert hook if not present in first 200 chars of body

    # Re-scan: whenever we see `= ({` ... `}) => {` without hook immediately after, and body uses t(
    # Actually after pattern.sub, hooks are removed. Insert after `}) => {` / `loading }) => {` etc.

    # Insert after arrow function body open when file uses t( and component lacks hook right after
    parts = []
    i = 0
    while True:
        m = re.search(r"\)\s*=>\s*\{", new_text[i:])
        if not m:
            parts.append(new_text[i:])
            break
        abs_start = i + m.start()
        abs_end = i + m.end()
        parts.append(new_text[i:abs_end])
        # look ahead 80 chars
        ahead = new_text[abs_end : abs_end + 80]
        # only insert if this looks like a React component (has return soon) and uses t nearby
        # and hook not already there
        if "useTranslation()" not in ahead:
            # check if remaining function body (until next top-level const/export) uses t(
            # heuristic: next 3000 chars
            body_snip = new_text[abs_end : abs_end + 4000]
            if 't("' in body_snip or "t('" in body_snip:
                # don't insert into nested arrows that aren't components - prefer capital function name before
                before = new_text[max(0, abs_start - 80) : abs_start]
                if re.search(r"const\s+[A-Z]\w*\s*=", before):
                    parts.append("\n" + HOOK)
        i = abs_end
    return "".join(parts)


def fix_passbook(path: Path):
    """Rewrite passbookSettings active component header cleanly."""
    text = path.read_text(encoding="utf-8")
    # Fix the broken commented header at top
    broken = '''import { useTranslation } from "react-i18next";
// "use client";

// import DropdownField from "@/common/formFields/DropdownField";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import InputField from "@/common/formFields/InputField";
// import { useSelector } from "react-redux";
// import { ClipLoader } from "react-spinners";

// const PassbookSettings = ({
  const { t } = useTranslation();
 loading, form, handleSubmit }) => {
'''
    fixed_head = '''// "use client";

// import DropdownField from "@/common/formFields/DropdownField";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import InputField from "@/common/formFields/InputField";
// import { useSelector } from "react-redux";
// import { ClipLoader } from "react-spinners";

// const PassbookSettings = ({
//   loading, form, handleSubmit }) => {
'''
    if broken in text:
        text = text.replace(broken, fixed_head)
    # Ensure active component has import + hook
    if 'import { useTranslation } from "react-i18next";' not in text.split('"use client"')[-1][:500] if '"use client"' in text else True:
        # find active "use client";
        idx = text.find('\n"use client";')
        if idx < 0:
            idx = text.find('"use client";')
        if idx >= 0:
            # after use client line
            nl = text.find("\n", idx)
            if 'useTranslation' not in text[nl : nl + 200]:
                text = text[: nl + 1] + '\nimport { useTranslation } from "react-i18next";\n' + text[nl + 1 :]
    # ensure hook in active PassbookSettings
    active = 'const PassbookSettings = ({ loading, form, handleSubmit }) => {'
    if active in text and "useTranslation()" not in text[text.find(active) : text.find(active) + 120]:
        text = text.replace(
            active,
            active + "\n  const { t } = useTranslation();",
            1,
        )
    path.write_text(text, encoding="utf-8")
    print("fixed passbook")


def main():
    fix_passbook(root / "passbookSettings" / "index.jsx")
    for path in root.rglob("*.jsx"):
        if path.name == "index.jsx" and "passbookSettings" in str(path):
            continue  # already handled specially; still run fix_text for active part
        text = path.read_text(encoding="utf-8")
        if "const { t } = useTranslation();" not in text:
            continue
        # detect broken: hook appears before `}) =>` on same props block
        if re.search(
            r"\(\{\s*\n\s*const \{ t \} = useTranslation\(\);",
            text,
        ):
            new = fix_text(text)
            path.write_text(new, encoding="utf-8")
            print("fixed", path.relative_to(root))
        else:
            # passbook may still need active hook
            if "passbookSettings" in str(path):
                new = fix_text(text)
                if new != text:
                    path.write_text(new, encoding="utf-8")
                    print("fixed", path.relative_to(root))


if __name__ == "__main__":
    main()
