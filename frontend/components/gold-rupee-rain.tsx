'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  symbol: string;
}

export function GoldRupeeRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const symbols = ['₹', '₹', '💰', '✨', '₹', '🪙'];
    const particlesCount = 45;
    const particles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 18 + 14,
        speedY: Math.random() * 1.8 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.6 + 0.4,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.symbol === '₹') {
          ctx.font = `bold ${p.size}px "Outfit", "Inter", sans-serif`;
          ctx.fillStyle = '#F59E0B'; // Amber Gold
          ctx.shadowColor = '#D97706';
          ctx.shadowBlur = 12;
          ctx.fillText('₹', 0, 0);
        } else if (p.symbol === '🪙') {
          ctx.font = `${p.size}px sans-serif`;
          ctx.fillText('🪙', 0, 0);
        } else {
          ctx.font = `${p.size * 0.8}px sans-serif`;
          ctx.fillText(p.symbol, 0, 0);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
