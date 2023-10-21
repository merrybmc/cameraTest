import React from 'react';
import { useRecoilValue } from 'recoil';
import { atomImage, atomResult } from './store';

export default function Result() {
  const image = useRecoilValue(atomImage);
  const result = useRecoilValue(atomResult);
  return (
    <div>
      <p>감정 결과 = {result.one}</p>
      <p>감정 결과 = {result.two}</p>
      <img src={image} />
    </div>
  );
}
