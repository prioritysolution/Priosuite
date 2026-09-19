import os, re

BASE = r"c:\Users\Tanmay\OneDrive\Desktop\intern\bouth\priosuiteV2"
ROOTS = ["components", "container", "common"]
issues = []

for root in ROOTS:
    R = os.path.join(BASE, root)
    if not os.path.isdir(R):
        continue
    for dirpath, _, files in os.walk(R):
        for f in files:
            if not f.endswith((".jsx", ".js")):
                continue
            path = os.path.join(dirpath, f)
            text = open(path, encoding="utf-8").read()
            for m in re.finditer(
                r"(?m)^(?:export\s+default\s+function\s+(\w+)|(?:export\s+)?(?:const|function)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])*=>\s*\{|function\s+(\w+)\s*\([^)]*\)\s*\{)",
                text,
            ):
                name = m.group(1) or m.group(2) or m.group(3)
                start = m.end() - 1
                depth = 0
                i = start
                while i < len(text):
                    if text[i] == "{":
                        depth += 1
                    elif text[i] == "}":
                        depth -= 1
                        if depth == 0:
                            break
                    i += 1
                body = text[start : i + 1]
                code = "\n".join(
                    ln
                    for ln in body.splitlines()
                    if ln.strip() and not ln.strip().startswith("//")
                )
                if re.search(r"\bt\(\s*['\"]", code) and "useTranslation(" not in code:
                    issues.append((os.path.relpath(path, BASE), name))

for p, n in sorted(set(issues)):
    print(f"{p} :: {n}")
print("TOTAL", len(set(issues)))
