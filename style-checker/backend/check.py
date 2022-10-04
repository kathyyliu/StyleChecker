import os
import json
import re


def run_pylint(file_path):
    os.popen("pylint --output-format=json:warnings.json " + file_path)
    f = open("warnings.json")
    return json.load(f)


def get_examples(msg_ids):
    send_ex = {}
    file = open("examples.json", 'r+', encoding='utf-8')
    ex_lib = json.load(file)
    write = False
    for id in msg_ids:
        # pull from our json if this error has been encountered before
        # else get ex from plerr and add it to json
        if id not in ex_lib:
            plerr = os.popen("plerr " + id)
            output = re.sub(r'\\x1b\[[0-9;]+[a-z]', '', repr(plerr.read()))
            ex_lib[id] = parse_plerr(output)
            plerr.close()
            write = True
        send_ex[id] = ex_lib[id]
    if write:
        file.seek(0)
        json.dump(ex_lib, file, ensure_ascii=False, indent=4)
    file.close()
    return send_ex


def parse_plerr(ex):
    name = ex[11 : ex.find(')')]
    bad_start = ex.find('\\n', ex.find('```'))
    bad_end = ex.find("```", bad_start)
    bad_code = ex[bad_start : bad_end].replace('\\n', '\n')
    good_start = ex.find('\\n', ex.find('Correct code'))
    good_end = ex.find("```", good_start)
    good_code = ex[good_start : good_end].replace('\\n', '\n')
    rationale_idx = ex.find("Rationale") + 14
    rationale = ex[rationale_idx : ex.find("###", rationale_idx)].replace('\n', '')
    return {
        'name': name,
        'bad': bad_code,
        'good': good_code,
        'rationale': rationale,
    }


def check(file_path):
    warnings = run_pylint(file_path)
    msg_ids = {warning["message-id"] for warning in warnings}
    examples = get_examples(msg_ids)
    return warnings, examples


def main():
    w, e = check('example.py')
    print(e)


if __name__ == '__main__':
    main()
