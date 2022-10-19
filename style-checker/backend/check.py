from dataclasses import replace
import json
import re
from subprocess import Popen, PIPE


def run_pylint(file_path):
    process = Popen(['pylint', '--output-format=json', file_path], stdout=PIPE, stderr=PIPE)
    stdout, stderr = process.communicate()
    dict_str = stdout.decode("UTF-8")
    return parse_pylint(dict_str)


# takes str with all warnings in json format from pylint
def parse_pylint(dict_str):
    warn_strs = dict_str.split('},')
    warnings = []
    for str in warn_strs:
        type_start = str.find('type": "') + 8
        type = str[type_start : str.find('"', type_start)]
        line_start = str.find('line": ') + 7
        line = str[line_start : str.find(',', line_start)]
        col_start = str.find('column": ') + 9
        col = str[col_start : str.find(',', col_start)]
        endline_start = str.find('endLine": ') + 10
        endline = str[endline_start : str.find(',', endline_start)]
        endcol_start = str.find('endColumn": ') + 12
        endcol = str[endcol_start : str.find(',', endcol_start)]
        msg_start = str.find('message": "') + 11
        msg = str[msg_start : str.find('",', msg_start)].replace('\n', '').replace('\\"', "'")
        id_start = str.find('id": "') + 6
        id = str[id_start : str.find('"', id_start)]
        warnings.append({
            'type': type,
            'line': line,
            'column': col,
            'endLine': endline,
            'endColumn': endcol,
            'message': msg,
            'message-id': id,
        })
    return warnings


def get_examples(msg_ids):
    send_ex = {}
    file = open("examples.json", 'r+', encoding='utf-8')
    ex_lib = json.load(file)
    write = False
    for id in msg_ids:
        # pull from our json if this error has been encountered before
        # else get ex from plerr and add it to json
        if id not in ex_lib:
            process = Popen(['plerr', id], stdout=PIPE, stderr=PIPE)
            stdout, stderr = process.communicate()
            outstr = stdout.decode("UTF-8")
            output = re.sub(r'\\x1b\[[0-9;]+[a-z]', '', repr(outstr))
            ex_lib[id] = parse_plerr(output)
            write = True
        send_ex[id] = ex_lib[id]
    if write:
        file.seek(0)
        json.dump(ex_lib, file, ensure_ascii=False, indent=4)
    file.close()
    return send_ex


# takes single stdout example from plerr
def parse_plerr(ex):
    name = ex[11 : ex.find(')')]
    bad_start = ex.find('\\n', ex.find('```')) + 2
    bad_end = ex.find("```", bad_start)
    bad_code = ex[bad_start : bad_end].replace('\\n', '\n')
    good_start = ex.find('\\n', ex.find('```', bad_end + 3)) + 2
    good_end = ex.find("```", good_start)
    good_code = ex[good_start : good_end].replace('\\n', '\n')
    rationale_idx = ex.find("Rationale") + 14
    rationale = ex[rationale_idx : ex.find("###", rationale_idx)].replace('\\n', ' ').replace("\\'", "'")
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
