import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Video from '../Video';
import Result from '../Result';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<Video />}></Route>
      <Route path='/result' element={<Result />}></Route>
      Router
    </Routes>
  );
}
