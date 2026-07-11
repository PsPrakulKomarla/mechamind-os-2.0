from pathlib import Path
import os

ROOTS = [
    Path(r"C:\Users\prakul\Desktop\projects\mechamind-os"),
    Path(r"C:\Users\prakul\Desktop\projects\meachamind os"),
]
EXCLUDED_DIRS = {'.git','node_modules','.next','dist','build','out','coverage','.cache','cache','__pycache__','.pytest_cache','.mypy_cache','.ruff_cache','.venv','venv','datasets','data','logs','media','uploads'}
EXCLUDED_SUFFIXES = {'.lock','.log','.png','.jpg','.jpeg','.gif','.webp','.mp4','.mov','.avi','.zip','.tar','.gz','.7z','.db','.sqlite','.sqlite3','.min.js','.min.css','.pyc'}
IMPORTANT = {'package.json','pyproject.toml','requirements.txt','requirements-dev.txt','poetry.lock','pdm.lock','pnpm-workspace.yaml','docker-compose.yml','docker-compose.yaml','README.md','.env.example','tsconfig.json','vite.config.ts','next.config.js','next.config.mjs','next.config.ts','angular.json','Cargo.toml','go.mod'}
for root in ROOTS:
    print(f"\n=== {root} ===")
    count = 0
    manifests = []
    files = []
    for base, dirs, names in os.walk(root):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS)
        for name in sorted(names):
            p = Path(base) / name
            rel = p.relative_to(root)
            suffix = ''.join(p.suffixes[-2:]) if name.endswith(('.min.js','.min.css')) else p.suffix.lower()
            if name in {'package-lock.json','yarn.lock','pnpm-lock.yaml'} or suffix in EXCLUDED_SUFFIXES:
                continue
            try: size = p.stat().st_size
            except OSError: continue
            if size > 500_000:
                continue
            entry = f"{rel.as_posix()}\t{size}"
            files.append(entry)
            if name in IMPORTANT or name.lower().startswith('readme'):
                manifests.append(entry)
    print("-- manifests/config --")
    print('\n'.join(manifests[:80]) or '(none)')
    print(f"-- source inventory ({len(files)} files; capped display) --")
    print('\n'.join(files[:300]))
