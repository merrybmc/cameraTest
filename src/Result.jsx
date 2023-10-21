import React from 'react';
import { useRecoilValue } from 'recoil';
import { atomImage, atomResult } from './store';
import { useNavigate, useHistory } from 'react-router-dom';

export default function Result() {
  const image = useRecoilValue(atomImage);
  const result = useRecoilValue(atomResult);
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/')} style={{ backgroundColor: 'yellow' }}>
        다시 찍기
      </button>
      <p>감정 결과1 = {result.one}</p>
      <p>감정 결과2 = {result.two}</p>
      <img src={image} />
    </div>
  );
}
