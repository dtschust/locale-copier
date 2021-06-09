import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import './App.css';

const defaultLocales = ['en-GB', 'de-DE', 'es-ES', 'es-LA', 'fr-FR', 'ja-JP', 'pt-BR', 'ko-KR', 'it-IT', 'zh-CN', 'zh-TW']

function MyDropzone(props) {
  const locales = props && props.locales;
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    if (acceptedFiles && acceptedFiles.length) {
      buildAndDownloadZip(acceptedFiles, locales);
    }
  }, [locales])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

function buildAndDownloadZip(acceptedFiles, locales) {
  if (acceptedFiles && acceptedFiles.length) {
    let downloadFileName = 'output';
    const zip = new JSZip();
    acceptedFiles.forEach((file, i) => {
      const name = file && file.name && file.name.split('.');
      const extension = name.pop();
      const filename = name.join('.');

      if (i === 0 && acceptedFiles.length === 1) {
        downloadFileName = filename;
      }

      locales.forEach((locale) => {
        zip.file(`${downloadFileName}/${filename}.${locale}.${extension}`, file)
      });

    })

    zip.generateAsync({type:"blob"}).then(function (blob) {
      saveAs(blob, `${downloadFileName}.zip`);
    });
  }

}

function App() {
  const [locales, setLocales] = useState(defaultLocales);


  function onChangeInput(e) {
    const newValue = e && e.target && e.target.value;
    setLocales(newValue.split(',').map((locale) => locale.trim()));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Locales:</h1>
        <div>
          <p>👇To remove or change locales, edit the text below 👇</p>
        </div>
        <textarea rows={5} cols={50} value={locales.join(', ')} onChange={onChangeInput}/>
        <div>
        Locales to generate:
        <ul style={{fontSize: '18px', listStyleType: 'none'}}>
          {locales.map((locale)=> (
            <li key={locale}>{locale}</li>
          ))}
        </ul>
        </div>
        <h1>Upload Image(s):</h1>
        <MyDropzone locales={locales}/>
      </header>
    </div>
  );
}

export default App;
