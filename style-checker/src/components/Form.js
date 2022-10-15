import React, {useState} from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import CodeEditor from './CodeEditor';
import './Form.css'


function Form() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");

  const setFileCallback = file => setFile(file);
  const setCodeCallback = code => setCode(code);

  const url = 'http://127.0.0.1:5000/'

  function handleFileSubmit(event) {
    event.preventDefault();
    if (!file) {
      return;
    }
    let data = new FormData();
    data.append('file', file);
    axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log('res', res)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }

  function handleCodeSubmit(event) {
    event.preventDefault();
    if (!code) {
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
        <div className="formDiv">
            <form onSubmit={handleFileSubmit}>
            <FileUpload setFile={setFileCallback}/>
            <button className="btn btn-blue" type="submit">Submit file</button>
            </form>
        </div>
        <div>
            <h1 className="text-xl my-8">OR</h1>
        </div>
        <div className="formDiv">
            <form onSubmit={handleCodeSubmit}>
            <CodeEditor setCode={setCodeCallback}/>
            <button className="btn btn-blue" type="submit">Submit code</button>
            </form>
        </div>
   </div>
  );
}

export default Form;