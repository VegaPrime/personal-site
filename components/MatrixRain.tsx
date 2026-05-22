'use client'

import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツ0123456789ABCDEF<>|{}'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let drops: number[] = []

    function init() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const cols = Math.floor(canvas.width / 16)
      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height)
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.fillStyle = 'rgba(5, 12, 5, 0.13)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = '13px monospace'

      for (let i = 0; i < drops.length; i++) {
        const x = i * 16
        const y = drops[i]

        ctx.fillStyle = 'rgba(180, 255, 200, 0.18)'
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y)

        for (let j = 1; j <= 8; j++) {
          ctx.fillStyle = `rgba(0, 255, 120, ${0.07 * (1 - j / 8)})`
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - j * 13)
        }

        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = -65
        }
        drops[i] += 0.9
      }

      animId = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(init)
    observer.observe(canvas.parentElement ?? canvas)

    init()
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    />
  )
}
