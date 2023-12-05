import React, { useState, useEffect } from 'react';

const Socket = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
        // Initialize WebSocket connection
        const newSocket = new WebSocket('ws://127.0.0.1:8000');

        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newSocket.onmessage = (event) => {
            setReceivedMessage(event.data);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(newSocket);
    }, []);

    // Clean up WebSocket on component unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);


    const sendMessage = () => {
        if (socket) {
            console.log(socket, '--socket---')
            socket.send(message);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>WebSocket Example</h2>
            <div>
                <div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div>
                    <p>Received: {receivedMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default Socket;
