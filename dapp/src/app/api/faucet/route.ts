import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const faucetABI = [
  {
    inputs: [],
    name: "MAX_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "receipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "requestTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount } = await request.json();

    if (!recipient || !amount || !ethers.isAddress(recipient)) {
      return new NextResponse(
        JSON.stringify({ error: "잘못된 지갑 주소입니다." }),
        { status: 400 }
      );
    }

    const requestedAmount = ethers.parseEther(amount.toString());
    const maxAmount = ethers.parseEther("0.5");
    if (requestedAmount > maxAmount) {
      return new NextResponse(
        JSON.stringify({ error: "요청 금액이 최대 0.5 ETH를 초과합니다." }),
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY!, provider);

    const faucetContract = new ethers.Contract(
      process.env.FAUCET_CONTRACT_ADDRESS!,
      faucetABI,
      wallet
    );
    console.log(faucetContract);

    return new NextResponse(JSON.stringify({ recipient, amount }));
  } catch (error: any) {
    console.error("Faucet API 에러: ", error);

    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
