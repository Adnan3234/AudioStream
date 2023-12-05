import React, { useEffect, useRef, useState } from 'react';

const Audio3 = () => {
    const mediaStreamRef = useRef(null);
    const [isMicPermissionGranted, setIsMicPermissionGranted] = useState(false);
    const clientRef = useRef(null);
    const byteStreamBuffer = useRef([]);

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
            // Clean up the resources
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
                byteStreamBuffer.current.push(float32ArrayToByteStream(audioData));
            });

            audioSource.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
        }
    }, [isMicPermissionGranted]);

    useEffect(() => {
        console.log(byteStreamBuffer.current, '--byte')
        if (byteStreamBuffer.current.length > 0) {
            if (!clientRef.current || clientRef.current.readyState !== WebSocket.OPEN) {
                clientRef.current = new WebSocket('ws://65.2.9.250:9090');
                // clientRef.current = new WebSocket('ws://127.0.0.1:8000');

                clientRef.current.onopen = () => {
                    console.log('WebSocket connection established');
                    sendByteStreamBatch();
                };

                clientRef.current.onclose = () => {
                    console.log('WebSocket connection closed');
                };
            } else {
                sendByteStreamBatch();
            }
        }
    }, [byteStreamBuffer.current]);

    function sendByteStreamBatch() {
        if (byteStreamBuffer.current.length > 0 && clientRef.current.readyState === WebSocket.OPEN) {
            const byteStreamArray = byteStreamBuffer.current.splice(0, byteStreamBuffer.current.length);
            const combinedByteStream = mergeByteStreams(byteStreamArray);
            console.log('Sending batch of byte streams');
            clientRef.current.send(combinedByteStream);
        }
    }

    function mergeByteStreams(byteStreamArray) {
        const totalLength = byteStreamArray.reduce((total, byteStream) => total + byteStream.byteLength, 0);
        const mergedBuffer = new Uint8Array(totalLength);
        let offset = 0;
        byteStreamArray.forEach(byteStream => {
            mergedBuffer.set(new Uint8Array(byteStream), offset);
            offset += byteStream.byteLength;
        });
        return mergedBuffer.buffer;
    }

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

export default Audio3;
