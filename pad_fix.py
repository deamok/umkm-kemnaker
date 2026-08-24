import sys
with open('c:/e-lapak/app/pages/dashboard.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'style="margin-bottom: 2px; color: var(--accent-primary);"',
    'style="margin-bottom: 2px; padding-top: 0.5rem; color: var(--accent-primary);"'
)
content = content.replace(
    'style="color: var(--accent-primary);"',
    'style="padding-top: 0.5rem; color: var(--accent-primary);"'
)

with open('c:/e-lapak/app/pages/dashboard.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
