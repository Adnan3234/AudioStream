import React, { useEffect, useRef, useState } from 'react';

const AudioStreaming = () => {
    const mediaStreamRef = useRef(null);
    const [isMicPermissionGranted, setIsMicPermissionGranted] = useState(false);
    const [byteStream, setByteStream] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        const requestMicPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                setIsMicPermissionGranted(true);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        requestMicPermission();

        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

    useEffect(() => {
        if (isMicPermissionGranted) {
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
        }
    }, [isMicPermissionGranted]);

    useEffect(() => {
        // Establish the WebSocket connection once
        if (!clientRef.current) {
            const client = new WebSocket('ws://65.2.9.250:9090');
            clientRef.current = client;

            client.onopen = () => {
                console.log('WebSocket connection established');
            };

            client.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            client.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }
    }, []);

    useEffect(() => {
        // Send the byte stream when available
        if (byteStream && clientRef.current) {
            // console.log(byteStream)
            // clientRef.current.send(byteStream);
        }
    }, [byteStream]);

    function float32ArrayToByteStream(floatArray) {
        const buffer = new ArrayBuffer(floatArray.length * Float32Array.BYTES_PER_ELEMENT);
        const view = new Float32Array(buffer);
        view.set(floatArray);
        return buffer;
    }

    return (
        <div>
            <div>Audio Streaming</div>
        </div>
    );
};

export default AudioStreaming;
