# -*- coding: utf-8 -*-
"""Add missing useTranslation() hooks to master components that use t()."""
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "master"
HOOK = "  const { t } = useTranslation();\n"


def needs_hook(text: str) -> bool:
    if "useTranslation()" in text:
        return False
    return bool(re.search(r'\bt\(["\']', text))


def insert_hook(text: str) -> str:
    # Find last `}) => {` or `) => {` that belongs to a Capitalized component
    matches = list(re.finditer(r"const\s+([A-Z]\w*)\s*=\s*\([^)]*\)\s*=>\s*\{", text, re.S))
    # Multline props: const Name = ({ ... }) => {
    matches2 = list(
        re.finditer(r"const\s+([A-Z]\w*)\s*=\s*\(\{[\s\S]*?\}\)\s*=>\s*\{", text)
    )
    # Prefer the longer/more specific match
    all_m = matches + matches2
    if not all_m:
        # try simpler: first `}) => {` after Capitalized const
        m = re.search(r"const\s+[A-Z]\w*\s*=\s*\(\{", text)
        if not m:
            raise SystemExit("no component found")
        # find matching }) => {
        idx = text.find("}) => {", m.start())
        if idx < 0:
            idx = text.find(") => {", m.start())
            insert_at = idx + len(") => {")
        else:
            insert_at = idx + len("}) => {")
        return text[:insert_at] + "\n" + HOOK + text[insert_at:]

    # use the first capitalized component that uses t in its vicinity
    for m in sorted(all_m, key=lambda x: x.start()):
        insert_at = m.end()
        return text[:insert_at] + "\n" + HOOK + text[insert_at:]
    return text


def main():
    for path in root.rglob("*.jsx"):
        text = path.read_text(encoding="utf-8")
        # skip if only commented t(
        active = "\n".join(
            ln for ln in text.splitlines() if not ln.strip().startswith("//")
        )
        if not needs_hook(active):
            continue
        # Special: passbook has hook already in active
        if "const { t } = useTranslation();" in active:
            continue
        try:
            new = insert_hook(text)
        except SystemExit as e:
            print("FAIL", path, e)
            continue
        path.write_text(new, encoding="utf-8")
        print("added hook", path.relative_to(root))


if __name__ == "__main__":
    main()
