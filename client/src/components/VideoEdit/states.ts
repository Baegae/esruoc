import { OutputData } from '@editorjs/editorjs';
import { EditorTextSelection } from '../Editor';
import { selectorFamily, atom, DefaultValue } from 'recoil';
import { produce } from 'immer';
interface SlideState {
    id: string;
    originalEditorData: OutputData;
    changes: TextDataChange[];
    selectionChanges: TextSelectionChange[];
    isRecording: boolean;
    recordingStartedAt: number;
    previewVideoObjectUrl?: string;
    previewCurrentTime: number;
  }

  
interface TextDataChange {
    data: OutputData;
    videoTimestamp: number;
  }
  
  interface TextSelectionChange {
    data?: EditorTextSelection[];
    videoTimestamp: number;
  }

  interface SlideEditorState {
    currentSlideIndex: number;
    slides: SlideState[];
    // 아직 안씀
    editingState: EditingState;
  }
    

// TODO: 학생이 강의 재생하고 강사는 녹화하고 자료 수정하고 세 작업을 하려면 아래 플래그가 필요함
// Recording에서만 change 기록 및 비디오 녹화
// Editing에서만 originalEditorData를 변경할 수 있게
// Previewing에서는 녹화한 강의 재생만 (contenteditable=false)
enum EditingState {
  Recording,
  Editing,
  Previewing,
}
  
export const initialData: OutputData = { 'time': 1595009894317, 'blocks': [{ 'type': 'header', 'data': { 'text': '새로운 강의 방식을 만들고 있어요.', 'level': 2 } }, { 'type': 'paragraph', 'data': { 'text': '노션처럼 쉬운 블록 기반 에디터와 중요한 정보를 효과적으로 알릴 수 있는 포맷팅 타임라인 기능.<br>웹에서 비디오 녹화까지.' } }, { 'type': 'paragraph', 'data': { 'text': '쉽게 제작하고, 효율적으로 온라인 강의를 체험해보세요' } }], 'version': '2.18.0' };

export const defaultSlideData: SlideState = {
  id: '0',
  originalEditorData: initialData,
  changes: [],
  selectionChanges: [],
  isRecording: false,
  recordingStartedAt: 0,
  previewVideoObjectUrl: undefined,
  previewCurrentTime: 0,
};

export let idCounter = 10;

export const createNewSlideData = () => {
  idCounter++;
  return Object.assign({ id: String(idCounter) }, defaultSlideData);
};

export const slideEditorState = atom<SlideEditorState>({
  key: 'slideEditorState',
  default: {
    currentSlideIndex: 0,
    slides: [createNewSlideData(), createNewSlideData()],
    editingState: EditingState.Editing
  },
});

export const slideState = selectorFamily<SlideState, number>({
  key: 'slideState',
  get: slideIndex => ({ get }) => {
    const slideEditor = get(slideEditorState);
    return slideEditor.slides[slideIndex];
  },
  set: slideIndex => ({ get, set }, newValue) => {
    set(slideEditorState, produce(get(slideEditorState), draftState => {
      if (newValue instanceof DefaultValue) {
        draftState.slides[slideIndex] = defaultSlideData;
        return;
      }
      draftState.slides[slideIndex] = newValue;
    }));
  },
});

export const latestTextChangeState = selectorFamily<OutputData, number>({
  key: 'latestTextChangeState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(slideState(slideIndex));
    const isChangeBeforeCurrentTime = (textChange: TextDataChange) => textChange.videoTimestamp <= videoEdit.previewCurrentTime;
    const latestChangeBeforeCurrentTime = videoEdit.changes.filter(isChangeBeforeCurrentTime).slice(-1);
    // 최근 수정 사항이 없으면 첫 text로 시작함
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : videoEdit.originalEditorData);
  },
});

export const editorTextDataState = selectorFamily<OutputData | undefined, number>({
  key: 'editorTextDataState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(slideState(slideIndex));
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }
    // CONTROL
    return get(latestTextChangeState(slideIndex));
  },
});

export const editorPreviewHighlightState = selectorFamily<EditorTextSelection[] | undefined, number>({
  key: 'editorPreviewHighlightState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(slideState(slideIndex));
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }

    const isChangeBeforeCurrentTime = (change: TextSelectionChange) => change.videoTimestamp <= videoEdit.previewCurrentTime;
    const latestChangeBeforeCurrentTime = videoEdit.selectionChanges.filter(isChangeBeforeCurrentTime).slice(-1);
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : undefined);
  },
});
