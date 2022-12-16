import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })




export default function Home() {
  const b = () =>{
    return console.log('it worked ')
  }
const [numOfWhitelisted, setNumOfWhitelisted] = useState(0)

  return (
    <>
      <Head>
          <title>Whitelist dApp</title>
          <meta name="description" content='whitelist-dApp' />
      </Head>
      <div>
        <div className={styles.main}>
          <h1 className={styles.title}>
            WELCOME TO CRYPTO DEVS 
          
          <div className={styles.description}>
            {numOfWhitelisted} devs already Joined the whitelist
          </div>
          <button className={styles.button} onClick={b }>Join the whitelist</button>
          </h1>
          <div>
            <img className={styles.image} src='./crypto-devs.svg'/>
          </div>
          
        </div>
        
      </div>
      <footer>

      </footer>
    </>
  )
}
