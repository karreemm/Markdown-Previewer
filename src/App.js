import './App.css';
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const App = () => {
  const [code, setCode] = useState('## Hello');
  const [compiled, setCompiled] = useState('<h2 id="hello">Hello</h2>');
  const [hide, hidePreview] = useState(true);
  const [docs, setDocs] = useState([]);

  const openMD = () => {
    hidePreview(true);
  };

  const openPreview = () => {
    hidePreview(false);
  };

  const handleChange = (e) => {
    setCode(e.target.value);
    setCompiled(marked.parse(e.target.value));
  };

  useEffect(() => {
    fetch('/api/v1/basic-syntax.json')
      .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        console.log('Raw data:', data);
        const jsonData = JSON.parse(data); 
        console.log('Fetched data:', jsonData);
        setDocs(jsonData.basic_syntax);
      })
      .catch(error => console.error('Error fetching the docs:', error));
  }, []);

  return (
    <>
      <h1>Markdown Previewer React App</h1>
      <div className="container">
        <div className="btns">
          <button onClick={openMD} className="btn">Markdown</button>
          <button onClick={openPreview} className="btn">Preview</button>
        </div>
        {hide ? (
          <div>
            <textarea onChange={handleChange} value={code} />
          </div>
        ) : (
          <div>
            <div dangerouslySetInnerHTML={{ __html: compiled }} />
          </div>
        )}
      </div>
      <h2>Markdown Documentation</h2>
      <div className="docs-container">
        <div className="docs">
          {docs.map((doc, index) => (
            <div key={index} className="doc-item">
              <h3>{doc.name}</h3>
              <p>{doc.description}</p>
              <h4>Examples:</h4>
              {doc.examples.map((example, i) => (
                <div key={i}>
                  <pre>{example.markdown}</pre>
                  <div dangerouslySetInnerHTML={{ __html: example.html }} />
                </div>
              ))}
              {doc.additional_examples.length > 0 && (
                <>
                  <h4>Additional Examples:</h4>
                  {doc.additional_examples.map((example, i) => (
                    <div key={i}>
                      <h5>{example.name}</h5>
                      <p>{example.description}</p>
                      <pre>{example.markdown}</pre>
                      <div dangerouslySetInnerHTML={{ __html: example.html }} />
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
