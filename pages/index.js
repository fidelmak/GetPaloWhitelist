import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";




export default function Home() {
  const b = () =>{
    return console.log('it worked ')
  }
const[walletConnected, setWalletConnected]= useState(false);
const [joinedWhitelist, setJoinedWhitelist] = useState(false);
const [loading, setLoading] = useState(false);
const [numOfWhitelisted, setNumOfWhitelisted] = useState(0)
const web3ModalRef = useRef();


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

// add addAddressToWhitelist: this adds the current address to the whitelist 
const addNumberToWhitelist = async () =>{
  try {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
      const tx = await whitelistContract.addNumberToWhitelist()
      setLoading(true);
      await tx.wait();
      setLoading(false)

      await getNumberOfWhitelisted()
      setJoinedWhitelist(true);

     } catch (err){
    console.log(err);
  }
};
const getNumberOfWhitelisted = async () => {
  try{
    const provider = await getProviderOrSigner();
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      provider
    );

    const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
    setNumOfWhitelisted(_numberOfWhitelisted);


  } catch(err){
    console.log(err);
  }
}
const checkIfAddressInWhitelist = async () =>{
  try{
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    )
    const address = await signer.getAddress();

    const _joinedWhitelist = await whitelistContract.whitelistedAddress(
      address
    );
    setJoinedWhitelist(_joinedWhitelist);

  } catch (err) {
    console.log(err);
  }
}




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


const renderButton = () => {
  if(walletConnected){
    if(joinedWhitelist){
      return (
        <div className={styles.description}>
          Thanks for Joining the Whitelist
        </div>
      );
    } else if (loading) {
      return <button className={styles.button}>Loading...</button>
    } else{
      return (
        <button onClick={addNumberToWhitelist} className={styles.button}>
          Join the Whitelist
        </button>
      )
    }
  } else {
    return (
      <button onClick={connectWallet} className={styles.button}>
        Connect your wallet
      </button>
    )
  }
}






useEffect(() => {
  if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions: {},
      disabledInjectedProvider:false,
    });
    connectWallet();
  }
  
  
}, [walletConnected])

  return (
    <>
      <Head>
          <title>Whitelist dApp</title>
          <meta name="description" content='whitelist-dApp' />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className={styles.main}>
          <h1 className={styles.title}>
            WELCOME TO CRYPTO DEVS 
          
          <div className={styles.description}>
            {numOfWhitelisted} devs already Joined the whitelist
          </div>
          {/* <button className={styles.button} onClick={b}>Join the whitelist</button> */}
          {renderButton()}
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
