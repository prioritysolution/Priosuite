# -*- coding: utf-8 -*-
"""Add investmentInterest keys into investment + common."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

INV_EXTRA = {
    "en": {
        "interestPosting": "Interest Posting",
        "selectAccountNo": "Select account no.",
        "searchAccountNo": "Search account no....",
        "interestDate": "Interest Date",
        "interestAmount": "Interest Amount",
        "enterInterestAmount": "Enter interest amount",
    },
    "hi": {
        "interestPosting": "ब्याज पोस्टिंग",
        "selectAccountNo": "खाता संख्या चुनें",
        "searchAccountNo": "खाता संख्या खोजें....",
        "interestDate": "ब्याज दिनांक",
        "interestAmount": "ब्याज राशि",
        "enterInterestAmount": "ब्याज राशि दर्ज करें",
    },
    "bn": {
        "interestPosting": "সুদ পোস্টিং",
        "selectAccountNo": "অ্যাকাউন্ট নম্বর নির্বাচন করুন",
        "searchAccountNo": "অ্যাকাউন্ট নম্বর খুঁজুন....",
        "interestDate": "সুদের তারিখ",
        "interestAmount": "সুদের পরিমাণ",
        "enterInterestAmount": "সুদের পরিমাণ লিখুন",
    },
    "or": {
        "interestPosting": "ସୁଧ ପୋଷ୍ଟିଂ",
        "selectAccountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର ବାଛନ୍ତୁ",
        "searchAccountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର ଖୋଜନ୍ତୁ....",
        "interestDate": "ସୁଧ ତାରିଖ",
        "interestAmount": "ସୁଧ ରାଶି",
        "enterInterestAmount": "ସୁଧ ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
    },
}

COMMON_EXTRA = {
    "en": {
        "refVouchNo": "Ref. Vouch No.",
        "enterRefVouchNo": "Enter ref. vouch no.",
    },
    "hi": {
        "refVouchNo": "संदर्भ वाउचर संख्या",
        "enterRefVouchNo": "संदर्भ वाउचर संख्या दर्ज करें",
    },
    "bn": {
        "refVouchNo": "রেফারেন্স ভাউচার নম্বর",
        "enterRefVouchNo": "রেফারেন্স ভাউচার নম্বর লিখুন",
    },
    "or": {
        "refVouchNo": "ରେଫରେନ୍ସ ଭାଉଚର ନମ୍ବର",
        "enterRefVouchNo": "ରେଫରେନ୍ସ ଭାଉଚର ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
    },
}


def insert_into_block(t, block_name, next_sibling_names, extras, lang):
    """Insert missing keys inside `block_name` before its closing `},`."""
    idx = t.rfind(f"    {block_name}: {{")
    if idx < 0:
        raise SystemExit(f"{lang}: {block_name} not found")
    # find end: next sibling at same indent, or translation close
    end = -1
    for sib in next_sibling_names:
        pos = t.find(f"\n    {sib}:", idx + 1)
        if pos > 0 and (end < 0 or pos < end):
            end = pos
    if end < 0:
        end = t.find("\n  },", idx)
    section = t[idx:end]
    close = section.rfind("\n    },")
    if close < 0:
        # block may end without trailing comma before sibling
        close = section.rfind("\n    }")
    if close < 0:
        raise SystemExit(f"{lang}: {block_name} close not found")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added = []
    for k, v in extras[lang].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added.append(k)
    # preserve whether original close had comma
    close_token = section[close : close + 7]  # \n    },
    if not close_token.startswith("\n    }"):
        close_token = "\n    },"
    elif "," not in close_token and section[close:].lstrip().startswith("}"):
        # check if next char after } is comma
        rest = section[close:].lstrip()
        close_token = "\n    }," if rest.startswith("},") else "\n    }"
        # actually for investment we want trailing comma usually
        if end > 0 and t[end : end + 10].strip().startswith(("voucher", "bank", "provision", "adjustment", "investment")) is False:
            pass
        close_token = "\n    }," if section[close:].find("},") == section[close:].find("}") else "\n    }"
        # simpler: always use }, if there is a sibling after
        close_token = "\n    }," if end > 0 and t[end:].lstrip()[:1] != "}" else "\n    }"
        if t[end:end+2] == "\n " or t[end:].startswith("\n    "):
            close_token = "\n    },"
    new_section = before + "    },"
    # If original had no comma and end is translation close, keep no comma
    if end > 0 and t[end:].startswith("\n  },"):
        new_section = before.rstrip().rstrip(",") + "\n    }"
    return t[:idx] + new_section + t[end:], added


for name in ["en", "hi", "bn", "or"]:
    p = LOC / f"{name}.js"
    t = p.read_text(encoding="utf-8")

    # common: last common before bank
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    section = t[idx:end]
    close = section.rfind("\n    },")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added_c = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added_c.append(k)
    t = t[:idx] + before + "    }," + t[end:]
    print(name, "common+", added_c)

    # investment block
    idx = t.rfind("    investment: {")
    # find next sibling after investment
    end = -1
    for sib in ["opening", "master", "membership", "deposit", "loan", "voucher", "provision"]:
        pass
    # investment is near end - look for next `    word: {` or translation close
    m = re.search(r"\n    investment: \{", t)
    if not m:
        raise SystemExit(f"{name}: investment missing")
    idx = m.start() + 1  # start at '    investment'
    # find closing of investment: from idx, brace match
    brace = 0
    i = t.find("{", idx)
    start_body = i
    for j in range(i, len(t)):
        if t[j] == "{":
            brace += 1
        elif t[j] == "}":
            brace -= 1
            if brace == 0:
                end_brace = j
                break
    else:
        raise SystemExit(f"{name}: investment brace fail")
    # include trailing comma if present
    end = end_brace + 1
    if end < len(t) and t[end] == ",":
        end += 1
    section = t[idx:end]
    # insert before final }
    close = section.rfind("}")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(",") and not lines[-1].strip().endswith("{"):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added_i = []
    for k, v in INV_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added_i.append(k)
    trailing = "," if section.rstrip().endswith(",") or (end < len(t) and t[end:end+1] != "\n") else ""
    # keep comma after investment if original had it
    had_comma = section.rstrip().endswith(",")
    new_section = before.rstrip().rstrip(",") + "\n    }" + ("," if had_comma else "")
    t = t[:idx] + new_section + t[end:]
    print(name, "investment+", added_i)

    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
