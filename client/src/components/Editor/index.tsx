import React, { useLayoutEffect, useRef, useEffect } from 'react';
import EditorJS, { EditorConfig, OutputData, LogLevels } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import Image from '@editorjs/image';
import styled from 'styled-components';
import QuizBlockPlugin from './QuizBlock/plugin';
import EditorWrapper from '@src/styles/EditorWrapper';

const editorJsConfig: EditorConfig = {
  onChange: (change) => { console.log('editorJS', change); },
  logLevel: 'WARN' as LogLevels.WARN,
  i18n: {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': '클릭하거나 드래그하여, 블록 이동',
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': '변환',
          },
        },
        toolbar: {
          toolbox: {
            Add: '추가',
          },
        },
      },

      toolNames: {
        Text: '텍스트',
        Heading: '제목',
        List: '리스트',
        Link: '링크',
        Marker: '형광펜',
        Bold: '굵게',
        Italic: '기울게',
        Underline: '밑줄',
        Image: '사진'
      },
      tools: {
        image: {
          Caption: '설명',
          'Select an Image': '사진 선택...',
        },
        list: {
          Unordered: '순서가 없는 리스트',
          Ordered: '순서가 있는 리스트',
        },
        link: {
          'Add a link': '링크 추가',
        },
        stub: {
          'The block can not be displayed correctly.':
            '블록 표시 중 문제가 발생했습니다.',
        },
      },

      blockTunes: {
        delete: {
          Delete: '삭제',
        },
        moveUp: {
          'Move up': '위로 이동',
        },
        moveDown: {
          'Move down': '아래로 이동',
        },
      },
    },
  },
  tools: {
    header: Header,
    list: {
      class: List,
      inlineToolbar: true,
    },
    underline: {
      class: Underline,
      shortcut: 'CMD+SHIFT+U',
    },
    marker: {
      class: Marker,
      shortcut: 'CMD+SHIFT+M',
    },
    image: {
      class: Image,
      config: {
        endpoints: {
          byFile: 'http://10.10.20.110:8000/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://10.10.20.110:8000/fetchUrl', // Your endpoint that provides uploading by Url
        },
      },
    },
    quiz: {
      // eslint-disable-next-line
      // @ts-ignore
      class: QuizBlockPlugin,
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
  const editorElRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const editor = new EditorJS(
      Object.assign(
        {},
        editorJsConfig,
        { data, holder: editorElRef.current }
      )
    );
    editorRef.current = editor;
  }, []);

  const editorHighlightLayerElRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = () => {
      const selection = document.getSelection();
      const editorEl = editorHighlightLayerElRef.current;
      if (!selection || !editorEl) return;
      if (selection.rangeCount === 0) return;
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

  useEffect(() => {
    const observer = new MutationObserver(() => {
      editorRef.current?.isReady.then(() => editorRef.current?.save()).then(data => {
        data && onChange(data);
      });
    });

    const editorHighlightLayerEl = editorHighlightLayerElRef.current;
    if (!editorHighlightLayerEl) return;
    observer.observe(editorHighlightLayerEl, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, [onChange]);

  const renderHighlight = (textSelection: EditorTextSelection) => {
    const rectStyle = { left: textSelection.x, top: textSelection.y, width: textSelection.width, height: textSelection.height };
    if (textSelection.width === 0) {
      return <Caret style={{ ...rectStyle, width: 3 }} />;
    }
    return <LineSelection style={rectStyle} />;
  };

  return <div>
    <EditorWrapper >
      <div style={{ position: 'relative' }}
        ref={editorHighlightLayerElRef}
      >
        <div id="editor"
          ref={editorElRef}
        >
        </div>
        {selection && selection.length > 0 && selection.map(renderHighlight)}
      </div>
    </EditorWrapper>
  </div>;
};

const Caret = styled.div`
  position: absolute;
  background-color: red;
`;

const LineSelection = styled.div`
  position: absolute;
  background-color: red;
  opacity: 0.5;
`;


export default Editor;
