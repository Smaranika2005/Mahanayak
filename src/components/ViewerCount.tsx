"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ViewerCount() {
    const [count, setCount] = useState(1);

    useEffect(() => {
        const userId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(7);

        const updatePresence = async (action?: 'leave') => {
            try {
                const res = await fetch('/api/viewers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, action })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.count === 'number') {
                        setCount(data.count);
                    }
                }
            } catch (e) {
                // silently fail on network errors
            }
        };

        updatePresence(); // Initial ping
        const interval = setInterval(() => updatePresence(), 5000);

        const handleBeforeUnload = () => {
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/viewers', JSON.stringify({ id: userId, action: 'leave' }));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            updatePresence('leave');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 glass-panel px-4 py-2 flex items-center gap-3"
            style={{
                marginTop: "env(safe-area-inset-top)",
            }}
        >
            <div className="relative flex items-center justify-center">
                <span
                    className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: 'var(--color-maroon-accent)' }}
                />
                <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-maroon-accent)' }}
                />
            </div>
            <span className="text-xs sm:text-sm font-medium tracking-wide text-[var(--color-sepia-light)]/90 drop-shadow-md pb-[1px]">
                {count} here now
            </span>
        </motion.div>
    );
}
