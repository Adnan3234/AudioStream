import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder10 = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                socketRef.current = new WebSocket('ws://13.127.46.155:8092'); // Replace with your WebSocket server URL
                socketRef.current.onopen = () => {
                    console.log('WebSocket connection established');
                };


                socketRef.current.onmessage = (event) => {
                    // Handle data received from the WebSocket
                    console.log('Received message from server:', event.data);
                };
                socketRef.current.onclose = () => {
                    console.log('WebSocket connection closed');
                };
                socketRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
            }
        };

        initializeSocket();

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            // console.log(';===started')
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.current.push(e.data);
                    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        console.log('sending----')
                        socketRef.current.send(e.data);
                    }
                }
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

                // Convert the Blob to a Uint8Array
                const reader = new FileReader();
                reader.onloadend = () => {
                    const audioByteArray = new Uint8Array(reader.result);

                    // Log or use the audioByteArray as needed
                    console.log(audioByteArray, '-----aaudiobyte array');
                };
                reader.readAsArrayBuffer(audioBlob);

                // Create a download link for the recorded audio
                const audioUrl = URL.createObjectURL(audioBlob);
                const downloadLink = document.createElement('a');
                downloadLink.href = audioUrl;
                downloadLink.download = 'recorded_audio.wav';
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
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
        // Disconnect the socket on stop
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
        }
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

export default AudioRecorder10;
