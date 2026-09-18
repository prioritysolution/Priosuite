# -*- coding: utf-8 -*-
"""Insert flat loan: { ... } into i18n/locales/{en,hi,bn,or}.js before memberSearch."""
from pathlib import Path
import json
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
LOCALE_DIR = ROOT / "i18n" / "locales"

spec = importlib.util.spec_from_file_location(
    "loan_i18n_data", Path(__file__).with_name("loan_i18n_data.py")
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def fmt(data, level=1):
    pad = " " * (4 * level)
    pad2 = " " * (4 * (level + 1))
    if isinstance(data, dict):
        lines = ["{"]
        items = list(data.items())
        for i, (k, v) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            lines.append(f"{pad2}{k}: {fmt(v, level + 1)}{comma}")
        lines.append(pad + "}")
        return "\n".join(lines)
    return json.dumps(data, ensure_ascii=False)


def insert_loan(text: str, loan_obj: dict) -> str:
    marker = "    memberSearch: {"
    block = f"    loan: {fmt(loan_obj, 1)},\n\n"
    if "    loan: {" in text:
        # replace existing loan block
        start = text.find("    loan: {")
        # brace match
        i = text.find("{", start)
        depth = 0
        j = i
        while j < len(text):
            if text[j] == "{":
                depth += 1
            elif text[j] == "}":
                depth -= 1
                if depth == 0:
                    # include trailing comma/newlines
                    end = j + 1
                    while end < len(text) and text[end] in " \t":
                        end += 1
                    if end < len(text) and text[end] == ",":
                        end += 1
                    while end < len(text) and text[end] in "\r\n":
                        end += 1
                        break
                    return text[:start] + block + text[end:]
        raise SystemExit("unclosed loan block")
    if marker in text:
        return text.replace(marker, block + marker, 1)
    # before closing of translation
    close = text.rfind("  },\n};")
    if close < 0:
        close = text.rfind("  }\n};")
    if close < 0:
        raise SystemExit("cannot find insertion point")
    return text[:close] + ",\n" + block + text[close:]


def main():
    _, by_lang = mod.get_maps()
    for lang, data in by_lang.items():
        path = LOCALE_DIR / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        text = insert_loan(text, data)
        path.write_text(text, encoding="utf-8")
        print("inserted loan into", path.name, "keys", len(data) - 1, "+ print", len(data.get("print", {})))


if __name__ == "__main__":
    main()
