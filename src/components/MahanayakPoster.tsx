"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MahanayakPoster() {
    const [motes, setMotes] = useState<any[]>([]);

    useEffect(() => {
        setMotes([...Array(6)].map(() => ({
            width: Math.random() * 4 + 3,
            height: Math.random() * 4 + 3,
            left: Math.random() * 100,
            top: Math.random() * 100,
            yMax: -100 - Math.random() * 100,
            xDelta1: (Math.random() - 0.5) * 50,
            xDelta2: (Math.random() - 0.5) * 150,
            opacityMax: Math.random() * 0.25 + 0.1,
            duration: Math.random() * 15 + 20,
            delay: Math.random() * 10,
        })));
    }, []);

    return (
        <>
            <div className="noise-overlay" />

            {/* Mobile Image */}
            <div className="absolute inset-0 block md:hidden z-0 bg-[var(--color-sepia-dark)]" style={{ backgroundAttachment: 'scroll' }}>
                <Image
                    src="/portrait.jpg"
                    alt="মহানায়ক (Mahanayak)"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1px"
                    className="object-fill object-center"
                />
            </div>

            {/* Desktop Image */}
            <div className="fixed inset-0 hidden md:block z-0 bg-[var(--color-sepia-dark)]">
                <Image
                    src="/landscape.jpg"
                    alt="মহানায়ক (Mahanayak)"
                    fill
                    priority
                    sizes="(min-width: 769px) 100vw, 1px"
                    className="object-fill object-center"
                />
            </div>

            {/* Drifting Motes (Desktop only) */}
            <div className="fixed inset-0 pointer-events-none hidden md:block z-10 overflow-hidden mix-blend-screen">
                {motes.map((mote: any, i: number) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-[var(--color-sepia-light)]"
                        style={{
                            width: mote.width + "px",
                            height: mote.height + "px",
                            left: mote.left + "%",
                            top: mote.top + "%",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                            y: [0, mote.yMax],
                            x: [mote.xDelta1, mote.xDelta2],
                            opacity: [0, mote.opacityMax, 0]
                        }}
                        transition={{
                            duration: mote.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: mote.delay,
                        }}
                    />
                ))}
            </div>
        </>
    );
}
