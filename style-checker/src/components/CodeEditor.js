import React, {useEffect, useState} from 'react';
import ReactDOMServer from 'react-dom/server'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './CodeEditor.css'


const msgTypeColors = {
  3: 'red-200',
  2: 'orange-200',
  1: 'yellow-200',
};

const consolidateTypes = (type) => {
    if (type === 'error' || type === 'fatal') {
      return 3;
    }
    if (type === 'warning') {
      return 2;
    }
    return 1; // convention, refactor, information
};


function CodeEditor(props) {
  const [numLines, setNumLines] = useState(1);
  const [lineColors, setLineColors] = useState({});

  useEffect(() => {
    if (props.isSubmitted) {
        // ensure highest severity color shown for lines w mult. msgs
      const newLineColors = {};
      props.warnings.forEach((warning) => {
        const line = warning.line;
        const type = consolidateTypes(warning.type);
        if (!(line in newLineColors) || type > newLineColors[line]) {
          newLineColors[line] = type;
        }
      });
      setLineColors(newLineColors);
    }
  }, [props.warnings]);

  const buildLineSpan = (codeLine, i) => {
    const line = i + 1;
    if (!props.isSubmitted || !(line in lineColors)) {
      return `<span class='editorLineNumber'>${line}</span>${codeLine}`;
    }
    return `<span id='${line}' class='editorLineNumber errorLine bg-${msgTypeColors[lineColors[line]]}'><p class='text-black'>${line}</p></span>${codeLine}`;
  }

  const highlightWithLineNumbers = (input, language) =>
  highlight(input, language)
    .split("\n")
    .map(buildLineSpan)
    .join("\n");

  const handleValueChange = (code) => {
    props.setCode(code);
    const newNumLines = code.split('\n').length;
    if (newNumLines !== numLines && props.isSubmitted) {
      props.submit('background', code);
      setNumLines(newNumLines);
    }
  }

  return (  
      <Editor
        value={props.value}
        onValueChange={handleValueChange}
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
  );
}

export default CodeEditor;