import React, {useState} from 'react';
import axios from 'axios';
import NavBar from './components/NavBar';
import FileUpload from './components/FileUpload';
import CodeEditor from './components/CodeEditor';
import Feedback from './components/Feedback';
import './App.css';


export default function App() {
  const [code, setCode] = useState('');
  const [isSubmitted, setSubmitted] = useState(false);
  const [warnings, setWarnings] = useState(null);
  const [examples, setExamples] = useState(null);

  const setFileCallback = file => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        setCode(reader.result);
    }
    reader.onerror = () => {
        console.log('file error', reader.error);
    }
    setSubmitted(false);
  };

  const url = 'http://127.0.0.1:5000/'

  function handleSubmit(event, backgroundCode) {
    if (event !== 'background') {
       event.preventDefault();
    }
    const newcode = backgroundCode ? backgroundCode : code;
    if (!newcode.trim()) {
      return;
    }
    axios.post(url, JSON.stringify(newcode), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setSubmitted(true);
        const sorted_warns = res.data.warnings.sort((a, b) => parseInt(a.line) - parseInt(b.line));
        setWarnings(sorted_warns);
        setExamples(res.data.examples);
        console.log('res', res);
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }

  return (
    <div>
      <NavBar/>
      <form id="code-form" onSubmit={handleSubmit}>
        <FileUpload setFile={setFileCallback}/>
        <div>
          <h1 className="text-center text-xl my-8">OR</h1>
        </div>
        <div className="flex mx-auto pb-64 content-start justify-center">
          {isSubmitted && 
            <Feedback warnings={warnings} examples={examples} isSubmitted={isSubmitted}/>}
            <CodeEditor value={code} isSubmitted={isSubmitted} warnings={warnings} setCode={setCode} submit={handleSubmit}/>
        </div>
      </form>
   </div>
  );
}
