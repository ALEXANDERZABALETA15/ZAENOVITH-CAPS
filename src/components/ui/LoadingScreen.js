// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'

// export default function LoadingScreen() {
//   const [visible, setVisible] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const [videoFailed, setVideoFailed] = useState(false)
//   const videoRef = useRef(null)

//   useEffect(() => {
//     const yaVisto = sessionStorage.getItem('crownlux_intro')
//     if (!yaVisto) {
//       setVisible(true)
//     }

//     const checkMobile = () => setIsMobile(window.innerWidth < 768)
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   useEffect(() => {
//     if (!visible) return
//     const timer = setTimeout(() => {
//       sessionStorage.setItem('crownlux_intro', 'true')
//       setVisible(false)
//     }, 5000)
//     return () => clearTimeout(timer)
//   }, [visible])

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.play().catch(() => {
//         setVideoFailed(true)
//       })
//     }
//   }, [isMobile, visible])

//   function handleVideoEnd() {
//     sessionStorage.setItem('crownlux_intro', 'true')
//     setVisible(false)
//   }

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           initial={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 1, ease: 'easeInOut' }}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             zIndex: 9999,
//             backgroundColor: '#0a0a0a',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             overflow: 'hidden',
//           }}
//         >
//           {/* MÓVIL — Si el video falla muestra animación de texto */}
//           {isMobile && videoFailed && (
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '16px',
//               padding: '0 32px',
//             }}>
//               <motion.h1
//                 initial={{ opacity: 0, letterSpacing: '0.8em' }}
//                 animate={{ opacity: 1, letterSpacing: '0.2em' }}
//                 transition={{ duration: 1.2, ease: 'easeOut' }}
//                 style={{
//                   fontSize: 'clamp(32px, 12vw, 56px)',
//                   fontWeight: '900',
//                   color: '#f5f3ec',
//                   fontFamily: 'var(--font-cinzel)',
//                   letterSpacing: '0.2em',
//                   textTransform: 'uppercase',
//                   textAlign: 'center',
//                   margin: 0,
//                 }}
//               >
//                 CROWNLUX
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.6 }}
//                 style={{
//                   fontSize: '11px',
//                   color: '#1e6b52',
//                   letterSpacing: '0.5em',
//                   textTransform: 'uppercase',
//                   fontFamily: 'var(--font-inter)',
//                   textAlign: 'center',
//                   margin: 0,
//                 }}
//               >
//                 Premium Caps
//               </motion.p>

//               <motion.div
//                 initial={{ width: '0%' }}
//                 animate={{ width: '100%' }}
//                 transition={{ duration: 3, ease: 'easeInOut' }}
//                 style={{
//                   height: '1px',
//                   background: 'linear-gradient(to right, #1e6b52, #c7c7c7)',
//                   marginTop: '16px',
//                   maxWidth: '200px',
//                 }}
//               />
//             </div>
//           )}

//           {/* MÓVIL — Video 9:16 */}
//           {isMobile && !videoFailed && (
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               onEnded={handleVideoEnd}
//               onError={() => setVideoFailed(true)}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 width: '100vw',
//                 height: '100vh',
//                 objectFit: 'cover',
//               }}
//             >
//               <source
//                 src="https://res.cloudinary.com/dg4kazsno/video/upload/v1785816704/Luxury_brand_intro_video_generation_202608032309_fnomgn.mp4"
//                 type="video/mp4"
//               />
//             </video>
//           )}

//           {/* DESKTOP — Video 16:9 */}
//           {!isMobile && (
//             <video
//               autoPlay
//               muted
//               playsInline
//               onEnded={handleVideoEnd}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 minWidth: '100%',
//                 minHeight: '100%',
//                 width: 'auto',
//                 height: 'auto',
//                 objectFit: 'cover',
//               }}
//             >
//               <source
//                 src="https://res.cloudinary.com/dg4kazsno/video/upload/v1784774524/Logo_animation_with_teal_lights_202607222139_mxzuuk.mp4"
//                 type="video/mp4"
//               />
//             </video>
//           )}

//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'


// export default function LoadingScreen() {

//   const [visible, setVisible] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const [videoFailed, setVideoFailed] = useState(false)

//   const mobileVideoRef = useRef(null)
//   const desktopVideoRef = useRef(null)



//   useEffect(() => {

//     // Detectar si es una carga completa del navegador
//     const navigation = performance.getEntriesByType(
//       "navigation"
//     )[0]


//     const navigationType = navigation?.type


//     /*
//       Mostrar intro cuando:
      
//       1. Primera entrada al sitio
//       2. Recarga manual del navegador
//       3. Recuperación después de un error
      
//     */

//     if(
//       navigationType === "navigate" ||
//       navigationType === "reload"
//     ){

//       setVisible(true)

//     }



//     const checkDevice = () => {

//       setIsMobile(
//         window.innerWidth < 768
//       )

//     }


//     checkDevice()


//     window.addEventListener(
//       "resize",
//       checkDevice
//     )


//     return () => {

//       window.removeEventListener(
//         "resize",
//         checkDevice
//       )

//     }


//   },[])




//   useEffect(()=>{


//     if(!visible) return


//     const video = isMobile
//       ? mobileVideoRef.current
//       : desktopVideoRef.current



//     if(video){

//       video.play()
//       .catch((error)=>{

//         console.log(
//           "Error reproduciendo video:",
//           error
//         )


//         if(isMobile){
//           setVideoFailed(true)
//         }

//       })

//     }


//   },[
//     visible,
//     isMobile
//   ])





//   function finishIntro(){

//     setVisible(false)

//   }




//   // Evita render antes de detectar dispositivo

//   if(!visible){
//     return null
//   }



//   return (

//     <AnimatePresence>


//       <motion.div

//         initial={{
//           opacity:1
//         }}

//         exit={{
//           opacity:0
//         }}

//         transition={{
//           duration:1
//         }}


//         style={{

//           position:"fixed",

//           inset:0,

//           zIndex:9999,

//           background:"#0a0a0a",

//           display:"flex",

//           justifyContent:"center",

//           alignItems:"center",

//           overflow:"hidden"

//         }}

//       >



//       {/* ======================
//           VIDEO MOBILE 9:16
//       ====================== */}


//       {
//       isMobile && !videoFailed && (

//         <video

//           ref={mobileVideoRef}

//           autoPlay

//           muted

//           playsInline

//           preload="auto"


//           onEnded={finishIntro}


//           onError={()=>{

//             setVideoFailed(true)

//           }}


//           style={{

//             position:"absolute",

//             width:"100vw",

//             height:"100vh",

//             objectFit:"cover"

//           }}

//         >

//           <source

//             src="https://res.cloudinary.com/dg4kazsno/video/upload/v1785816704/Luxury_brand_intro_video_generation_202608032309_fnomgn.mp4"

//             type="video/mp4"

//           />


//         </video>

//       )

//       }




//       {/* ======================
//           FALLBACK MOBILE
//       ====================== */}


//       {
//       isMobile && videoFailed && (

//         <motion.div

//           initial={{
//             opacity:0
//           }}

//           animate={{
//             opacity:1
//           }}

//         >

//           <h1

//             style={{

//               color:"#f5f3ec",

//               fontSize:"48px",

//               fontWeight:"900",

//               letterSpacing:"0.2em",

//               fontFamily:"serif"

//             }}

//           >

//             CROWNLUX

//           </h1>


//         </motion.div>

//       )

//       }





//       {/* ======================
//           VIDEO DESKTOP 16:9
//       ====================== */}


//       {
//       !isMobile && (

//         <video

//           ref={desktopVideoRef}

//           autoPlay

//           muted

//           playsInline

//           preload="auto"


//           onEnded={finishIntro}


//           style={{

//             position:"absolute",

//             top:"50%",

//             left:"50%",

//             transform:
//             "translate(-50%, -50%)",


//             minWidth:"100%",

//             minHeight:"100%",


//             objectFit:"cover"

//           }}

//         >


//           <source

//             src="https://res.cloudinary.com/dg4kazsno/video/upload/v1784774524/Logo_animation_with_teal_lights_202607222139_mxzuuk.mp4"

//             type="video/mp4"

//           />


//         </video>

//       )

//       }




//       </motion.div>


//     </AnimatePresence>

//   )

// }

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false)
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
    const navegacionInterna = sessionStorage.getItem('crownlux_spa')

    if (!navegacionInterna) {
      setVisible(true)
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem('crownlux_spa')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => cerrar(), 5000)
    return () => clearTimeout(timer)
  }, [visible])

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => setVideoFailed(true))
    }
  }, [visible, isMobile])

  function cerrar() {
    sessionStorage.setItem('crownlux_spa', 'true')
    setVisible(false)
  }

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
          {/* MÓVIL — Fallback animación texto */}
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
              preload="auto"
              onEnded={cerrar}
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
              preload="auto"
              onEnded={cerrar}
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