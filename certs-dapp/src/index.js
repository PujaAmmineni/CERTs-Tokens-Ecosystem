import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CERTsTokenABI from "../abis/CERTsToken.json";

const CONTRACT_ADDRESS = "0x2a1A1D2315B903215e828450792777D5813c7c69";

export default function Home() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState("0");
    const [loading, setLoading] = useState(true);

    async function connectWallet() {
        if (!window.ethereum) return alert("Install MetaMask first!");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());

        // Connect to Smart Contract
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, CERTsTokenABI, signer);
        const userBalance = await tokenContract.balanceOf(await signer.getAddress());
        setBalance(ethers.formatUnits(userBalance, 18));
        setLoading(false);
    }

    return (
        <div>
            <h1>🎓 CERTs Token Ecosystem</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p><strong>Connected Account:</strong> {account}</p>
                    <p><strong>Balance:</strong> {balance} CERTs</p>
                </>
            )}
            <button onClick={connectWallet}>Connect MetaMask</button>
        </div>
    );
}
