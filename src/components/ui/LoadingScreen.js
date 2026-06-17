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
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.15em' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(28px, 6vw, 56px)',
              fontWeight: '900',
              color: '#C9A84C',
              fontFamily: 'var(--font-playfair)',
              letterSpacing: '0.15em',
            }}
          >
            CROWNLUX
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: '11px',
              color: '#888',
              letterSpacing: '0.4em',
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
              backgroundColor: 'rgba(201,168,76,0.2)',
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
                backgroundColor: '#C9A84C',
              }}
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}