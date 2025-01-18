import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null); // To store the audio URL for playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = async () => {
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setAudioURL(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
        audioChunksRef.current = [];
        setAudioURL(URL.createObjectURL(audioBlob)); // Create an object URL for the audio
        sendAudioToBackend(audioBlob);
      };
    }
    setIsRecording(false);
  };

  // Send audio data to backend
  const sendAudioToBackend = async (audioBlob: Blob) => {
    console.log("in send audio to backend")
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      console.log("form data: ", typeof(formData))
      const response = await axios.post('http://localhost:5000/upload-audio', formData);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>

      {audioURL && (
        <div>
          <h3>Recorded Audio</h3>
          <audio controls>
            <source src={audioURL} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
