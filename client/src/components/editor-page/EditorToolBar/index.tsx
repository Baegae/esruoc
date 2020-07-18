import React from 'react';
import { Row, Col } from 'react-grid-system';
import CTAButton from '@src/components/common/CTAButton';
import FlatButton from '@src/components/common/FlatButton';

import * as S from './styles';

interface EditorToolBarProps {
  name: string;
  lectureName: string;
  onNameChanged?: React.ChangeEventHandler;
}

const EditorToolBar: React.FC<EditorToolBarProps> = ({
  onNameChanged = console.log,
  name = '노래방 가고 싶다. 그럴 땐 가는게 맞다.',
  lectureName = '길범준의 노래방 강의',
}) => {
  return (
    <S.ToolbarWrapper fluid>
      <Row align="center">
        <Col>
          <S.TitleWrapper>
            <S.Symbol />
            <div>
              <input
                type="text"
                value={name}
                placeholder="새로운 강의 이름"
                onChange={onNameChanged}
                disabled={!onNameChanged}
              />
              <p>{lectureName}</p>
            </div>
          </S.TitleWrapper>
        </Col>
        <Col>
          <S.ButtonWrapper>
            <FlatButton>임시저장(?)</FlatButton>
            <div style={{width: 24}}/>
            <CTAButton>업로드</CTAButton>
          </S.ButtonWrapper>
        </Col>
      </Row>
    </S.ToolbarWrapper>
  );
};

export default EditorToolBar;
