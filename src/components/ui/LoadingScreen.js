'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoFailed(true)
      })
    }
  }, [isMobile])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* MÓVIL — Si el video falla muestra animación de texto */}
          {isMobile && videoFailed && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '0 32px',
            }}>
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.8em' }}
                animate={{ opacity: 1, letterSpacing: '0.2em' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                  fontSize: 'clamp(32px, 12vw, 56px)',
                  fontWeight: '900',
                  color: '#f5f3ec',
                  fontFamily: 'var(--font-cinzel)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                CROWNLUX
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  fontSize: '11px',
                  color: '#1e6b52',
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Premium Caps
              </motion.p>

              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'easeInOut' }}
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, #1e6b52, #c7c7c7)',
                  marginTop: '16px',
                  maxWidth: '200px',
                }}
              />
            </div>
          )}

          {/* MÓVIL — Video 9:16 */}
          {isMobile && !videoFailed && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onEnded={() => setVisible(false)}
              onError={() => setVideoFailed(true)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
              }}
            >
              <source
                src="https://res.cloudinary.com/dg4kazsno/video/upload/v1785816704/Luxury_brand_intro_video_generation_202608032309_fnomgn.mp4"
                type="video/mp4"
              />
            </video>
          )}

          {/* DESKTOP — Video 16:9 */}
          {!isMobile && (
            <video
              autoPlay
              muted
              playsInline
              onEnded={() => setVisible(false)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '100%',
                minHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
              }}
            >
              <source
                src="https://res.cloudinary.com/dg4kazsno/video/upload/v1784774524/Logo_animation_with_teal_lights_202607222139_mxzuuk.mp4"
                type="video/mp4"
              />
            </video>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  )
}