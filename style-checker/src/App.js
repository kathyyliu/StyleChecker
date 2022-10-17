import React, {useState} from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import CodeEditor from './components/CodeEditor';
import Feedback from './components/Feedback';
import './App.css';


export default function App() {
  const [code, setCode] = useState(`# Paste your code here!\n\n`);
  const [isSubmitted, setSubmitted] = useState(false);
  const [warnings, setWarnings] = useState(null);
  const [examples, setExamples] = useState(null);

  const setCodeCallback = code => setCode(code);
  const setFileCallback = file => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        setCode(reader.result);
    }
    reader.onerror = () => {
        console.log('file error', reader.error);
    }
  };

  const url = 'http://127.0.0.1:5000/'

  function handleSubmit(event) {
    event.preventDefault();
    if (!code.trim() || code.trim() === `# Paste your code here!`) {
      return;
    }
    axios.post(url, JSON.stringify(code), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setSubmitted(true);
        setWarnings(res.data.warnings);
        setExamples(res.data.examples);
        console.log('res', res);
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }

  return (
    <div className="text-center">
      <form onSubmit={handleSubmit}>
            <FileUpload setFile={setFileCallback}/>
          <div>
              <h1 className="text-xl my-8">OR</h1>
          </div>
          <div className="flex flex-row mx-8">
              <CodeEditor value={code} setCode={setCodeCallback}/>
              {isSubmitted && <Feedback warnings={warnings} examples={examples}/>}
          </div>
          <button className="btn btn-blue" type="submit">Check Style</button>
      </form>
   </div>
  );
}
