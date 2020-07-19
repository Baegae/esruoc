import { OutputData } from '@editorjs/editorjs';
import { EditorTextSelection } from '../Editor';
import { selectorFamily, atom, DefaultValue, selector } from 'recoil';
import { produce } from 'immer';


interface SlideEditorState {
  currentSlideIndex: number;
  slides: SlideState[];
  editingState: EditingState;
  recordingStartedAt: number;
  preview: PreviewState;
  slideIndexChange: SlideIndexChange[];
}

interface SlideIndexChange {
  data: number;
  videoTimestamp: number;
}

interface TextDataChange {
  data: OutputData;
  videoTimestamp: number;
}

interface TextSelectionChange {
  data?: EditorTextSelection[];
  videoTimestamp: number;
}

interface PreviewState {
  videoObjectUrl: string;
  currentTime: number;
}

export enum EditingState {
  Editing = 'Editing',
  Recording = 'Recording',
  Previewing = 'Previewing',
}

interface SlideState {
  id: string;
  originalEditorData: OutputData;
  changes: TextDataChange[];
  selectionChanges: TextSelectionChange[];
}

export const initialData: OutputData = { 'time': 1595009894317, 'blocks': [{ 'type': 'header', 'data': { 'text': '새로운 강의 방식을 만들고 있어요.', 'level': 2 } }, { 'type': 'paragraph', 'data': { 'text': '노션처럼 쉬운 블록 기반 에디터와 중요한 정보를 효과적으로 알릴 수 있는 포맷팅 타임라인 기능. 웹에서 비디오 녹화까지.' } }, { 'type': 'paragraph', 'data': { 'text': '쉽게 제작하고, 효율적으로 온라인 강의를 체험해보세요' } }], 'version': '2.18.0' };

export const defaultSlideData: SlideState = {
  id: '0',
  originalEditorData: initialData,
  changes: [],
  selectionChanges: [],
};

export let idCounter = 10;

export const createNewSlideData = () => {
  idCounter++;
  return { ...defaultSlideData, id: String(idCounter) };
};

export const slideEditorState = atom<SlideEditorState>({
  key: 'slideEditorState',
  default: {
    currentSlideIndex: 0,
    slides: [createNewSlideData(), createNewSlideData()],
    slideIndexChange: [],
    editingState: EditingState.Editing,
    recordingStartedAt: 0,
    preview: {
      videoObjectUrl: '',
      currentTime: 0,
    }
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
    const { editingState, preview: { currentTime } } = get(slideEditorState);
    const slide = get(slideState(slideIndex));
    if (editingState === EditingState.Recording) {
      return slide.changes.slice(-1)[0]?.data || slide.originalEditorData;
    }
    const isChangeBeforeCurrentTime = (textChange: TextDataChange) => textChange.videoTimestamp <= currentTime;
    const latestChangeBeforeCurrentTime = slide.changes.filter(isChangeBeforeCurrentTime).slice(-1);
    // 최근 수정 사항이 없으면 첫 text로 시작함
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : slide.originalEditorData);
  },
});

export const editorTextDataState = selectorFamily<OutputData | undefined, number>({
  key: 'editorTextDataState',
  get: slideIndex => ({ get }) => {
    return get(latestTextChangeState(slideIndex));
  },
});

export const editorPreviewHighlightState = selectorFamily<EditorTextSelection[] | undefined, number>({
  key: 'editorPreviewHighlightState',
  get: slideIndex => ({ get }) => {
    const { editingState, preview: { currentTime } } = get(slideEditorState);
    if (editingState !== EditingState.Previewing) {
      return;
    }
    const slide = get(slideState(slideIndex));
    const isChangeBeforeCurrentTime = (change: TextSelectionChange) => change.videoTimestamp <= currentTime;
    const latestChangeBeforeCurrentTime = slide.selectionChanges.filter(isChangeBeforeCurrentTime).slice(-1);
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : undefined);
  },
});

export const previewSlideIndexState = selector<number | undefined>({
  key: 'previewSlideIndexState',
  get: ({ get }) => {
    const { preview: { currentTime }, slideIndexChange } = get(slideEditorState);
    const isChangeBeforeCurrentTime = (change: SlideIndexChange) => change.videoTimestamp <= currentTime;
    const latestChangeBeforeCurrentTime = slideIndexChange.filter(isChangeBeforeCurrentTime).slice(-1);
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : undefined);
  }
});
