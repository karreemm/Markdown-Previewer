import './App.css';
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const App = () => {
  const [code, setCode] = useState('## Try It Now!');
  const [compiled, setCompiled] = useState('<h2 id="Try It Now!">Try It Now!</h2>');
  const [view, setView] = useState('markdown'); 
  const [docs, setDocs] = useState([]);

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
      <h1>Markdown Previewer</h1>
      <div className='for-height'>
        <div className="container">
          <div className="btns">
            <button 
              onClick={() => setView('markdown')} 
              className={`btn ${view === 'markdown' ? 'active' : ''}`}
            >
              Markdown
            </button>
            <button 
              onClick={() => setView('preview')} 
              className={`btn ${view === 'preview' ? 'active' : ''}`}
            >
              Preview
            </button>
            <button 
              onClick={() => setView('docs')} 
              className={`btn ${view === 'docs' ? 'active' : ''}`}
            >
              Docs
            </button> 
          </div>
          {view === 'markdown' && (
            <div className='for-center'>
              <textarea onChange={handleChange} value={code} />
            </div>
          )}
          {view === 'preview' && (
            <div className='for-center2'>
              <div className='Preview' dangerouslySetInnerHTML={{ __html: compiled }} />
            </div>
          )}
          {view === 'docs' && ( 
            <div className='for-center2'>
              <div className='Docs-container'> 
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
