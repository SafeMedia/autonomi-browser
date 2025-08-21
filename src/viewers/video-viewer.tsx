import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type VideoJsPlayer = ReturnType<typeof videojs>;

interface VideoViewerProps {
    src: string;
}

function getMimeType(src: string) {
    const ext = src.split(".").pop()?.toLowerCase() || "mp4";
    const mimeMap: Record<string, string> = {
        mp4: "video/mp4",
        webm: "video/webm",
        ogg: "video/ogg",
        mkv: "video/x-matroska",
    };
    return mimeMap[ext] || `video/${ext}`;
}

const VideoViewer: React.FC<VideoViewerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);

    useEffect(() => {
        if (!videoRef.current) return; // element not yet in DOM

        // Dispose previous instance if exists
        if (playerRef.current) {
            playerRef.current.dispose();
        }

        // Delay initialization to next tick to ensure DOM is mounted
        const id = setTimeout(() => {
            playerRef.current = videojs(videoRef.current!, {
                controls: true,
                fluid: true,
                preload: "auto",
                aspectRatio: "16:9",
                sources: [{ src, type: getMimeType(src) }],
            });
        }, 0);

        return () => {
            clearTimeout(id);
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [src]);

    return (
        <div className="w-full h-full">
            <video
                ref={videoRef}
                className="video-js vjs-big-play-centered w-full h-full"
                playsInline
            />
        </div>
    );
};

export default VideoViewer;
