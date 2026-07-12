import re
content = open(r'F:\elearning\paradiogm\index.html', encoding='utf-8').read()

def check_balance(section_id):
    start = content.find(f'<section id="{section_id}"')
    if start == -1:
        print(f"{section_id} not found")
        return
    end = content.find('</section>', start)
    section = content[start:end]
    divs = len(re.findall(r'<div\b', section))
    end_divs = len(re.findall(r'</div\b', section))
    print(f'{section_id} - <divs>: {divs}, </divs>: {end_divs}')

check_balance('ist-subjective')
check_balance('ist-example')
check_balance('ist-note')
