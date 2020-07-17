import React, {useEffect, useRef, ChangeEventHandler, useState} from 'react';
import EditorJS, {EditorConfig, OutputData} from '@editorjs/editorjs';
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


interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

const Editor: React.FC<EditorProps> = ({data, onChange}) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    editorRef.current = new EditorJS(Object.assign({}, editorJsConfig, {data}));
    // new EditorJS({...editorJsConfig, holder: 'editor9'});
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    editorRef.current?.isReady.then(() => {
      editorRef.current?.render(data);
    });
  }, [data]);

  // TODO: MutationObserver로 효율성 개선하기
  useEffect(() => {
    const intervalId = setInterval(() => {
      editorRef.current?.save().then(data => {
        onChange(data);
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [onChange]);

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
  };

  return <div>
    <div id="editor">
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
};

export default Editor;
