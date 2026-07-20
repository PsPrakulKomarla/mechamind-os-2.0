import urllib.request
import json
import os

req = urllib.request.Request("https://openrouter.ai/api/v1/models")
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    free_models = [m["id"] for m in data["data"] if "free" in m["id"].lower()]
    
    # Prefer llama or mistral
    good_model = None
    for m in free_models:
        if "llama" in m.lower() or "mistral" in m.lower():
            good_model = m
            break
    
    if not good_model and free_models:
        good_model = free_models[0]
        
    print("SELECTED_MODEL:", good_model)
    
    # Update .env
    with open(".env", "r") as f:
        content = f.read()
    
    import re
    content = re.sub(r'LLM_MODEL=.*', f'LLM_MODEL={good_model}', content)
    
    with open(".env", "w") as f:
        f.write(content)
