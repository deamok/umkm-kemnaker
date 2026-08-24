import sys
with open('c:/e-lapak/app/pages/dashboard.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div class="font-semibold text-gray-800 mb-2 flex align-center"><i data-lucide="qr-code"',
    '<div class="font-semibold text-gray-800 mb-2 flex align-center" style="padding-top: 0.5rem;"><i data-lucide="qr-code"'
)

with open('c:/e-lapak/app/pages/dashboard.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
