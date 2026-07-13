"use client";
import React, { useRef, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

interface TiltWrapperProps {
  children: ReactNode;
  className?: string;
  tiltDeg?: number;
  glare?: boolean;
}

export default function TiltWrapper({
  children,
  className = "",
  tiltDeg = 8,
  glare = true,
}: TiltWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltDeg, -tiltDeg]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltDeg, tiltDeg]), {
    stiffness: 200,
    damping: 20,
  });

  const glareX = useTransform(x, [0, 1], ["-30%", "130%"]);
  const glareY = useTransform(y, [0, 1], ["-30%", "130%"]);

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleReset() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleReset}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 60%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}
