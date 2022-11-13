import abi from '../utils/BuyABCACoffee.json';
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x783DF5eF48Af0F25f446D7855a05c7424Bc96553";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "honey",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  return (
    <div>
      <Head>
        <title>BuyCoffee Dapp</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.nav}>
          <h1 className={styles.title}>
            Buy Soulmate a Coffee!
          </h1>
        </div>

        <div className={styles.front}>
            <div className={styles.fronttitle}>
                <Image src="/backimg1.jpg" width={80} height={80} className={styles.images}></Image>
                <h2>FRONT TABLE</h2>
            </div>
            <div className={styles.frontcontent}>
                {currentAccount ? (
                    <form className={styles.form}>
                        <div className={styles.formusername}>
                            <span>Name: </span>
                            <input id="name" type="text" placeholder="honey" onChange={onNameChange} />
                        </div>

                        <div>
                            <span>Message: </span>
                            <textarea rows={3} placeholder="Enjoy your coffee!" id="message" onChange={onMessageChange} required>
                            </textarea>
                        </div>

                        <div>
                            <button type="button" onClick={buyCoffee}>Send 1 Coffee for 0.001ETH</button>
                        </div>
                    </form>
                ) : (
                    <button className={styles.connectbutton} onClick={connectWallet}> Connect your wallet </button>
                )}
            </div>
        </div>

        <div className={styles.showMemos}>
            {currentAccount && (
                <div className={styles.Memostitle}>
                    <Image src="/memo.png" width={80} height={80} className={styles.images}></Image>
                    <h2>Memos received</h2>
                </div>
            )}

            {currentAccount && (<div className={styles.Memoscontent}>
                {currentAccount && (memos.map(
                    (memo, idx) => {
                        return (      
                                <div key={idx} className={styles.Memocss}>
                                    <p style={{ "fontWeight": "bold" }}>`{memo.message}`</p>
                                    <p>From: {memo.name} at {memo.timestamp.toString()}</p>
                                </div>
                        )
                    })
                )}
            </div>)}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://alchemy.com/?a=roadtoweb3weektwo" target="_blank" rel="noopener noreferrer">
          Created by @FinderTechnical for Alchemy's Road to Web3 lesson two!
        </a>
      </footer>
    </div>
  )
}