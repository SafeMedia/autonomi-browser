import React from "react";

interface ImageViewerProps {
    src: string;
    alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = "content" }) => {
    return (
        <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[calc(100vh-96px)] object-contain mx-auto"
        />
    );
};

export default ImageViewer;
