import { useRef, useEffect, useState } from 'react';
// import './app.css';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { atomImage, atomResult } from './store';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

function Video() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [Emotion, setEmotion] = useState('');
  const [color, setColor] = useState('black');
  const [image, setImage] = useRecoilState(atomImage);
  const setResult = useSetRecoilState(atomResult);
  const navigate = useNavigate();

  // LOAD FROM USEEFFECT
  useEffect(() => {
    videoRef && loadModels();
  }, []);

  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      if (videoRef.current && videoRef.current.videoWidth !== 0) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // DRAW YOUR FACE IN WEBCAM
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        faceapi.matchDimensions(canvasRef.current, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        // faceapi.draw.drawDetections(canvasRef.current, resized);
        // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

        if (detections && detections.length > 0) {
          setColor('cyan');
          detections.forEach((detection, i) => {
            const expressions = detection.expressions;
            console.log(expressions);

            const keys = Object.keys(expressions);
            keys.sort((a, b) => expressions[b] - expressions[a]);

            const firstLargestExpression = keys[0];
            const secondLargestExpression = keys[1];
            setResult({ one: firstLargestExpression, two: secondLargestExpression });
            console.log(` ${firstLargestExpression}`);
            console.log(` ${secondLargestExpression}`);

            // setEmotion(firstLargestExpression);
            // setEmotion(secondLargestExpression);
          });
        }
      }
    }, 1000);
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Save the image here or perform any other operations with the image
      const imageURL = canvas.toDataURL('image/png');
      // You can upload the imageURL or perform any other operations

      setImage(imageURL);
      // For saving the image, you can use the following code
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'image.png';
      link.click();

      navigate('/result');
    }
  };

  return (
    <div className='myapp'>
      <h1 style={{ backgroundColor: color }}>FAce Detection</h1>
      {image === '' ? (
        <>
          <div className='appvide'>
            <video crossOrigin='anonymous' ref={videoRef} autoPlay></video>
          </div>
          <canvas ref={canvasRef} width='440' height='650' className='appcanvas' />
          <button onClick={startVideo}>Start Camera</button>
          <button onClick={captureImage}>Capture</button>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default Video;
