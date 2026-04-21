import sys, re

file_path = '/Users/adityaumale/Desktop/aspire/aspire/src/app/about-us/page.tsx'
with open(file_path, 'r') as f: content = f.read()

start_str = "      {/* ════════════════════════════════════════════════\n          GLOBAL ASPIRE"
end_str = "      {/* ════════════════════════════════════════════════\n          WHY CHOOSE ASPIRE"
target_pos = content.find(start_str)
end_pos = content.find(end_str)

if target_pos != -1 and end_pos != -1:
    global_aspire_block = content[target_pos:end_pos]
    content_without_global_aspire = content[:target_pos] + content[end_pos:]
    insert_str = "      {/* ════════════════════════════════════════════════\n          SPECIAL GUESTS"
    insert_pos = content_without_global_aspire.find(insert_str)
    
    if insert_pos != -1:
        new_content = content_without_global_aspire[:insert_pos] + global_aspire_block + content_without_global_aspire[insert_pos:]
        new_content = re.sub(r'(>)(08)(</span>\s*<div>\s*<h2[^>]*>\s*Aspire Goes <span)', r'\g<1>03\3', new_content)
        new_content = re.sub(r'(>)(03)(</span>\s*<div>\s*<h2[^>]*>\s*Special <span)', r'\g<1>04\3', new_content)
        new_content = re.sub(r'(>)(04)(</span>\s*<div>\s*<h2[^>]*>\s*Aspire <span)', r'\g<1>05\3', new_content)
        new_content = re.sub(r'(>)(05)(</span>\s*<div>\s*<h2[^>]*>\s*Our <span)', r'\g<1>06\3', new_content)
        new_content = re.sub(r'(>)(06)(</span>\s*<div>\s*<h2[^>]*>\s*Social <span)', r'\g<1>07\3', new_content)
        new_content = re.sub(r'(>)(07)(</span>\s*<div>\s*<h2[^>]*>\s*Public <span)', r'\g<1>08\3', new_content)
        with open(file_path, 'w') as f: f.write(new_content)
        print("Success!")
    else: print("Insert pos not found")
else: print("Target found:", target_pos, "End found:", end_pos)
