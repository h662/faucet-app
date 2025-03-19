"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient: walletAddress, amount }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(`에러: ${data.error}`);
      } else {
        setMessage(`성공! 트랜잭션 해시: ${data.txHash}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Faucet 요청</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          className="p-2 border rounded"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "요청 중..." : "Faucet 요청"}
        </button>
      </form>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
