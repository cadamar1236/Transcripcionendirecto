import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

// Conecta con el servidor de Socket.io (ajusta la URL según tu configuración)
const socket = io('http://localhost:3000');

const LiveClass = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [transcription, setTranscription] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    // Configura la transmisión de video
    const constraints = { video: true, audio: true };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };
      })
      .catch(err => console.error('Error accessing media devices:', err));

    // Escucha las transcripciones del servidor
    socket.on('transcription', (data) => {
      setTranscription(data);
    });

    // Limpieza al desmontar el componente
    return () => {
      socket.off('transcription');
    };
  }, []);

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'class-recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Clase en Vivo</h2>
      <video ref={videoRef} controls autoPlay playsInline muted style={{ width: '100%' }}></video>
      <div>
        {recording ? (
          <button onClick={stopRecording}>Detener Grabación</button>
        ) : (
          <button onClick={startRecording}>Iniciar Grabación</button>
        )}
        <button onClick={downloadRecording} disabled={!recordedChunks.length}>Descargar Grabación</button>
      </div>
      <div>
        <h3>Transcripción en Vivo</h3>
        <p>{transcription}</p>
      </div>
    </div>
  );
};

export default LiveClass;
