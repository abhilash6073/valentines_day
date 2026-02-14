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
    const [noBtnKey, setNoBtnKey] = useState(0); // Key to force re-render/reset animation
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

        // Reset any drag transformation
        setNoBtnKey(prev => prev + 1);

        const btnRect = noBtnRef.current.getBoundingClientRect();
        const width = window.innerWidth - btnRect.width;
        const height = window.innerHeight - btnRect.height;

        let newLeft, newTop;
        let isOverlapping = true;
        let attempts = 0;

        // Get safe zone (Drop Zone) to avoid
        const dropZoneRect = dropZoneRef.current?.getBoundingClientRect();

        while (isOverlapping && attempts < 10) {
            newLeft = Math.max(20, Math.random() * (width - 20));
            newTop = Math.max(20, Math.random() * (height - 20));

            if (dropZoneRect) {
                // Check if new position (approximated box) overlaps with drop zone
                // We add margin to be safe
                if (
                    newLeft < dropZoneRect.right + 20 &&
                    newLeft + btnRect.width > dropZoneRect.left - 20 &&
                    newTop < dropZoneRect.bottom + 20 &&
                    newTop + btnRect.height > dropZoneRect.top - 20
                ) {
                    isOverlapping = true;
                } else {
                    isOverlapping = false;
                }
            } else {
                isOverlapping = false;
            }
            attempts++;
        }

        setNoBtnPosition({ left: newLeft!, top: newTop! });
    };

    // simplified evasion - ONLY run away on drop for this mode as requested
    // or maybe on text interaction? User said "run away as soon as user drops it"
    // So we will focus on drag end.

    const handleDragEnd = (event: any, info: any, isYesBtn: boolean) => {
        if (isYesBtn) {
            // Check collision with drop zone
            if (dropZoneRef.current) {
                const dropRect = dropZoneRef.current.getBoundingClientRect();
                const point = info.point; // Absolute coordinates of pointer at end

                if (
                    point.x >= dropRect.left &&
                    point.x <= dropRect.right &&
                    point.y >= dropRect.top &&
                    point.y <= dropRect.bottom
                ) {
                    handleYesClick();
                }
            }
        } else {
            // It's the No button - run away!
            moveNoButton();
        }
    };

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

                    {/* Drop Zone */}
                    <div
                        ref={dropZoneRef}
                        className="mb-8 border-4 border-dashed border-romantic-300 rounded-2xl p-8 bg-romantic-50 flex flex-col items-center justify-center min-h-[150px]"
                    >
                        <Heart className="w-12 h-12 text-romantic-400 mb-2 animate-bounce" />
                        <p className="text-romantic-600 font-bold text-lg">
                            Drop your answer here Aida
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative min-h-[60px]">
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                            onDragEnd={(e, info) => handleDragEnd(e, info, true)}
                            className="z-50"
                        >
                            <Button
                                className="w-full md:w-auto min-w-[140px] cursor-grab active:cursor-grabbing"
                            >
                                Yes <Heart className="inline w-5 h-5 ml-2 fill-current" />
                            </Button>
                        </motion.div>

                        {noBtnPosition ? (
                            typeof document !== 'undefined' && createPortal(
                                <motion.div
                                    key={noBtnKey} // Force re-mount to clear drag state
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Unconstrained effectively for screen
                                    dragElastic={0.2}
                                    whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, false)}
                                    initial={{
                                        opacity: 1,
                                        left: 0, // Animate FROM 0 to target (framer motion handles layout projection usually, but portal needs explicit)
                                        // Actually better to just animate to new pos
                                    }}
                                    animate={{
                                        left: noBtnPosition.left,
                                        top: noBtnPosition.top
                                    }}
                                    transition={{
                                        type: "tween",
                                        ease: "easeOut",
                                        duration: isMobile ? 0.4 : 1.5
                                    }}
                                    style={{ position: 'fixed', zIndex: 9999, left: 0, top: 0 }} // Reset origin for fixed positioning
                                >
                                    <Button
                                        variant="no"
                                        ref={noBtnRef}
                                        className="w-auto min-w-[140px] cursor-grab active:cursor-grabbing"
                                    >
                                        No <Ghost className="inline w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>,
                                document.body
                            )
                        ) : (
                            <motion.div
                                drag
                                dragConstraints={containerRef}
                                dragElastic={0.2}
                                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                                onDragEnd={(e, info) => handleDragEnd(e, info, false)}
                            >
                                <Button
                                    variant="no"
                                    ref={noBtnRef}
                                    className="w-full md:w-auto min-w-[140px] cursor-grab active:cursor-grabbing"
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
                    <div className="w-full mb-6 relative rounded-2xl overflow-hidden shadow-md">
                        <img
                            src="/success-image.jpeg"
                            alt="Excited Husky"
                            className="w-full h-auto"
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
