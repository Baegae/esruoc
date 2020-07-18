import React, { useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import produce from 'immer';
import { OutputData } from '@editorjs/editorjs';
import Editor, { EditorTextSelection } from '@src/components/Editor';
import { editorTextDataState, editorPreviewHighlightState, slideState } from '../states';

const Slide: React.FC<{ slideIndex: number; selected?: boolean }> = ({ slideIndex, selected }) => {
  const editorData = useRecoilValue(editorTextDataState(slideIndex));
  const previewSelectionData = useRecoilValue(editorPreviewHighlightState(slideIndex));
  
  const [currentSlide, setCurrentSlide] = useRecoilState(slideState(slideIndex));
  
  const addTextChange = useCallback<(data: OutputData) => void>((textData: OutputData) => {
    setCurrentSlide((state) => produce(state, (draftState) => {
      draftState.changes.push({ data: textData, videoTimestamp: (new Date().getTime() - currentSlide.recordingStartedAt) / 1000 });
    }));
  }, [currentSlide.recordingStartedAt, setCurrentSlide]);
  
  // TODO: Node기반 position으로 바꾸어 responsive하게 동작하게 만들기 
  const addSelectionChange = (rects?: EditorTextSelection[]) => {
    setCurrentSlide((state) => produce(state, (draftState) => {
      draftState.selectionChanges.push({ data: rects, videoTimestamp: (new Date().getTime() - currentSlide.recordingStartedAt) / 1000 });
    }));
  };
  
  const handleTextDataChange = useCallback<(data: OutputData) => void>(
    (textData) => {
      if (!currentSlide.isRecording) {
        return;
      }
      addTextChange(textData);
    }, [addTextChange, currentSlide.isRecording]);
  
  const handleSelectionChange = (rects?: EditorTextSelection[]) => {
    if (!currentSlide.isRecording) {
      return;
    }
    addSelectionChange(rects);
  };
  
  return (
    <div style={{ backgroundColor: selected ? 'yellow' : undefined }}>
      <Editor
        data={editorData}
        onChange={handleTextDataChange}
        selection={previewSelectionData}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default Slide;
