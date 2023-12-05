import React, { useState, useEffect } from 'react';

function Refresh() {
    const [preventUnload, setPreventUnload] = useState(true);
    const [x, setx] = useState(0)

    useEffect(() => {
        console.log(preventUnload, '--jsjs')
        const beforeUnloadHandler = (e) => {
            console.log('in----')
            if (preventUnload) {
                e.preventDefault();
                e.returnValue = ''; // This is for older browsers
            }
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);

        return () => {
            if (!preventUnload) {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            }
        };
    }, [preventUnload]);

    const handleUpload = () => {
        // Perform upload logic here
        setx(100)
        console.log('uploaded')
        // Allow navigation after upload
        setPreventUnload(false);
    };

    return (
        <div>
            {/* Your UI components */}
            <button onClick={handleUpload}>Upload</button>
            {x}
        </div>
    );
}

export default Refresh;
