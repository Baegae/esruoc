import React, { useEffect, useRef, ChangeEventHandler, useState, useCallback, useLayoutEffect } from 'react';
import EditorJS, { EditorConfig, OutputData, LogLevels } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import QuizBlockPlugin from './QuizBlock/plugin';
import EditorWrapper from '@src/styles/EditorWrapper';

const editorJsConfig: EditorConfig = {
  onChange: (change) => { console.log('editorJS', change); },
  logLevel: 'WARN' as LogLevels.WARN,
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
  onSelectionChange: (rectList?: EditorTextSelection[]) => void;
  selection?: EditorTextSelection[];
}

export interface EditorTextSelection {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getNumRange = (n: number) => [...Array(n)].map((_, index) => index);

const Editor: React.FC<EditorProps> = ({ data, onChange, onSelectionChange, selection }) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    editorRef.current = new EditorJS(Object.assign({}, editorJsConfig, { data }));
    // new EditorJS({...editorJsConfig, holder: 'editor9'});
  }, []);

  const editorHighlightLayerElRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = () => {
      const selection = document.getSelection();
      const editorEl = editorHighlightLayerElRef.current;
      if (!selection || !editorEl) return;
      const range = selection.getRangeAt(0);
      if (range.intersectsNode(editorEl)) {
        console.log('SELECTION CHANGE', selection);
        const rects = range.getClientRects();
        onSelectionChange(
          getNumRange(rects.length)
            .map((index) => rects[index])
            .map(rect => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height }))
            .map(rect => {
              const editorRect = editorEl.getBoundingClientRect();
              return ({ ...rect, x: (rect.x - editorRect.x), y: (rect.y - editorRect.y) });
            })
        );
      } else {
        console.log('SELECTION OUT', selection);
        onSelectionChange(undefined);
      }
    };
    document.addEventListener('selectionchange', listener);
    return () => {
      document.removeEventListener('selectionchange', listener);
    };
  }, [onSelectionChange]);

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
      editorRef.current?.isReady.then(() => editorRef.current?.save()).then(data => {
        data && onChange(data);
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [onChange]);

  const handleSave = () => {
    editorRef.current?.isReady.then(() => editorRef.current?.save()).then(data => {
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

  const renderHighlight = (textSelection: EditorTextSelection) => {
    return <div style={{ position: 'absolute', left: textSelection.x, top: textSelection.y, width: textSelection.width, height: textSelection.height, backgroundColor: 'red' }}>highlight</div>;
  };

  return <div>
    <EditorWrapper >
      <div style={{ position: 'relative' }}
        ref={editorHighlightLayerElRef}
      >
        <div id="editor">
        </div>
        {selection && selection.length > 0 && renderHighlight(selection[0])}
      </div>
    </EditorWrapper>
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
