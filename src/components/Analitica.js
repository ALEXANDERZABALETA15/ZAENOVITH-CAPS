import Script from 'next/script'

// Carga GA4 y/o Meta Pixel solo si sus IDs están configurados en las variables de entorno:
//   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
//   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
// Sin IDs no se carga ningún script de terceros.

// Los IDs se validan porque se insertan dentro de un <script>
const GA_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID || '') ? process.env.NEXT_PUBLIC_GA_ID : null
const META_ID = /^\d+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || '') ? process.env.NEXT_PUBLIC_META_PIXEL_ID : null

export default function Analitica() {
  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {META_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  )
}
