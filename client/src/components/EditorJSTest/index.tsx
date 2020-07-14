import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import QuizBlockPlugin from './QuizBlock/plugin';

function EditorJSText() {
  const editorRef = useRef<EditorJS | null>(null);
  
  useEffect(() => {
    editorRef.current = new EditorJS({
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
    });
  }, []);
  
  return <div id="editor" />;
}
  
export default EditorJSText;
