import Link from 'next/link'
import '../styles/globals.css'



function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className='border-b p-6'>

      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
