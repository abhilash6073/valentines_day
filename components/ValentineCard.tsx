'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Ghost } from 'lucide-react';
import Button from './Button';

export default function ValentineCard() {
    const [isYes, setIsYes] = useState(false);
    const [noBtnPosition, setNoBtnPosition] = useState<{ top: number; left: number } | null>(null);
    const [initialPos, setInitialPos] = useState<{ top: number; left: number } | null>(null);
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleYesClick = () => {
        setIsYes(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#e11d48', '#ffffff'],
        });
    };

    const moveNoButton = () => {
        if (!noBtnRef.current) return;

        const btnRect = noBtnRef.current.getBoundingClientRect();

        // Capture initial position for smooth transition
        if (!noBtnPosition) {
            setInitialPos({ top: btnRect.top, left: btnRect.left });
        }

        const width = window.innerWidth - btnRect.width;
        const height = window.innerHeight - btnRect.height;

        // Calculate random position within safe bounds (padding 20px)
        const newLeft = Math.max(20, Math.random() * (width - 20));
        const newTop = Math.max(20, Math.random() * (height - 20));

        setNoBtnPosition({ left: newLeft, top: newTop });
    };

    // Unified Evasion Logic (Mouse & Touch)
    useEffect(() => {
        const handleInteraction = (clientX: number, clientY: number) => {
            if (isYes || !noBtnRef.current) return;

            const btnRect = noBtnRef.current.getBoundingClientRect();
            // Trigger dodge if pointer/finger is within 2px of the button (Invisible Boundary)

            if (
                clientX >= btnRect.left - 2 &&
                clientX <= btnRect.right + 2 &&
                clientY >= btnRect.top - 2 &&
                clientY <= btnRect.bottom + 2
            ) {
                moveNoButton();
            }
        };

        const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY);

        // Add listeners to window to catch movements anywhere
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isYes]); // Re-bind if game state changes

    return (
        <div className="z-10 w-full max-w-2xl p-4 md:p-8 text-center" ref={containerRef}>
            {!isYes ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50"
                >
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg mx-auto w-full max-w-lg relative">
                        <img
                            src="/hero-image.jpg"
                            alt="Heart Latte Art"
                            className="w-full h-auto hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative min-h-[60px]">
                        <Button
                            onClick={handleYesClick}
                            className="w-full md:w-auto min-w-[140px]"
                        >
                            Yes <Heart className="inline w-5 h-5 ml-2 fill-current" />
                        </Button>

                        {noBtnPosition ? (
                            typeof document !== 'undefined' && createPortal(
                                <motion.div
                                    initial={{
                                        opacity: 1, // Start visible
                                        left: initialPos?.left || 0,
                                        top: initialPos?.top || 0
                                    }}
                                    animate={{
                                        opacity: 1,
                                        left: noBtnPosition.left,
                                        top: noBtnPosition.top
                                    }}
                                    // Slower speed, graduate deceleration (tween with easeOut)
                                    transition={{
                                        type: "tween",
                                        ease: "easeOut",
                                        duration: 1.5
                                    }}
                                    style={{ position: 'fixed', zIndex: 9999 }}
                                >
                                    <Button
                                        variant="no"
                                        ref={noBtnRef}
                                        className="w-auto min-w-[140px]"
                                    >
                                        No <Ghost className="inline w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>,
                                document.body
                            )
                        ) : (
                            <motion.div>
                                <Button
                                    variant="no"
                                    ref={noBtnRef}
                                    className="w-full md:w-auto min-w-[140px]"
                                >
                                    No <Ghost className="inline w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-4 border-romantic-400 max-w-lg mx-auto"
                >
                    <div className="w-full h-48 mb-6 relative rounded-2xl overflow-hidden">
                        <img
                            src="/success-image.jpeg"
                            alt="Excited Husky"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-romantic-600 mb-4 font-serif">
                        Best Decision Ever! 💖
                    </h2>
                    <div className="space-y-6 text-lg md:text-xl text-gray-700 font-medium">
                        <p className="text-gray-600 font-medium leading-relaxed">
                            I knew you had good taste! 😉
                        </p>
                        <div className="w-16 h-1 bg-romantic-300 mx-auto rounded-full my-6"></div>
                        <p className="text-romantic-800 font-bold">
                            See you on Feb 14th! 🌹
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
