import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './CodeEditor.css'


const enumColors = {
  'error': 3,
  'warning': 2,
  'convention': 1,
}

const consolidateTypes = (type) => {
    if (type === 'error' || type === 'fatal') {
      return 'error';
    }
    if (type === 'warning') {
      return 'warning';
    }
    return 'convention'; // convention, refactor, information
  }

function CodeEditor(props) {

  const lineColors = {};
  if (props.isSubmitted) {
      // ensure highest severity color shown for lines w mult. msgs
    props.warnings.forEach((warning) => {
      const line = warning.line;
      const type = consolidateTypes(warning.type);
      if (!(line in lineColors) || enumColors[type] > enumColors[lineColors[line]]) {
        lineColors[line] = type;
      }
    });
  }

  const buildLineSpan = (codeLine, i) => {
    if (!props.isSubmitted || !(i+1 in lineColors)) {
      return `<span class='editorLineNumber'>${i + 1}</span>${codeLine}`;
    }
    return `<span class='editorLineNumber bg-${lineColors[i+1]}'><p class='text-black'>${i + 1}</p></span>${codeLine}`;
  }

  const highlightWithLineNumbers = (input, language) =>
  highlight(input, language)
    .split("\n")
    .map(buildLineSpan)
    .join("\n");

  return (  
    <div className="flex-grow">
      <Editor
        value={props.value}
        onValueChange={code => props.setCode(code)}
        highlight={code => highlightWithLineNumbers(code, languages.py)}
        padding={10}
        textareaId="codeArea" 
        className="editor"
        placeholder="Paste your code here!"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          outline: 0,
        }}
      />
    </div>
  );
}

export default CodeEditor;