'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FloatingHearts() {
    const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate hearts only on client side to avoid hydration mismatch
        const newHearts = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position %
            delay: Math.random() * 5, // Random delay
            duration: 10 + Math.random() * 10, // Random duration between 10-20s
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="absolute text-romantic-200/40"
                    initial={{ bottom: -50, left: `${heart.left}%`, opacity: 0 }}
                    animate={{
                        bottom: '120%',
                        opacity: [0, 0.8, 0],
                        rotate: [0, 45, -45, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear",
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
