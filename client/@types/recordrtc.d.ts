declare module 'recordrtc' {
  type AvilableMediaStreams = MediaStream | HTMLCanvasElement | HTMLVideoElement | HTMLElement;

  interface RecordRTCOptions {
    type?: 'video',
    mimeType?: 
      | 'audio/webm'
      | 'video/webm;codecs=vp9'
      | 'video/webm;codecs=vp8'
      | 'video/webm;codecs=h264'
      | 'video/x-matroska;codecs=avc1'
      | 'video/mpeg'
      | 'video/mp4'
      | 'audio/wav'
      | 'audio/ogg';

    recorderType?: MediaStreamRecorder | StereoAudioRecorder | WebAssemblyRecorder | CanvasRecorder | GifRecorder | WhammyRecorder;
    disableLogs?: boolean;

    timeSlice?: number;
    ondataavailable?: (blob: Blob) => void;
    checkForInactiveTracks?: boolean;
    onTimeStamp?: () => void;
    bitsPerSecond?: number;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    frameInterval?: number;
    previewStream?: (stream: Stream) => void;

    // used by CanvasRecorder and WhammyRecorder
    // you can pass {width:640, height: 480} as well
    video?: {width: number, height: number},

    // used by CanvasRecorder and WhammyRecorder
    canvas?: {
        width: 640,
        height: 480
    },

    // the range 22050 to 96000.
    sampleRate?: number;
    // the range 22050 to 96000.
    desiredSampRate?: number;
    bufferSize?: 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384;
    numberOfAudioChannels?: 1 | 2;
  }
  export default class RecordRTC {
    constructor(stream: AvilableMediaStreams, {type}: RecordRTCOptions)

    // start the recording
    startRecording: () => void;

    // stop the recording
    // getBlob inside callback function
    stopRecording: (cb: () => void) => void;

    // pause the recording
    pauseRecording: () => void;

    // resume the recording
    resumeRecording: () => void;

    // auto stop recording after specific duration
    setRecordingDuration: () => void;

    // reset recorder states and remove the data
    reset: () => void;

    // invoke save as dialog
    save: (fileName: string) => void;

    // returns recorded Blob
    getBlob: () => Blob;

    // returns Blob-URL
    toURL: () => string;

    // returns Data-URL
    getDataURL: (dataURL: string) => void;

    // returns internal recorder
    getInternalRecorder: () => void;

    // initialize the recorder [deprecated]
    initRecorder: () => void;

    // fired if recorder's state changes
    onStateChanged: (state: any) => void;

    // write recorded blob into indexed-db storage
    writeToDisk: (audio: Blob, video: Blob, gif: Blob) => void;

    // get recorded blob from indexded-db storage
    getFromDisk: (dataURL: string, type: any) => void;

    // clear memory; clear everything
    destroy: () => void;

    // get recorder's state
    getState: () => void;

    // [readonly] property: recorder's state
    state: string;

    // recorded blob [readonly] property
    blob: Blob;

    // [readonly] array buffer; useful only for StereoAudioRecorder
    buffer: ArrayBuffer;

    // RecordRTC version [readonly]
    version: string;

    // [readonly] useful only for StereoAudioRecorder
    bufferSize: integer;

    // [readonly] useful only for StereoAudioRecorder
    sampleRate: integer;
  }
}
