import ast
import importlib.util
from pathlib import Path

root = Path(r"C:\Users\prakul\Desktop\projects\mechamind-os\backend\app")
stdlib = set(__import__('sys').stdlib_module_names)
imports = set()
for path in root.rglob('*.py'):
    try:
        tree = ast.parse(path.read_text(encoding='utf-8'))
    except (SyntaxError, UnicodeDecodeError):
        continue
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(alias.name.split('.')[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.add(node.module.split('.')[0])
for name in sorted(imports - stdlib - {'app'}):
    print(f"{name}\t{'installed' if importlib.util.find_spec(name) else 'MISSING'}")
