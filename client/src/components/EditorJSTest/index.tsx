import React, { useEffect, useRef, ChangeEventHandler, useState } from 'react';
import EditorJS, { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import QuizBlockPlugin from './QuizBlock/plugin';

const editorJsConfig: EditorConfig = {
  onChange: console.log,
  holder: 'editor',
  tools: {
    header: Header,
    list: List,
    underline: {
      class: Underline,
      shortcut: 'CMD+SHIFT+U',
    },
    marker: {
      class: Marker,
      shortcut: 'CMD+SHIFT+M',
    },
    quiz: {
      // eslint-disable-next-line
      // @ts-ignore
      class: QuizBlockPlugin
    },
  },
};

function EditorJSText() {
  const editorRef = useRef<EditorJS | null>(null);
  
  useEffect(() => {
    const el = document.createElement('div');
    el.id = 'editor';
    document.getElementById('editorContainer')?.appendChild(el);
    editorRef.current = new EditorJS(Object.assign({}, editorJsConfig));
    // new EditorJS({...editorJsConfig, holder: 'editor9'});
  }, []);

  const handleSave = () => {
    editorRef.current?.save().then(data => {
      console.log('save', data);
      setText(JSON.stringify(data));
    });
  };

  const [text, setText] = useState('');

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value);
  };

  const handleLoad = () => {
    console.log('loading', text);
    editorRef.current?.render(JSON.parse(text));
    // const el = document.getElementById('editorContainer');
    // el?.firstChild?.remove();

    // const editorEl = document.createElement('div');
    // editorEl.id = 'editor9';
    // document.getElementById('editorContainer')?.appendChild(editorEl);

    // editorRef.current = new EditorJS({
    //   ...Object.assign({}, editorJsConfig),
    //   holder: 'editor9',
    //   data: JSON.parse(text),
    // });
  };
  
  return <div>
    <div id="editorContainer">
    </div>
    <button onClick={handleLoad}>
      load
    </button>
    <textarea value={text}
      onChange={handleChange}
    >
    </textarea>
    <button onClick={handleSave}>
      save
    </button>
  </div>;
}
  
export default EditorJSText;
