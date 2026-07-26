'use client';

import React, { useEffect, useRef } from 'react';

export function DeepFlowBackground() {
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

    // Data Stream Line Definition
    interface Stream {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      thickness: number;
      color: string;
      pulsePos: number;
      pulseSpeed: number;
    }

    const streams: Stream[] = [];
    const streamCount = 16;

    const colors = [
      'rgba(0, 174, 239, ', // Electric Blue #00AEEF
      'rgba(127, 219, 255, ', // Soft Cyan #7FDBFF
      'rgba(106, 13, 173, ', // Violet #6A0DAD
      'rgba(218, 119, 86, '  // Warm Claude Amber #DA7756
    ];

    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 220 + Math.random() * 450,
        speed: 0.9 + Math.random() * 1.6,
        angle: Math.random() > 0.4 ? 0.22 : 0,
        thickness: 1.2 + Math.random() * 2.8,
        color: colors[i % colors.length],
        pulsePos: Math.random(),
        pulseSpeed: 0.006 + Math.random() * 0.012
      });
    }

    // Rupee Money Particles
    interface MoneyParticle {
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      alpha: number;
    }

    const rupees: MoneyParticle[] = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -0.3 - Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      size: 14 + Math.random() * 12,
      alpha: 0.25 + Math.random() * 0.45
    }));

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Flowing Data Streams
      streams.forEach((st) => {
        st.x += st.speed;
        st.y += st.speed * st.angle;

        if (st.x - st.length > width) {
          st.x = -st.length;
          st.y = Math.random() * height;
        }

        const endX = st.x + st.length;
        const endY = st.y + st.length * st.angle;
        const grad = ctx.createLinearGradient(st.x, st.y, endX, endY);
        grad.addColorStop(0, st.color + '0)');
        grad.addColorStop(0.5, st.color + '0.45)');
        grad.addColorStop(1, st.color + '0)');

        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = st.thickness;
        ctx.stroke();

        // Neon Green Pulse Particles (#39FF14)
        st.pulsePos = (st.pulsePos + st.pulseSpeed) % 1;
        const px = st.x + st.length * st.pulsePos;
        const py = st.y + st.length * st.angle * st.pulsePos;

        ctx.shadowBlur = 14;
        ctx.shadowColor = '#39FF14';
        ctx.fillStyle = '#39FF14';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Floating Gold Rupee Money Particles (₹)
      rupees.forEach((r) => {
        r.y += r.vy;
        r.x += r.vx;

        if (r.y < -30) {
          r.y = height + 30;
          r.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.font = `900 ${r.size}px Montserrat, sans-serif`;
        ctx.fillStyle = `rgba(255, 215, 0, ${r.alpha})`; // Gold Money #FFD700
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(218, 119, 86, 0.7)';
        ctx.fillText('₹', 0, 0);
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0F1C]">
      
      {/* 1. User Uploaded High-Resolution Background Image with Seamless Color Contrast Blending */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-lighten filter contrast-125 saturate-125"
        style={{ backgroundImage: "url('/fintech-bg.jpg')" }}
      />

      {/* 2. HTML5 Canvas for GPU-Friendly Flowing Data Streams & Neon Green Pulses */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />

      {/* 3. Layered Ambient Orbs for Color Harmony */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#DA7756]/25 via-[#F59E0B]/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#6A0DAD]/30 via-[#00AEEF]/20 to-transparent blur-[150px] pointer-events-none" />

      {/* 4. Soft Radial Blur Overlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-75 pointer-events-none" />
    </div>
  );
}
