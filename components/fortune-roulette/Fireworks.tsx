'use client';

import { useEffect, useRef } from 'react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

interface FireworksProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function Fireworks({ trigger, onComplete }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FireworkParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const completedRef = useRef(false);

  useEffect(() => {
    if (!trigger) {
      completedRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFD700', '#E63946', '#FF6B6B', '#FFBE0B', '#FFFFFF'];

    const createFirework = (x: number, y: number) => {
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 5 + 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 60,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
        });
      }
    };

    // Create multiple fireworks
    const positions = [
      { x: canvas.width * 0.3, y: canvas.height * 0.3 },
      { x: canvas.width * 0.7, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5 },
    ];

    positions.forEach((pos, index) => {
      setTimeout(() => createFirework(pos.x, pos.y), index * 200);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha = 1 - p.life / p.maxLife;

        // Draw
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (!completedRef.current) {
        completedRef.current = true;
        if (onComplete) onComplete();
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
