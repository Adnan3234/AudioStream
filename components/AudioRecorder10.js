

import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            mediaRecorder.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus', // Use a compatible MIME type
            });

            mediaRecorder.current.ondataavailable = (e) => {
                console.log('Data available:', e.data);
                if (e.data.size > 0) {
                    audioChunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                console.log('Recording stopped. Data:', audioChunks.current);

                // Convert 'audio/webm;codecs=opus' to 'audio/wav'
                convertToWav(audioChunks.current);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const convertToWav = (audioChunks) => {
        // Implement audio conversion logic here
        // Use libraries like ffmpeg.js or an external service for this task
        // Update the audioChunks and audioBlob accordingly
        // For simplicity, let's assume audioChunks and audioBlob remain the same for now

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        // Log the size and type of the Blob
        console.log('Blob size:', audioBlob.size);
        console.log('Blob type:', audioBlob.type);

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(audioBlob);
        downloadLink.download = 'recorded_audio.wav';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Update the audio element with the recorded audio
        if (audioRef.current) {
            audioRef.current.src = URL.createObjectURL(audioBlob);
            audioRef.current.play();
        }

        // Clear audioChunks for the next recording
        audioChunks.current = [];
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <audio ref={audioRef} controls />
        </div>
    );
};

export default AudioRecorder;




// import React, { useState, useRef } from 'react';
// import base64 from 'base64-js';
// import pako from 'pako';
// import { v4 as uuidv4 } from 'uuid';

// const AudioRecorder = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);
//     const audioRef = useRef(null);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: {
//                 sampleRate: 16000, // Set the desired sampling rate
//             },
//         });

//         mediaRecorder.current = new MediaRecorder(stream, {
//             audioBitsPerSecond: 16000 * 16, // 16-bit audio at 16000 Hz
//             bufferSize: 1024, // Set the desired buffer size
//         });

//         mediaRecorder.current.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//                 audioChunks.current.push(e.data);
//                 console.log(e.data, '--data---jskjsjks');
//             }
//         };

//         mediaRecorder.current.onstop = () => {
//             const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' }); // Specify the MIME type here

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const audioByteArray = new Uint8Array(reader.result);
//                 const compressedData = compressBytes(audioByteArray);
//                 // console.log(compressedData, '--cDta---');
//             };
//             reader.readAsArrayBuffer(audioBlob);

//             const audioUrl = URL.createObjectURL(audioBlob);
//             const downloadLink = document.createElement('a');
//             downloadLink.href = audioUrl;
//             downloadLink.download = 'new_recorded_audio.wav';
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);

//             if (audioRef.current) {
//                 audioRef.current.src = audioUrl;
//                 audioRef.current.play();
//             }

//             audioChunks.current = [];
//         };

//         mediaRecorder.current.start();
//         setIsRecording(true);
//     };

//     const compressBytes = (inputBytes) => {
//         const buffer = new ArrayBuffer(inputBytes.length);
//         const view = new Uint8Array(buffer);
//         for (let i = 0; i < inputBytes.length; i++) {
//             view[i] = inputBytes[i];
//         }

//         const compressedData = gzipCompress(buffer);
//         // console.log(compressedData, '--compressed data--');
//         return compressedData;
//     };

//     const gzipCompress = (data) => {
//         const compressedData = pako.gzip(data);
//         return compressedData;
//     };

//     const stopRecording = () => {
//         if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//             mediaRecorder.current.stop();
//             setIsRecording(false);
//         }
//     };

//     console.log(audioChunks, '--audio---');

//     return (
//         <div>
//             <button onClick={isRecording ? stopRecording : startRecording}>
//                 {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </button>
//             <audio ref={audioRef} controls />
//         </div>
//     );
// };

// export default AudioRecorder;
