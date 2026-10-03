import os

testing_dir = os.path.abspath("scripts/testing")
root_dir = os.path.abspath(".")

verify_files = [f for f in os.listdir(testing_dir) if f.startswith("verify-") and f.endswith(".mjs")]

created = []
for fname in verify_files:
    target_path = os.path.join(root_dir, fname)
    content = f'import "./scripts/testing/{fname}";\n'
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(content)
    created.append(fname)

print(f"Created {len(created)} root proxy forwarders for verify scripts.")
