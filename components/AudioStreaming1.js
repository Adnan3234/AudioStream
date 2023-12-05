import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
const AudioStreaming1 = () => {
    const mediaStreamRef = useRef(null);
    const [isMicPermissionGranted, setIsMicPermissionGranted] = useState(false);
    const [byteStream, setByteStream] = useState(null);
    const clientRef = useRef(null);
    const [count, setCount] = useState(0)

    // {
    //     "event": "start",
    //     "start": {"user_id":"","uuid":"1234"}
    //     }

    //     {"event": "stop","uuid":"1234"}


    //     {"event": "media",
    // "media": {
    // "chunk": chunk_seq,
    // "payload": chunk(gzipped),
    // "uuid":"1234"
    // }}
    // const myUuid = uuidv4();
    // console.log(myUuid, '--id---')
    // let obj = {
    //     "event": "start",
    //     "start": {
    //         "user_id": "",
    //         "uuid": myUuid
    //     }
    // }
    // console.log(obj, '--data-')

    useEffect(() => {
        const requestMicPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // console.log(stream, '--stream--')
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
            // Start streaming audio data
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(mediaStreamRef.current);
            // console.log(audioSource, '--audio Source---')
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessor.addEventListener('audioprocess', (event) => {
                const audioData = event.inputBuffer.getChannelData(0);
                // Convert audioData to byte stream
                const byteStream = float32ArrayToByteStream(audioData);
                // console.log(byteStream, '--byte stream--0')
                // Set the byte stream state
                setByteStream(byteStream);
            });

            audioSource.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
        }
    }, [isMicPermissionGranted]);
    // console.log(byteStream, '--byte stream---')
    useEffect(() => {
        // Create a new WebSocket connection
        return
        const client = new WebSocket('ws://13.127.46.155:8092');
        clientRef.current = client;
        console.log(client, '--client------')
        // WebSocket event: on connection open
        client.onopen = () => {
            console.log('WebSocket connection established');

            // Now that the connection is open, you can send data
            // sendData(client);


            // sendByteStream(byteStream);
        };

        // WebSocket event: on received message
        client.onmessage = (event) => {
            const message = event.data;
            // Process the received message from the WebSocket server
            console.log('Received message--------:', message);
        };

        client.onerror = (error) => {
            console.log(error, '---error');
        };

        // WebSocket event: on connection close
        client.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Clean up the WebSocket connection when the component unmounts
        // return () => {
        //     if (clientRef.current) {
        //         clientRef.current.close();
        //     }
        // };
    }, []);

    // Function to send data over the WebSocket
    function sendData(client) {
        if (byteStream) {
            // console.log(byteStream, '-h')
            client.send(byteStream);
            // clientRef.current.send('hi you')
        }
    }


    // const sendStream

    // Convert Float32Array to byte stream
    function float32ArrayToByteStream(floatArray) {
        const buffer = new ArrayBuffer(floatArray.length * Float32Array.BYTES_PER_ELEMENT);
        const view = new Float32Array(buffer);
        view.set(floatArray);

        return buffer;
    }


    // Send the byte stream through the WebSocket connection
    function sendByteStream(byteStream) {
        if (clientRef.current) {
            console.log('sending data')
            clientRef.current.send(byteStream);
        }
    }

    // // Convert byte stream to audio
    // function byteStreamToAudio() {
    //     if (byteStream) {
    //         const audioContext = new AudioContext();
    //         const audioBuffer = audioContext.createBuffer(1, byteStream.byteLength / 4, audioContext.sampleRate);
    //         const channelData = audioBuffer.getChannelData(0);
    //         const floatView = new Float32Array(byteStream);
    //         channelData.set(floatView);

    //         const source = audioContext.createBufferSource();
    //         source.buffer = audioBuffer;
    //         source.connect(audioContext.destination);
    //         source.start();
    //     }
    // }


    // Function to convert byte stream to audio and text
    // Function to convert byte stream to audio and text
    function byteStreamToAudioAndText() {
        if (byteStream) {
            // Convert byte stream to audio
            const audioContext = new AudioContext();
            const audioBuffer = audioContext.createBuffer(1, byteStream.byteLength / Float32Array.BYTES_PER_ELEMENT, audioContext.sampleRate);
            const channelData = new Float32Array(audioBuffer.getChannelData(0));
            channelData.set(new Float32Array(byteStream));

            const audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(audioContext.destination);
            audioSource.start();

            // Convert byte stream to text
            const textDecoder = new TextDecoder('utf-8');
            const text = textDecoder.decode(new Uint8Array(byteStream));
            console.log('Decoded Text:', text);
        }
    }


    let x = 0

    useEffect(() => {

        // byteStreamToAudio()
        // byteStreamToAudioAndText()
    }, [byteStream])

    return (
        <div>
            <div>Audio Streaming</div>
            {/* <button onClick={byteStreamToAudioAndText} disabled={!byteStream}>
                Decode Audio
            </button> */}
            {/* <div>
                <p>Decoded Text: {decodedText}</p>
            </div> */}
            {/* <button onClick={() => { sendHi() }}>Send Hi</button> */}
        </div>
    );
};

export default AudioStreaming1;



// // Convert byte stream to audio
// function byteStreamToAudio() {
//     if (byteStream) {
//         const audioContext = new AudioContext();
//         const audioBuffer = audioContext.createBuffer(1, byteStream.byteLength / 4, audioContext.sampleRate);
//         const channelData = audioBuffer.getChannelData(0);
//         const floatView = new Float32Array(byteStream);
//         channelData.set(floatView);

//         const source = audioContext.createBufferSource();
//         source.buffer = audioBuffer;
//         source.connect(audioContext.destination);
//         source.start();
//     }
// }

// const sendHi = () => {
//     // const client = new WebSocket('ws://127.0.0.1:8000');
//     const client = new WebSocket('ws://13.233.140.184:8900');
//     clientRef.current = client;
//     // WebSocket event: on connection open
//     // client.onopen = () => {
//     //     console.log('WebSocket connection established');
//     //     console.log(byteStream, '-bytestream');
//     //     sendByteStream(byteStream);
//     // };

//     // // WebSocket event: on received message
//     // client.onmessage = (event) => {
//     //     const message = event.data;
//     //     // Process the received message from the WebSocket server
//     //     console.log('Received message:', message);
//     // };

//     console.log('in--')
//     // // test code
//     client.onopen = () => {
//         console.log('WebSocket connection opened');
//         client.send('Hello from the client:Adnan');
//     };

//     client.onmessage = (event) => {
//         console.log(`Received message from server: ${event.data}`);
//     };

//     client.onerror = (error) => {
//         console.log(error, '---error')
//     }
//     // WebSocket event: on connection close
//     client.onclose = () => {
//         console.log('WebSocket connection closed');
//     };


// }
