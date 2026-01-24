
import json

try:
    with open('cartas_blancas.json', 'r', encoding='utf-8') as f:
        white = json.load(f)
    
    with open('cartas_negras.json', 'r', encoding='utf-8') as f:
        black = json.load(f)

    js_content = f"const CAH_WHITE = {json.dumps(white, ensure_ascii=False)};\n"
    js_content += f"const CAH_BLACK = {json.dumps(black, ensure_ascii=False)};\n"

    with open('cards.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print("cards.js created successfully")
except Exception as e:
    print(f"Error: {e}")
