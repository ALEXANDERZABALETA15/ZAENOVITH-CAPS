'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* Logo animado */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(24px, 5vw, 48px)',
              fontWeight: '900',
              color: '#f5f3ec',
              fontFamily: 'var(--font-cinzel)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            CROWNLUX
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              fontSize: '10px',
              color: '#c7c7c7',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Premium Caps
          </motion.p>

          {/* Línea de carga */}
          <motion.div
            style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: '1px',
              backgroundColor: 'rgba(199,199,199,0.15)',
              marginTop: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: 'linear-gradient(to right, #1e6b52, #c7c7c7)',
              }}
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}