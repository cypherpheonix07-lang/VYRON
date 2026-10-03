import os
import glob
import re

TEST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "testing")
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

test_files = glob.glob(os.path.join(TEST_DIR, "verify-*.mjs"))
print(f"Total verify-*.mjs files found: {len(test_files)}")

modified_count = 0
for fpath in test_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    orig_content = content

    # Check if projectRoot is already defined
    has_project_root = "const projectRoot" in content

    # Patterns to fix
    # If path.join(__dirname, "src/...") is used
    if 'path.join(__dirname, "src/' in content or "path.join(__dirname, 'src/" in content or 'path.join(__dirname, "src",' in content or 'path.join(__dirname, relPath)' in content:
        if not has_project_root:
            # Insert projectRoot right after const __dirname = path.dirname(__filename);
            content = re.sub(
                r'(const __dirname = path\.dirname\(__filename\);)',
                r'\1\nconst projectRoot = path.resolve(__dirname, "../..");',
                content
            )
        
        # Replace occurrences of path.join(__dirname, "src/...") with path.join(projectRoot, "src/...")
        content = content.replace('path.join(__dirname, "src/', 'path.join(projectRoot, "src/')
        content = content.replace("path.join(__dirname, 'src/", "path.join(projectRoot, 'src/")
        content = content.replace('path.join(__dirname, "src",', 'path.join(projectRoot, "src",')
        content = content.replace('path.join(__dirname, relPath)', 'path.join(projectRoot, relPath)')

    if content != orig_content:
        with open(fpath, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print(f"Fixed: {os.path.basename(fpath)}")
        modified_count += 1

print(f"\nTotal files updated: {modified_count}")
