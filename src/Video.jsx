import { useRef, useEffect, useState } from 'react';
// import './app.css';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { atomImage, atomResult } from './store';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

function Video() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [color, setColor] = useState('#ddd');
  const [image, setImage] = useRecoilState(atomImage);
  const setResult = useSetRecoilState(atomResult);
  const navigate = useNavigate();
  const [buttonColor, setButtonColor] = useState('#ddd');
  const [btnState, setBtnState] = useState(true);

  // 마운트 될 때 카메라 실행
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // 카메라 켜기
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        console.log(videoRef.current.srcObject);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // api 호출
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

  // 감정상태 파악
  const faceMyDetect = () => {
    setInterval(async () => {
      if (videoRef.current && videoRef.current.videoWidth !== 0) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // 감정 상태 표현
        // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        // faceapi.matchDimensions(canvasRef.current, {
        //   width: videoRef.current.videoWidth,
        //   height: videoRef.current.videoHeight,
        // });

        // faceapi.draw.drawDetections(canvasRef.current, resized);
        // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

        if (detections && detections.length > 0) {
          setColor('cyan');
          setButtonColor('yellow');
          setBtnState(false);
          detections.forEach((detection, i) => {
            const expressions = detection.expressions;
            console.log(expressions);

            const keys = Object.keys(expressions);
            keys.sort((a, b) => expressions[b] - expressions[a]);

            const firstLargestExpression = keys[0];
            const secondLargestExpression = keys[1];

            setResult({
              one: '1순위 : ' + emotion(firstLargestExpression),
              two: '2순위 : ' + emotion(secondLargestExpression),
            });
            console.log(` ${firstLargestExpression}`);
            console.log(` ${secondLargestExpression}`);
          });
        }
      }
    }, 200);
  };

  const emotion = (result) => {
    switch (result) {
      case 'surprised':
        return '행복함';
      case 'happy':
        return '행복함';
      case 'disgusted':
        return '화남';
      case 'angry':
        return '화남';
      case 'fearful':
        return '슬픔';
      case 'sad':
        return '슬픔';
      default:
        return '무표정';
    }
  };

  // 이미지 캡쳐
  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 이미지 URL 뽑아내기
      const imageURL = canvas.toDataURL('image/png');
      // You can upload the imageURL or perform any other operations

      setImage(imageURL);

      // 이미지 저장
      // For saving the image, you can use the following code
      // const link = document.createElement('a');
      // link.href = imageURL;
      // link.download = 'image.png';
      // link.click();

      navigate('/result');
    }
  };

  return (
    <div className='myapp'>
      <h1 style={{ backgroundColor: color }}>삼김조 프로토타입</h1>
      <div className='appvide'>
        <video
          crossOrigin='anonymous'
          style={{ width: 400, height: 400 }}
          ref={videoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: 'none', backgroundColor: 'black' }}
        width='440'
        height='650'
        className='appcanvas'
      />
      {/* <button onClick={startVideo}>Start Camera</button> */}
      <button
        onClick={captureImage}
        style={{ backgroundColor: buttonColor, color: 'black' }}
        disabled={btnState}
      >
        Capture
      </button>
    </div>
  );
}

export default Video;
