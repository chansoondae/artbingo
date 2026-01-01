'use client';

import { useEffect, useRef } from 'react';

interface Particle {
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

interface ParticleSystemProps {
  isActive: boolean;
  centerX: number;
  centerY: number;
  intensity?: 'low' | 'medium' | 'high';
  type?: 'flame' | 'spark' | 'ember';
}

export default function ParticleSystem({
  isActive,
  centerX,
  centerY,
  intensity = 'medium',
  type = 'flame',
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  const colors = {
    flame: ['#FFD700', '#FF6B6B', '#E63946', '#FFBE0B'],
    spark: ['#FFD700', '#FFFFFF', '#FFBE0B'],
    ember: ['#E63946', '#9D0208', '#FF6B6B'],
  };

  const particleCount = {
    low: 3,
    medium: 5,
    high: 10,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 150 + 50;
      const speed = Math.random() * 2 + 1;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // upward drift
        life: 0,
        maxLife: Math.random() * 60 + 40,
        size: Math.random() * 4 + 2,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        alpha: 1,
      };
    };

    const updateParticles = () => {
      // Add new particles if active
      if (isActive && particlesRef.current.length < 100) {
        for (let i = 0; i < particleCount[intensity]; i++) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.alpha = 1 - p.life / p.maxLife;
        return p.life < p.maxLife;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current = [];
    };
  }, [isActive, centerX, centerY, intensity, type, colors, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
