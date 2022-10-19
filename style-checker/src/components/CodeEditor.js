import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './CodeEditor.css'


const highlightWithLineNumbers = (input, language) =>
  highlight(input, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");

function CodeEditor(props) {
  return (
    <div className="flex-grow">
      <Editor
        value={props.value}
        onValueChange={code => props.setCode(code)}
        highlight={code => highlightWithLineNumbers(code, languages.py)}
        padding={10}
        textareaId="codeArea" 
        className="editor" 
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