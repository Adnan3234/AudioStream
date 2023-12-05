import React, { useEffect, useRef, useState } from 'react';

const AudioStreamingWithSpeechRecognition = () => {
    const mediaStreamRef = useRef(null);
    const [isMicPermissionGranted, setIsMicPermissionGranted] = useState(false);
    const [byteStream, setByteStream] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        const requestMicPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log(stream, '--stream--')
                mediaStreamRef.current = stream;
                setIsMicPermissionGranted(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        const initializeSpeechRecognition = () => {
            if ('SpeechRecognition' in window) {
                // Standard
                recognitionRef.current = new window.SpeechRecognition();
            } else if ('webkitSpeechRecognition' in window) {
                // Webkit
                recognitionRef.current = new window.webkitSpeechRecognition();
            } else {
                console.error('Speech recognition not supported in this browser.');
                return;
            }

            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join(' ');

                setRecognizedText(transcript);
            };

            recognitionRef.current.onend = () => {
                // Restart recognition when it ends
                recognitionRef.current.start();
            };
        };

        requestMicPermission();
        initializeSpeechRecognition();

        return () => {
            // Clean up the resources
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (isMicPermissionGranted) {
            // Start streaming audio data
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(mediaStreamRef.current);
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessor.addEventListener('audioprocess', (event) => {
                const audioData = event.inputBuffer.getChannelData(0);
                const byteStream = float32ArrayToByteStream(audioData);
                setByteStream(byteStream);
            });

            audioSource.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            // Start speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        }
    }, [isMicPermissionGranted]);

    function float32ArrayToByteStream(floatArray) {
        const buffer = new ArrayBuffer(floatArray.length * Float32Array.BYTES_PER_ELEMENT);
        const view = new Float32Array(buffer);
        view.set(floatArray);

        return buffer;
    }

    return (
        <div>
            <div>Audio Streaming</div>
            <div>Recognized Text: {recognizedText}</div>
        </div>
    );
};

export default AudioStreamingWithSpeechRecognition;
