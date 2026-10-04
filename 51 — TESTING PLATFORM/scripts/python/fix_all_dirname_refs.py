import os
import re

testing_dir = os.path.abspath("scripts/testing")
files = [f for f in os.listdir(testing_dir) if f.endswith(".mjs") or f.endswith(".js")]

modified_files = []

for fname in files:
    fpath = os.path.join(testing_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    orig = content

    # Ensure projectRoot is defined if needed
    needs_project_root = False
    
    # Pattern 1: path.join(__dirname, "src" ... or similar
    pattern1 = re.compile(r'path\.join\(\s*__dirname\s*,\s*(["\'](?:src|package\.json|docs|scripts|\.\./\.\./)[\'"])')
    if pattern1.search(content):
        needs_project_root = True

    # Pattern 2: path.join(__dirname, "src", ...
    pattern2 = re.compile(r'path\.join\(\s*__dirname\s*,\s*["\']src["\']')
    if pattern2.search(content):
        needs_project_root = True

    # Pattern 3: path.resolve(__dirname, "src" ...
    pattern3 = re.compile(r'path\.resolve\(\s*__dirname\s*,\s*["\']src["\']')
    if pattern3.search(content):
        needs_project_root = True

    # Pattern 4: path.join(__dirname, ".." ... if looking for root
    # Replace path.join(__dirname, "src", ...) with path.join(projectRoot, "src", ...)
    content = re.sub(r'path\.join\(\s*__dirname\s*,\s*(["\']src["\'])', r'path.join(projectRoot, \1)', content)
    content = re.sub(r'path\.join\(\s*__dirname\s*,\s*(["\']src/)', r'path.join(projectRoot, \1)', content)
    content = re.sub(r'path\.join\(\s*__dirname\s*,\s*(["\']package\.json["\'])', r'path.join(projectRoot, \1)', content)
    content = re.sub(r'path\.join\(\s*__dirname\s*,\s*(["\']docs/)', r'path.join(projectRoot, \1)', content)
    content = re.sub(r'path\.join\(\s*__dirname\s*,\s*(["\']docs["\'])', r'path.join(projectRoot, \1)', content)
    content = re.sub(r'path\.resolve\(\s*__dirname\s*,\s*(["\']src/)', r'path.resolve(projectRoot, \1)', content)

    if content != orig:
        # Check if projectRoot is already defined in content
        if "const projectRoot" not in content and "let projectRoot" not in content and "var projectRoot" not in content:
            # Add projectRoot declaration right after __dirname definition
            if "const __dirname = path.dirname(fileURLToPath(import.meta.url));" in content:
                content = content.replace(
                    "const __dirname = path.dirname(fileURLToPath(import.meta.url));",
                    "const __dirname = path.dirname(fileURLToPath(import.meta.url));\nconst projectRoot = path.resolve(__dirname, \"../..\");"
                )
            elif "const __dirname" in content:
                # After first const __dirname line
                content = re.sub(r'(const __dirname\s*=[^;]+;)', r'\1\nconst projectRoot = path.resolve(__dirname, "../../");', content, count=1)
            else:
                # Add at top after imports
                content = 'import { fileURLToPath } from "node:url";\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));\nconst projectRoot = path.resolve(__dirname, "../..");\n' + content
        
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        modified_files.append(fname)

print(f"Modified {len(modified_files)} files: {modified_files}")
