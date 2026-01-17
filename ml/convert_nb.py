import json
import re

notebook_path = 'lstm_crop_yield_prediction (1).ipynb'
output_path = 'train_model.py'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

code_lines = []
for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        source = cell['source']
        for line in source:
            # Remove full line comments
            if line.strip().startswith('#'):
                continue
            
            # Remove magic commands
            if line.strip().startswith('%') or line.strip().startswith('!'):
                continue
            
            # Remove display() and fig.show() calls (simple check)
            if 'display(' in line or 'fig.show(' in line:
                continue
            
            # Ensure nice spacing (add newline if missing, though typically source lines have \n)
            if not line.endswith('\n'):
                line += '\n'
            
            code_lines.append(line)
        code_lines.append('\n') # Separate cells

with open(output_path, 'w', encoding='utf-8') as f:
    f.writelines(code_lines)

print(f"Created {output_path}")
