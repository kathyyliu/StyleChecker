import React, {useState} from 'react';
import './App.css';
import axios from 'axios'


export default function App() {

  const [file, setFile] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      return;
    }
    let data = new FormData();
    data.append('file', file);
    const url = 'http://127.0.0.1:5000/'
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

  return (
    <div class="max-w-xl">
    <form onSubmit={handleSubmit}>
    <label
        class="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="font-medium text-gray-600">
                Drop files to Attach, or 
                <span class="text-blue-600 underline">browse</span>
            </span>
        </span>
        <input type="file" name="file_upload" class="hidden"
          onChange={event => setFile(event.target.files[0])}/>
    </label>
    <button type="submit">Submit form</button>
    </form>
    </div>
  );
}

