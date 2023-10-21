import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

export default function App() {
  const videoRef = useRef();
  const canvasRef = useRef();

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Save the image here or perform any other operations with the image
      const imageURL = canvas.toDataURL('image/png');
      // You can upload the imageURL or perform any other operations

      // For saving the image, you can use the following code
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'image.png';
      link.click();
    }
  };

  const handleStartCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing the camera: ', error);
        });
    }
  };

  return (
    <div>
      <div>
        <video style={{ width: 400, height: 300 }} ref={videoRef} autoPlay playsInline></video>
      </div>
      <div>
        <canvas style={{ display: 'none' }} ref={canvasRef} width={400} height={300}></canvas>
      </div>
      <div>
        <button onClick={captureImage}>Capture</button>
        <button onClick={handleStartCapture}>Start Camera</button>
      </div>
    </div>
  );
}
