import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Web3Modal  from 'web3modal' 
import { providers, Contract } from 'ethers'
const inter = Inter({ subsets: ['latin'] })




export default function Home() {
  const b = () =>{
    return console.log('it worked ')
  }
const[walletConnected, setWalletConnected]= useState(false)
const [numOfWhitelisted, setNumOfWhitelisted] = useState(0)
const Web3ModalRef = useRef();


const getProviderOrSigner = async (needSigner = false) => {
  // Connect to Metamask
  // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  // If user is not connected to the Goerli network, let them know and throw an error
  const { chainId } = await web3Provider.getNetwork();
  if (chainId !== 5) {
    window.alert("Change the network to Goerli");
    throw new Error("Change network to Goerli");
  }

  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;
};




const connectWallet = async () => {
  try {
    // Get the provider from web3Modal, which in our case is MetaMask
    // When used for the first time, it prompts the user to connect their wallet
    await getProviderOrSigner();
    setWalletConnected(true);

    checkIfAddressInWhitelist();
    getNumberOfWhitelisted();
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if(!walletConnected){
      Web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOption: {},
      disabledInjectedProvide:false,
    });
    connectWallet();
  }
  
  
}, [walletConnected])

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
        <footer className={styles.footer}>
          made with &#10084; by crypto devs 
      </footer>
      </div>
     
    </>
  )
}
