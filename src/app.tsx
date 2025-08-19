import React, { useState } from "react";
import { useTheme } from "next-themes";
import ImageViewer from "./viewers/image-viewer";
import AudioViewer from "./viewers/audio-viewer";
import VideoViewer from "./viewers/video-viewer";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ArrowLeft, ArrowRight, RefreshCcw, Star, Menu } from "lucide-react";

const SERVER_BASE_URL = "http://127.0.0.1:18888";

function encodePath(path: string): string {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    if (["mp4", "webm", "ogg", "x-matroska"].includes(extension))
        return "video";
    if (["mp3", "wav", "flac"].includes(extension)) return "audio";
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(extension))
        return "image";
    if (extension === "html" || extension === "htm") return "html";
    return "other";
};

const Viewer: React.FC<{ url: string; type: string }> = ({ url, type }) => {
    if (!url) return null;

    switch (type) {
        case "video":
            return <VideoViewer src={url} />;
        case "audio":
            return <AudioViewer src={url} />;
        case "image":
            return <ImageViewer src={url} />;
        default:
            return (
                <iframe
                    title="html-view"
                    src={url}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-[calc(100vh-96px)] border-0"
                />
            );
    }
};

const App: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [input, setInput] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const fetchUrl = () => {
        if (!input.trim()) return;

        setLoading(true);

        const trimmed = input.trim();
        const pathWithSlash = trimmed.startsWith("/") ? trimmed : "/" + trimmed;
        const encodedPath = encodePath(pathWithSlash);

        const fullUrl = SERVER_BASE_URL + encodedPath;
        const detectedType = getFileType(trimmed);

        setUrl(fullUrl);
        setType(detectedType);

        // Increment reload key to force re-render even if URL hasn't changed
        setReloadKey((prev) => prev + 1);

        setLoading(false);
    };
    return (
        <div className="flex flex-col min-h-screen bg-white ">
            {/* Header */}
            <header
                className="flex items-center px-3 h-12 sticky top-0 z-10 gap-2 
                               backdrop-blur-md bg-[#26252C]"
            >
                {/* Navigation */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
                >
                    <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
                    onClick={fetchUrl}
                >
                    <RefreshCcw className="w-4 h-4" />
                </Button>

                {/* Address bar */}
                <div
                    className="flex-1 flex items-center bg-[#1B1A1F]  px-3  
                                rounded-md"
                >
                    <Input
                        placeholder="Enter address"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchUrl()}
                        className="flex-1 border-none shadow-none !bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none"
                        disabled={loading}
                    />
                    <Star className="w-4 h-4 text-yellow-400 cursor-pointer ml-2 hover:scale-110 transition-transform" />
                </div>

                {/* Menu + Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-black/5 dark:hover:bg-white/10 rounded-md "
                >
                    <Menu className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="hover:bg-black/5 dark:hover:bg-white/10 rounded-md"
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </Button>
            </header>

            {/* Main content */}
            <main className="flex-grow flex justify-center items-center bg-black overflow-hidden w-full h-[calc(100vh-3rem)]">
                <Viewer key={reloadKey} url={url} type={type} />
            </main>
        </div>
    );
};

export default App;
