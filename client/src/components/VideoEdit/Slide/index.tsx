import React, { useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import produce from 'immer';
import { OutputData } from '@editorjs/editorjs';
import Editor, { EditorTextSelection } from '@src/components/Editor';
import {
  editorTextDataState,
  editorPreviewHighlightState,
  slideState,
  slideEditorState,
  EditingState,
} from '../states';

import * as S from './styles';

interface SlideProps {
  slideIndex: number;
  selected?: boolean;
  onFocused?: (index: number) => void;
}

const Slide: React.FC<SlideProps> = ({ slideIndex, selected, onFocused }) => {
  const editorData = useRecoilValue(editorTextDataState(slideIndex));
  const previewSelectionData = useRecoilValue(
    editorPreviewHighlightState(slideIndex)
  );

  const { editingState, recordingStartedAt } = useRecoilValue(slideEditorState);
  const [currentSlide, setCurrentSlide] = useRecoilState(
    slideState(slideIndex)
  );

  const addTextChange = useCallback<(data: OutputData) => void>(
    (textData: OutputData) => {
      setCurrentSlide((state) =>
        produce(state, (draftState) => {
          draftState.changes.push({
            data: textData,
            videoTimestamp:
              (new Date().getTime() - recordingStartedAt) / 1000,
          });
        })
      );
    },
  [setCurrentSlide, recordingStartedAt]
  );

  const changeOriginalText = useCallback<(data: OutputData) => void>(
    (data: OutputData) => setCurrentSlide((state) => produce(state, draftState => {
      draftState.originalEditorData = data;
    }))
  , [setCurrentSlide]);

  // TODO: Node기반 position으로 바꾸어 responsive하게 동작하게 만들기
  const addSelectionChange = (rects?: EditorTextSelection[]) => {
    setCurrentSlide((state) =>
      produce(state, (draftState) => {
        draftState.selectionChanges.push({
          data: rects,
          videoTimestamp:
            (new Date().getTime() - recordingStartedAt) / 1000,
        });
      })
    );
  };

  const handleTextDataChange = useCallback<(data: OutputData) => void>(
    (textData) => {
      if (editingState === EditingState.Previewing) {
        return;
      }
      if (editingState === EditingState.Editing) {
        changeOriginalText(textData);
        return;
      }
      addTextChange(textData);
    },
  [addTextChange, editingState]
  );

  const handleSelectionChange = (rects?: EditorTextSelection[]) => {
    if (editingState !== EditingState.Recording) {
      return;
    }
    addSelectionChange(rects);
  };

  const handleFocused: React.FocusEventHandler = () => {
    if (!onFocused) {
      return;
    }
    onFocused(slideIndex);
  };

  return (
    <S.CardView
      data-slide-index={slideIndex}
      isSelected={selected || false}
      onFocus={handleFocused}
    >
      <Editor
        data={editorData}
        onChange={handleTextDataChange}
        selection={previewSelectionData}
        onSelectionChange={handleSelectionChange}
      />
    </S.CardView>
  );
};

export default Slide;
