import React, {useState} from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import CodeEditor from './CodeEditor';
import './Form.css'


function Form() {
  const [code, setCode] = useState(`# Paste your code here!\n\n`);

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
        console.log('res', res)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }

  return (
    <div className="text-center">
        <form onSubmit={handleSubmit}>
            <div className="formDiv">
                <FileUpload setFile={setFileCallback}/>
            </div>
            <div>
                <h1 className="text-xl my-8">OR</h1>
            </div>
            <div className="formDiv">
                <CodeEditor value={code} setCode={setCodeCallback}/>
                <button className="btn btn-blue" type="submit">Check Style</button>
            </div>
        </form>
   </div>
  );
}

export default Form;