import sys
with open('c:/e-lapak/app/pages/dashboard.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('class="p-5 card border flex flex-col gap-4" style="max-width: 36rem; display: flex; flex-direction: column; gap: 1rem;"', 'class="p-3 card border flex flex-col gap-2" style="max-width: 36rem; display: flex; flex-direction: column; gap: 0.25rem;"')
content = content.replace('class="p-3 border rounded-md bg-gray-50 text-gray-800 font-medium"', 'class="p-1.5 border rounded-md bg-gray-50 text-gray-800 font-medium"')
content = content.replace('<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">', '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">')
content = content.replace('<div class="border-t border-gray-100 pt-4" style="margin-top: 0.5rem;">', '<div class="border-t border-gray-100 pt-2" style="margin-top: 0.25rem;">')
content = content.replace('<div style="display: flex; flex-direction: column; gap: 0.75rem;">', '<div style="display: flex; flex-direction: column; gap: 0.25rem;">')
content = content.replace('class="p-3 border rounded-md bg-gray-50"', 'class="p-1.5 border rounded-md bg-gray-50"')
content = content.replace('class="p-3 border rounded-md"', 'class="p-1.5 border rounded-md"')

with open('c:/e-lapak/app/pages/dashboard.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
