// import React, { useState, useRef, useEffect } from 'react';
// import pako from 'pako'; // Import the pako library for gzip compression

// const AudioRecorder = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);
//     const audioRef = useRef(null);

//     useEffect(() => {
//         const handleAudioProcess = (event) => {
//             const audioData = event.inputBuffer.getChannelData(0);

//             // Log or process the audio data in real-time
//             // console.log(audioData, '--real-time audio data--');
//         };

//         if (isRecording) {
//             const audioContext = new AudioContext();
//             const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
//             scriptProcessor.addEventListener('audioprocess', handleAudioProcess);

//             const source = audioContext.createMediaStreamSource(mediaRecorder.current.stream);
//             source.connect(scriptProcessor);
//             scriptProcessor.connect(audioContext.destination);
//         }

//         return () => {
//             // Cleanup logic if needed
//         };
//     }, [isRecording]);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder.current = new MediaRecorder(stream);

//         mediaRecorder.current.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//                 audioChunks.current.push(e.data);
//             }
//         };

//         mediaRecorder.current.onstop = () => {
//             // Your existing onstop logic
//             const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             audioRef.current.src = audioUrl;
//             audioRef.current.play();
//             audioChunks.current = [];
//         };

//         mediaRecorder.current.start();
//         setIsRecording(true);
//     };

//     const stopRecording = () => {
//         if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//             mediaRecorder.current.stop();
//             setIsRecording(false);
//         }
//     };

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









import React, { useState, useRef } from 'react';
import base64 from 'base64-js';
import pako from 'pako';
import { v4 as uuidv4 } from 'uuid';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000, // Set the desired sampling rate
            },
        });
        mediaRecorder.current = new MediaRecorder(stream, {
            audioBitsPerSecond: 16000 * 16, // 16-bit audio
            bufferSize: 1024, // Set the desired buffer size
        });

        mediaRecorder.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.current.push(e.data);
                console.log(e.data, '--data---jskjsjks');
            }
        };

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

            // Convert the Blob to a Uint8Array
            const reader = new FileReader();
            reader.onloadend = () => {
                const audioByteArray = new Uint8Array(reader.result);

                // Log or use the audioByteArray as needed
                // console.log(audioByteArray, '--valuwe-');
                const compressedData = compressBytes(audioByteArray);
                // console.log(compressedData, '--cDta---');
            };
            reader.readAsArrayBuffer(audioBlob);

            // Create a download link for the recorded audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = audioUrl;
            downloadLink.download = 'new_recorded_audio.wav';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Play the recorded audio
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }

            // Reset for the next recording
            audioChunks.current = [];
        };

        mediaRecorder.current.start();
        setIsRecording(true);
    };

    const compressBytes = (inputBytes) => {
        const buffer = new ArrayBuffer(inputBytes.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < inputBytes.length; i++) {
            view[i] = inputBytes[i];
        }

        const compressedData = gzipCompress(buffer);
        // console.log(compressedData, '--compressed data--');
        return compressedData;
    };

    const gzipCompress = (data) => {
        const compressedData = pako.gzip(data);
        return compressedData;
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    console.log(audioChunks, '--audio---');

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
// import pako from 'pako'; // Import the pako library for gzip compression
// import { v4 as uuidv4 } from 'uuid';

// const AudioRecorder = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);
//     const audioRef = useRef(null);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder.current = new MediaRecorder(stream);

//         mediaRecorder.current.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//                 audioChunks.current.push(e.data);
//                 console.log(e.data, '--data---jskjsjks')
//             }
//         };

//         mediaRecorder.current.onstop = () => {
//             const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

//             // Convert the Blob to a Uint8Array
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const audioByteArray = new Uint8Array(reader.result);

//                 // Log or use the audioByteArray as needed
//                 // console.log(audioByteArray, '--valuwe-');
//                 const compressedData = compressBytes(audioByteArray);
//                 // console.log(compressedData, '--cDta---')

//             };
//             reader.readAsArrayBuffer(audioBlob);

//             // Create a download link for the recorded audio
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const downloadLink = document.createElement('a');
//             downloadLink.href = audioUrl;
//             downloadLink.download = 'new_recorded_audio.wav';
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);

//             // Play the recorded audio
//             if (audioRef.current) {
//                 audioRef.current.src = audioUrl;
//                 audioRef.current.play();
//             }

//             // Reset for the next recording
//             audioChunks.current = [];
//         };

//         mediaRecorder.current.start();
//         setIsRecording(true);
//     };






//     function compressBytes(inputBytes) {
//         const buffer = new ArrayBuffer(inputBytes.length);
//         const view = new Uint8Array(buffer);
//         for (let i = 0; i < inputBytes.length; i++) {
//             view[i] = inputBytes[i];
//         }

//         const compressedData = gzipCompress(buffer);
//         // console.log(compressedData, '--compreasseg data--')
//         return compressedData;
//     }

//     function gzipCompress(data) {
//         const compressedData = pako.gzip(data);
//         return compressedData;
//     }
//     const stopRecording = () => {
//         if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//             mediaRecorder.current.stop();
//             setIsRecording(false);
//         }
//     };
//     console.log(audioChunks, '--sudio---')
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






















// import React, { useState, useRef } from 'react';

// const AudioRecorder = () => {
//     const [isRecording, setIsRecording] = useState(false);
//     const mediaRecorder = useRef(null);
//     const audioChunks = useRef([]);
//     const audioRef = useRef(null);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder.current = new MediaRecorder(stream);

//         mediaRecorder.current.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//                 audioChunks.current.push(e.data);
//             }
//         };

//         mediaRecorder.current.onstop = () => {
//             const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

//             // Create a download link for the recorded audio
//             const audioUrl = URL.createObjectURL(audioBlob);
//             const downloadLink = document.createElement('a');
//             downloadLink.href = audioUrl;
//             downloadLink.download = 'recorded_audio.wav';
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);

//             // Play the recorded audio
//             if (audioRef.current) {
//                 audioRef.current.src = audioUrl;
//                 audioRef.current.play();
//             }

//             // Reset for the next recording
//             audioChunks.current = [];
//         };

//         mediaRecorder.current.start();
//         setIsRecording(true);
//     };

//     const stopRecording = () => {
//         if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//             mediaRecorder.current.stop();
//             setIsRecording(false);
//         }
//     };

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
