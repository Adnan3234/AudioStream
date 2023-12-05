import React, { useEffect, useRef, useState } from 'react';
import base64 from 'base64-js';
import pako from 'pako'; // Import the pako library for gzip compression
import { v4 as uuidv4 } from 'uuid';

const NewTry = () => {
    const mediaStreamRef = useRef(null);
    const [isMicPermissionGranted, setIsMicPermissionGranted] = useState(false);
    const [compressedByteStream, setCompressedByteStream] = useState(null);
    const clientRef = useRef(null);
    const [id, setId] = useState('')

    // useEffect(() => {
    //     setId(uuidv4())
    // }, [])
    let startObj = {
        "event": "start",
        "start": {
            "user_id": "",
            "uuid": id
        }
    }

    const [counter, setCounter] = useState(1);
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
            const audioContext = new AudioContext({ sampleRate: 48000 });
            // const audioContext = new AudioContext();
            console.log(audioContext, '--a context---')
            const audioSource = audioContext.createMediaStreamSource(mediaStreamRef.current);
            // console.log(audioContext, '--audio---');
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
            console.log(scriptProcessor, '0sccript---')

            scriptProcessor.addEventListener('audioprocess', (event) => {
                const audioData = event.inputBuffer.getChannelData(0);
                // console.log(audioData, '-audio data---')
                // const byteStream = float32ArrayToByteStream(audioData);
                // console.log(byteStream, '--bytre stream---')

                // Apply compression to the byte stream
                // console.log(audioData, '--audoio data---')
                const compressedData = compressBytes(audioData);
                setCompressedByteStream(compressedData);
            });

            audioSource.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
        }
    }, [isMicPermissionGranted]);



    // useEffect(() => {
    //     if (isMicPermissionGranted) {
    //         const audioContext = new AudioContext({ sampleRate: 16000 });
    //         const audioSource = audioContext.createMediaStreamSource(mediaStreamRef.current);
    //         const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    //         const dynamicsCompressor = audioContext.createDynamicsCompressor();

    //         // Connect nodes
    //         audioSource.connect(dynamicsCompressor);
    //         dynamicsCompressor.connect(scriptProcessor);
    //         scriptProcessor.connect(audioContext.destination);

    //         scriptProcessor.addEventListener('audioprocess', (event) => {
    //             const audioData = event.inputBuffer.getChannelData(0);
    //             // console.log(audioData, '--sudio data0--')
    //             const byteStream = float32ArrayToByteStream(audioData);
    //             // console.log(byteStream, '--bytestream--')
    //             // Apply compression to the byte stream
    //             const compressedData = compressBytes(byteStream);
    //             setCompressedByteStream(compressedData);
    //         });
    //     }
    // }, [isMicPermissionGranted]);


    function compressBytes(inputBytes) {
        const buffer = new ArrayBuffer(inputBytes.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < inputBytes.length; i++) {
            view[i] = inputBytes[i];
        }

        const compressedData = gzipCompress(buffer);
        return compressedData;
    }

    function gzipCompress(data) {
        const compressedData = pako.gzip(data);
        return compressedData;
    }

    function float32ArrayToByteStream(floatArray) {
        const buffer = new ArrayBuffer(floatArray.length * Float32Array.BYTES_PER_ELEMENT);
        const view = new Float32Array(buffer);
        view.set(floatArray);

        return buffer;
    }
    // console.log(compressedByteStream, '--122');
    // console.log(base64.fromByteArray(new Uint8Array(compressedByteStream)), '-hsjhjshsjs')
    useEffect(() => {
        // console.log('entereed')
        if (!clientRef.current) {
            // console.log('issue--')
            // console.log(clientRef, '--ky h')
            // console.log('in--')
            // Create a new WebSocket connection
            let idVal = uuidv4()
            setId(idVal)
            startObj.start.uuid = idVal
            // console.log(startObj, '--start- to send-')
            // const client = new WebSocket('ws://13.127.46.155:8092');
            // const client = new WebSocket('wss://2b75-106-194-100-182.ngrok-free.app');
            // const client = new WebSocket('wss://1dd0-122-180-189-184.ngrok-free.app');
            const client = new WebSocket('wss://94ff-2401-4900-8084-a11d-8051-6dfe-ed23-252f.ngrok-free.app');
            // const client = new WebSocket('wss://helloupi.tonetag.com/wss');
            // const client = new WebSocket('ws://helloupi.tonetag.com/ws');
            clientRef.current = client;
            // console.log(client, '--client------')
            // WebSocket event: on connection open
            client.onopen = () => {
                console.log('WebSocket connection established');
                clientRef.current.send(JSON.stringify(startObj));
                // console.log(startObj, '--stat obj sent--')

            };

            // WebSocket event: on received message
            client.onmessage = (event) => {
                console.log(event, '--event recieved--')
                const message = event.data;
                // Process the received message from the WebSocket server
                console.log('Received message--------:', message);
            };

            client.onerror = (error) => {
                console.log(error, '---error');
            };

            // WebSocket event: on connection close
            client.onclose = (error) => {
                // console.log(error, '--kya hua')
                console.log('WebSocket connection closed');
            };

            // Clean up the WebSocket connection when the component unmounts
            // return () => {
            //     if (clientRef.current) {
            //         clientRef.current.close();
            //     }
            // };
        }
    }, []);



    useEffect(() => {
        // if (compressedByteStream && clientRef.current) {
        if (compressedByteStream && clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
            // console.log('infionite--')
            // Increment the counter value
            setCounter(prevCounter => prevCounter + 1);

            // Send data with an incrementing value
            // const dts = {
            //     value: counter,
            // };
            let mediaData = {
                "event": "media",
                "media": {
                    "chunk": counter,
                    "payload": base64.fromByteArray(new Uint8Array(compressedByteStream)),
                    "uuid": id
                }
            }
            // console.log(mediaData, '--media---')
            // console.log(clientRef, '--client ref--')
            // console.log(JSON.stringify(mediaData), '--actuala datat--')
            clientRef.current.send(JSON.stringify(mediaData));

        }
    }, [compressedByteStream]);
    const handleStopButtonClick = async () => {
        let endObj = { "event": "stop", "uuid": id }
        // console.log(endObj, '--end--')
        // Close the WebSocket connection on the "Stop" button click
        // console.log('--out--')
        if (clientRef.current && clientRef.current.readyState === WebSocket.OPEN) {
            // console.log('in--snj')
            clientRef.current.send(JSON.stringify(endObj));
            clientRef.current.close();
        }
        // const audioContext = new AudioContext();
        // // Stop the audio playback
        // if (audioContext && audioContext.state === 'running') {
        //     audioContext.suspend().then(() => {
        //         console.log('Audio context suspended');
        //     });
        // }

        // // Disable the microphone
        // setIsMicPermissionGranted(false);

        // // Stop the audio stream
        // if (mediaStreamRef.current) {
        //     mediaStreamRef.current.getTracks().forEach((track) => {
        //         track.stop();
        //     });
        // }

        // // Remove the media stream reference
        // mediaStreamRef.current = null;
    };
    // console.log(id, '-id --obj--=')
    const requestMicPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log(stream, '--stream--')
            mediaStreamRef.current = stream;
            setIsMicPermissionGranted(true);
        } catch (error) {
            console.error('Error accessing microphone---:', error);
        }
    };
    return (
        <div>
            <div>Audio Streaming</div>
            {/* {compressedByteStream && (
                <div>
                    Compressed Byte Stream: {base64.fromByteArray(new Uint8Array(compressedByteStream))}
                </div>
            )} */}
            {/* <button onClick={requestMicPermission} className='bg-blue-500 p-4 w-[200px] rounded-md m-5 hover:bg-blue-500/80'>Activate Microphone</button> */}
            {/* <button onClick={() => { clientRef.current.send(JSON.stringify(startObj)); }} className='bg-blue-500 p-4 w-[200px] rounded-md m-5 hover:bg-blue-500/80'>Start</button> */}
            <button onClick={() => { handleStopButtonClick() }} className='bg-blue-500 p-4 w-[200px] rounded-md m-5 hover:bg-blue-500/80'>Stop</button>
        </div>
    );
};

export default NewTry;
