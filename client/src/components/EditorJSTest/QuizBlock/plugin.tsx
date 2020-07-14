import React from 'react';
import ReactDOM from 'react-dom';
import {
  BlockTool,
  // BlockToolConstructable,
  BlockToolConstructorOptions,
  API as EditorJSAPI,
} from '@editorjs/editorjs';
import QuizBlock, { QuizData } from '.';

interface PluginData {
  quizData?: QuizData;
}

export default class QuizBlockPlugin implements BlockTool {
  private data: PluginData;
  private api: EditorJSAPI;

  constructor({ data, api }: BlockToolConstructorOptions<PluginData>) {
    this.data = data;
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Quiz',
      // todo: dummy svg
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  static get sanitize() {
    return {};
  }

  save = () => {
    return {};
  };

  render() {
    const el = document.createElement('div');
    ReactDOM.render(
      <QuizBlock api={this.api}
        data={this.data.quizData}
      />, el
    );
    return el;
  }
}
