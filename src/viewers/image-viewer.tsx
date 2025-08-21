import React, { useState } from "react";

interface ImageViewerProps {
    src: string;
    alt?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = "content" }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className="w-full h-full flex items-center justify-center bg-black">
            {!loaded && !error && (
                <div className="text-white text-sm animate-pulse">
                    Loading image…
                </div>
            )}

            {error ? (
                <div className="text-red-500 text-sm">Failed to load image</div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className={`max-w-full max-h-[calc(100vh-96px)] object-contain transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                />
            )}
        </div>
    );
};

export default ImageViewer;
