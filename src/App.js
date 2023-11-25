import React, { useState, useEffect } from 'react';
import LendingPoolV2Artifact from '@aave/protocol-v2/artifacts/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json';
import Web3 from 'web3'
const abi = require('erc-20-abi')

const aaveContractAddress = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const tokenAddress = '0x2AC03BF434db503f6f5F85C3954773731Fc3F056';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [amountToDeposit, setAmountToDeposit] = useState('10000000');

  useEffect(() => {

    const connectToMetaMask = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setUserAddress(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask extension is not installed');
      }
    };

    connectToMetaMask();
  }, []);

  const Deposit = async () => {
    try {
      if (web3) {
        const erc20Contract = new web3.eth.Contract(abi, tokenAddress);

        await erc20Contract.methods.approve(aaveContractAddress, amountToDeposit).send({ from: userAddress });

        const aaveContract = new web3.eth.Contract(LendingPoolV2Artifact.abi, aaveContractAddress);
        await aaveContract.methods.deposit(tokenAddress, amountToDeposit, userAddress, 0).send({ from: userAddress });

        console.log('Deposit successful!');
      }
    } catch (error) {
      console.error('Error depositing to Aave:', error);
    }
  };

  return (
    <div>
      <h1>Depositing ERC20 to Aave smart contract</h1>
      {web3 && (
        <>
          <p>Connected to MetaMask</p>
          <p>User Address: {userAddress}</p>
          <button onClick={Deposit}>Deposit to Aave</button>
        </>
      )}
    </div>
  );
};

export default App;
