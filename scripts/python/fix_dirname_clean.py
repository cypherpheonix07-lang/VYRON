import os
import re

testing_dir = os.path.abspath("scripts/testing")

for fname in os.listdir(testing_dir):
    if not (fname.endswith(".mjs") or fname.endswith(".js")):
        continue
    fpath = os.path.join(testing_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    orig = content

    # Replace path.join(__dirname, ...) with path.join(projectRoot, ...)
    # when the first argument after __dirname is "src", 'src', "package.json", "docs", etc.
    # We do a simple exact replacement: path.join(__dirname, -> path.join(projectRoot,
    # and path.resolve(__dirname, -> path.resolve(projectRoot,
    # EXCEPT where __dirname is resolving projectRoot itself!
    lines = content.splitlines(keepends=True)
    new_lines = []
    has_project_root_def = any("const projectRoot" in l or "let projectRoot" in l for l in lines)
    changed = False

    for line in lines:
        if "projectRoot = path.resolve(__dirname" in line or "projectRoot = path.join(__dirname" in line:
            new_lines.append(line)
            continue
        # If line has path.join(__dirname, or path.resolve(__dirname,
        if 'path.join(__dirname,' in line or 'path.join(__dirname ,' in line:
            new_line = re.sub(r'path\.join\(\s*__dirname\s*,', 'path.join(projectRoot,', line)
            new_lines.append(new_line)
            changed = True
        elif 'path.resolve(__dirname,' in line or 'path.resolve(__dirname ,' in line:
            # check if it is resolving src or docs
            if '"src"' in line or "'src'" in line or '"src/' in line or "'src/" in line:
                new_line = re.sub(r'path\.resolve\(\s*__dirname\s*,', 'path.resolve(projectRoot,', line)
                new_lines.append(new_line)
                changed = True
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if changed:
        new_content = "".join(new_lines)
        if not has_project_root_def:
            # Insert projectRoot right after __dirname definition
            if "const __dirname = path.dirname(fileURLToPath(import.meta.url));" in new_content:
                new_content = new_content.replace(
                    "const __dirname = path.dirname(fileURLToPath(import.meta.url));",
                    "const __dirname = path.dirname(fileURLToPath(import.meta.url));\nconst projectRoot = path.resolve(__dirname, \"../..\");"
                )
            elif "const __dirname" in new_content:
                new_content = re.sub(
                    r'(const __dirname\s*=[^;]+;)',
                    r'\1\nconst projectRoot = path.resolve(__dirname, "../../");',
                    new_content,
                    count=1
                )
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {fname}")
