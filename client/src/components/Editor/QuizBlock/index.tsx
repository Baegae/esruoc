import { API as EditorJSAPI } from '@editorjs/editorjs';
import React, { useState, useRef, ChangeEventHandler, KeyboardEventHandler, useEffect } from 'react';

interface QuizBlocProps {
  api: EditorJSAPI;
  data?: QuizData;
}

export interface QuizData {
  question: string;
}

const INITIAL_QUIZ_DATA: QuizData = {
  question: 'test',
};

const QuizBlock: React.FC<QuizBlocProps> = ({ api, data }) => {
  const [quizData, setQuizData] = useState(data || INITIAL_QUIZ_DATA);

  useEffect(() => {
    console.log(quizData);
  }, [quizData]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuizData({question: event.currentTarget.value});
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.keyCode === 8 && quizData.question.trim().length === 0) {
      api.blocks.delete();
    }
  };

  return (
    <input type="text"
      value={quizData.question}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default QuizBlock;
