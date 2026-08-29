/* eslint-disable */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, RotateCcw, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// A classic Bengali songs playlist provided by the user
const PLAYLIST_ID = "PLDD85Xp_WQns";

export default function AudioPlayer() {
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<0 | 1 | 2>(0); // 0: no repeat, 1: repeat playlist, 2: repeat one
    const [trackTitle, setTrackTitle] = useState("Loading...");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const playerRef = useRef<any>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isDraggingRef = useRef(false);

    const updateTrackInfo = useCallback((player: any) => {
        const data = player.getVideoData();
        if (data && data.title) {
            setTrackTitle(data.title);
            setThumbnailUrl(`https://img.youtube.com/vi/${data.video_id}/default.jpg`);
            setDuration(player.getDuration() || 0);
        }
    }, []);

    const onPlayerReadyRef = useRef<any>(null);
    const onPlayerStateChangeRef = useRef<any>(null);

    onPlayerReadyRef.current = (event: any) => {
        setPlayerReady(true);
        setVolume(event.target.getVolume());
        updateTrackInfo(event.target);
    };

    onPlayerStateChangeRef.current = (event: any) => {
        updateTrackInfo(event.target);
        if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setDuration(event.target.getDuration());

            if (!progressIntervalRef.current) {
                progressIntervalRef.current = setInterval(() => {
                    if (!isDraggingRef.current) {
                        setCurrentTime(event.target.getCurrentTime());
                    }
                }, 1000);
            }

            if ("mediaSession" in navigator) {
                const data = event.target.getVideoData();
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: data.title,
                    artist: "মহানায়ক",
                    artwork: [
                        { src: `https://img.youtube.com/vi/${data.video_id}/default.jpg`, sizes: "120x90", type: "image/jpeg" },
                        { src: `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`, sizes: "480x360", type: "image/jpeg" }
                    ]
                });
            }
        } else {
            setIsPlaying(false);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            if (event.data === (window as any).YT.PlayerState.ENDED) {
                if (repeatMode === 2) {
                    event.target.playVideo();
                }
            }
        }
    };

    useEffect(() => {
        if (!(window as any).YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }

        function initPlayer() {
            playerRef.current = new (window as any).YT.Player("youtube-player", {
                height: "1",
                width: "1",
                playerVars: {
                    listType: "playlist",
                    list: PLAYLIST_ID,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    modestbranding: 1,
                },
                events: {
                    onReady: (e: any) => onPlayerReadyRef.current?.(e),
                    onStateChange: (e: any) => onPlayerStateChangeRef.current?.(e),
                },
            });
        }

        return () => {
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    const handleStart = () => {
        if (playerRef.current && playerReady) {
            playerRef.current.playVideo();
            setHasStarted(true);
        }
    };

    const togglePlay = () => {
        if (isPlaying) playerRef.current?.pauseVideo();
        else playerRef.current?.playVideo();
    };

    const toggleMute = () => {
        if (isMuted || volume === 0) {
            const newVol = volume === 0 ? 100 : volume;
            playerRef.current?.unMute();
            playerRef.current?.setVolume(newVol);
            setVolume(newVol);
            setIsMuted(false);
        } else {
            playerRef.current?.mute();
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setVolume(val);
        playerRef.current?.setVolume(val);
        if (val > 0 && isMuted) {
            setIsMuted(false);
            playerRef.current?.unMute();
        } else if (val === 0 && !isMuted) {
            setIsMuted(true);
            playerRef.current?.mute();
        }
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isDraggingRef.current = true;
        const val = parseInt(e.target.value, 10);
        setCurrentTime(val);
    };

    const handleSeekCommit = (e: React.SyntheticEvent<HTMLInputElement>) => {
        isDraggingRef.current = false;
        const val = parseInt(e.currentTarget.value, 10);
        playerRef.current?.seekTo(val, true);
    };

    const handleNext = () => playerRef.current?.nextVideo();
    const handlePrev = () => playerRef.current?.previousVideo();

    const handleRewind10 = () => {
        if (playerRef.current) {
            const newTime = Math.max(0, currentTime - 10);
            setCurrentTime(newTime);
            playerRef.current.seekTo(newTime, true);
        }
    };

    const handleForward10 = () => {
        if (playerRef.current) {
            const newTime = Math.min(duration, currentTime + 10);
            setCurrentTime(newTime);
            playerRef.current.seekTo(newTime, true);
        }
    };

    const toggleShuffle = () => {
        const newShuffle = !isShuffle;
        playerRef.current?.setShuffle(newShuffle);
        setIsShuffle(newShuffle);
    };

    const toggleRepeat = () => {
        const nextMode = ((repeatMode + 1) % 3) as 0 | 1 | 2;
        setRepeatMode(nextMode);
        if (nextMode === 1) {
            playerRef.current?.setLoop(true);
        } else if (nextMode === 0) {
            playerRef.current?.setLoop(false);
        }
        // mode 2 (repeat one) controlled manually on ENDED event
    };

    // Keyboard shortcuts
    useEffect(() => {
        if (!hasStarted) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't interfere with inputs/textareas if they exist
            if (document.activeElement?.tagName === "INPUT") return;

            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "ArrowRight":
                    handleNext();
                    break;
                case "ArrowLeft":
                    handlePrev();
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasStarted, isPlaying]);

    // Media session controls
    useEffect(() => {
        if ("mediaSession" in navigator && hasStarted) {
            navigator.mediaSession.setActionHandler("play", togglePlay);
            navigator.mediaSession.setActionHandler("pause", togglePlay);
            navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
            navigator.mediaSession.setActionHandler("nexttrack", handleNext);
        }
    }, [hasStarted, isPlaying]);

    const formatTime = (timeInSecs: number) => {
        if (!timeInSecs || isNaN(timeInSecs)) return "0:00";
        const m = Math.floor(timeInSecs / 60);
        const s = Math.floor(timeInSecs % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <>
            <div id="youtube-player" className="fixed top-0 left-0 opacity-0 pointer-events-none" />

            <AnimatePresence>
                {!hasStarted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-sm"
                        onClick={handleStart}
                    >
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="w-16 h-16 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-white/20">
                                <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                            <p className="text-[var(--color-sepia-light)]/90 tracking-widest uppercase text-sm font-light drop-shadow-md">
                                Tap to Begin
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: hasStarted ? 0 : 200, opacity: hasStarted ? 1 : 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
                className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6"
                style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
                <div className="glass-panel w-full max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">

                    {/* Track Info (disc + title) */}
                    <div className="flex items-center gap-4 w-full md:w-1/3">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border border-white/20 relative shadow-inner ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                            <div className="absolute inset-0 bg-black/20 z-10 rounded-full" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {thumbnailUrl ? (
                                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover scale-150" />
                            ) : (
                                <div className="w-full h-full bg-black/40" />
                            )}
                            {/* Disc center hole */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--color-sepia-dark)] rounded-full border border-white/10 z-20" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[var(--color-sepia-light)] font-medium text-sm md:text-base truncate drop-shadow-md">
                                {trackTitle}
                            </p>
                            <p className="text-white/60 text-xs md:text-sm truncate">
                                মহানায়ক (Mahanayak)
                            </p>
                        </div>
                    </div>

                    {/* Central Controls */}
                    <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
                        <div className="flex items-center gap-4 md:gap-6">
                            <button onClick={handlePrev} className="flex p-2 rounded-full text-[var(--color-sepia-light)]/80 hover:text-[var(--color-sepia-light)] transition-transform hover:scale-110 shrink-0">
                                <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                            </button>

                            <button onClick={handleRewind10} className="relative p-2 rounded-full text-[var(--color-sepia-light)]/80 hover:text-[var(--color-sepia-light)] transition-transform hover:scale-110 flex items-center justify-center">
                                <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
                                <span className="absolute text-[8px] md:text-[10px] font-bold mt-1 font-mono">10</span>
                            </button>

                            <button onClick={togglePlay} className="p-3 bg-transparent hover:bg-[var(--color-sepia-light)]/10 rounded-full text-[var(--color-sepia-light)] transition-all hover:scale-105 border border-[var(--color-sepia-light)]/30 shadow-[inset_0_0_10px_rgba(232,212,168,0.05)] shrink-0">
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 md:w-7 md:h-7 fill-current" />
                                ) : (
                                    <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
                                )}
                            </button>

                            <button onClick={handleForward10} className="relative p-2 rounded-full text-[var(--color-sepia-light)]/80 hover:text-[var(--color-sepia-light)] transition-transform hover:scale-110 flex items-center justify-center">
                                <RotateCw className="w-6 h-6 md:w-7 md:h-7" />
                                <span className="absolute text-[8px] md:text-[10px] font-bold mt-1 font-mono">10</span>
                            </button>

                            <button onClick={handleNext} className="flex p-2 rounded-full text-[var(--color-sepia-light)]/80 hover:text-[var(--color-sepia-light)] transition-transform hover:scale-110 shrink-0">
                                <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                            </button>

                            <button onClick={toggleRepeat} className={`p-2 rounded-full transition-colors relative ${repeatMode > 0 ? 'text-[var(--color-maroon-accent)]' : 'text-[var(--color-sepia-light)]/70 hover:text-[var(--color-sepia-light)]'}`}>
                                {repeatMode === 2 ? <Repeat1 className="w-4 h-4 md:w-5 md:h-5" /> : <Repeat className="w-4 h-4 md:w-5 md:h-5" />}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 w-full text-xs text-white/60 font-mono mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <div className="flex-1 relative h-8 group cursor-pointer flex items-center">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={handleSeekChange}
                                    onMouseUp={handleSeekCommit}
                                    onTouchEnd={handleSeekCommit}
                                    onKeyUp={handleSeekCommit}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                <div className="w-full relative h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[var(--color-maroon-accent)] transition-all duration-150 ease-linear"
                                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                    />
                                </div>
                                <div
                                    className="absolute h-3 w-3 bg-white rounded-full transition-transform scale-0 group-hover:scale-100 shadow-md z-10 pointer-events-none"
                                    style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
                                />
                            </div>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume Control (hidden on very small mobile, visible on sm and up) */}
                    <div className="hidden sm:flex items-center gap-3 w-full md:w-1/3 justify-end text-white/80">
                        <button onClick={toggleMute} className="p-2 hover:text-white transition-colors z-30">
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <div className="w-24 relative h-8 group cursor-pointer flex items-center">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className="w-full relative h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                                <div
                                    className="absolute top-0 left-0 h-full bg-[var(--color-sepia-light)] transition-all"
                                    style={{ width: `${isMuted ? 0 : volume}%` }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </>
    );
}
