import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import CERTsTokenJSON from "./abis/CERTsToken.json";
import { Button, Card, CardContent, Input } from "@/components/ui";

const CERTsTokenABI = CERTsTokenJSON.abi;
const CERTsTokenAddress = "0x2a1A1D2315B903215e828450792777D5813c7c69";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentPrice, setContentPrice] = useState("");
  const [learnerTokens, setLearnerTokens] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      return signer;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Wallet connection failed.");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const signer = await connectWallet();
      if (!signer) return;

      try {
        const tokenContract = new Contract(CERTsTokenAddress, CERTsTokenABI, signer);
        const name = await tokenContract.name();
        setTokenName(name);
        const balance = await tokenContract.balanceOf(await signer.getAddress());
        setTokenBalance(formatUnits(balance, 18));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch contract data.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function buyContent() {
    console.log("Buying content for", contentPrice, "CERTs Tokens");
  }

  async function certifyLearner() {
    console.log("Certifying learner with", learnerTokens, "tokens");
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 style={{ color: "red" }}>{error}</h1>;

  return (
    <div className="p-4 font-sans">
      <h1 className="text-xl font-bold">{tokenName} Ecosystem</h1>
      <p>Connected Account: {account}</p>
      <p>Your Token Balance: {tokenBalance || "0"}</p>
      <Button onClick={connectWallet}>Reconnect Wallet</Button>

      {/* Marketplace */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-lg font-semibold">Buy Educational Content</h2>
          <Input
            type="number"
            placeholder="Enter amount"
            value={contentPrice}
            onChange={(e) => setContentPrice(e.target.value)}
          />
          <Button onClick={buyContent} className="mt-2">Purchase</Button>
        </CardContent>
      </Card>

      {/* Certification */}
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-lg font-semibold">Certify Learner</h2>
          <Input
            type="number"
            placeholder="Tokens to Certify"
            value={learnerTokens}
            onChange={(e) => setLearnerTokens(e.target.value)}
          />
          <Button onClick={certifyLearner} className="mt-2">Certify</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
