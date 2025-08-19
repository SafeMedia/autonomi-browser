import React from "react";

interface AudioViewerProps {
    src: string;
}

const AudioViewer: React.FC<AudioViewerProps> = ({ src }) => {
    return (
        <div className="w-full bg-black p-4">
            <audio controls src={src} className="w-full" />
        </div>
    );
};

export default AudioViewer;
