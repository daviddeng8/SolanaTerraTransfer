import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AccountInfo, Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';
import { parseUnits, zeroPad } from "ethers/lib/utils";
import getSignedVAAWithRetry from '../util/getSignedVAAWithRetry';
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import axios from "axios";
import {
    LCDClient,
    MnemonicKey,
    MsgExecuteContract,
  } from "@terra-money/terra.js";


// Wormhole Dependency
import {
    CHAIN_ID_SOLANA,
    CHAIN_ID_TERRA,
    getEmitterAddressSolana,
    getSignedVAA,
    hexToUint8Array,
    nativeToHexString,
    parseSequenceFromLogSolana,
    transferFromSolana,
} from '@certusone/wormhole-sdk'

// Token Conversion
import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { redeemOnTerra } from '@certusone/wormhole-sdk/lib/cjs/nft_bridge';


const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): Promise<PublicKey> {
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    ))[0];
}

// Props
interface NetworkProps {
    network: string,
}

// Wait for Transaction
// const waitForSolanaTransaction = async ({
//     hash,
// }: {
//     hash: string
// }): Promise<EtherBaseReceiptResultType | undefined> => {
//     if (fromBlockChain !== BlockChainType.terra && asset?.terraToken) {
//         return loginUser.provider?.waitForTransaction(hash)
//     }
// }

export const Transfer: FC<NetworkProps> = (props) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();

    const onClick = useCallback(async () => {

        if (!publicKey) throw new WalletNotConnectedError();

        // Wormhole
        const network = props.network
        // To fetch the signedVAA from the Wormhole Network (
        // const WORMHOLE_RPC_HOSTS =
        //     network === WalletAdapterNetwork.Devnet
        //     ? [
        //         "https://wormhole-v2-mainnet-api.certus.one",
        //         "https://wormhole.inotel.ro/",]
        //     : network === WalletAdapterNetwork.Testnet
        //     ? ["https://wormhole-v2-testnet-api.certus.one"]
        //     : ["http://localhost:8080"];

        const WORMHOLE_RPC_HOSTS = ["https://wormhole-v2-testnet-api.certus.one"]

        // const SOL_BRIDGE_ADDRESS =
        //     network === WalletAdapterNetwork.Devnet
        //     ? "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth"
        //     : network === WalletAdapterNetwork.Testnet
        //     ? "Brdguy7BmNB4qwEbcqqMbyV5CyJd2sxQNUn6NEpMSsUb"
        //     : "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o";
    
        // const SOL_TOKEN_BRIDGE_ADDRESS =
        //     network === WalletAdapterNetwork.Devnet
        //     ? "wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb"
        //     : network === WalletAdapterNetwork.Testnet
        //     ? "A4Us8EhCC76XdGAN17L4KpRNEK423nMivVHZzZqFqqBg"
        //     : "B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE";

        const SOL_BRIDGE_ADDRESS = "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
        const SOL_TOKEN_BRIDGE_ADDRESS = "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe"
        
        
        const payerAddress = publicKey.toString() // "5MCPvusZPubnQJLV8RG2STnKJ9hUBZPgZ4zqBmDqrBfa"
        console.log("Checking wallet: ", publicKey.toString())
        // GET TOKEN ADDRESS
        // let splParsedTokenAccounts = await connection
        //     .getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
        //         programId: new PublicKey(TOKEN_PROGRAM_ID),
        //     })
        //     .then((result) => {
        //         return result.value.map((item) =>
        //         createParsedTokenAccountFromInfo(item.pubkey, item.account)
        //         );
        //     });
        // //In the transfer case, we also pull the SOL balance of the wallet, and prepend it at the beginning of the list.
        // const nativeAccount = await createNativeSolParsedTokenAccount(
        //     connection,
        //     walletAddress
        // );
        // if (nativeAccount !== null) {
        //     splParsedTokenAccounts.unshift(nativeAccount);
        // }
        // dispatch(receiveSourceParsedTokenAccounts(splParsedTokenAccounts));
        // }

        // const fromAddress = "HbHGuJvpUek2VTSFntvL3hWEmuQGMJHg5cQ2PiY79QVv" // 9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i

        // GET MINT ADDRESS
        // const data = Buffer.from(account.data);
        // const mintInfo = MintLayout.decode(data);

        // const uintArray = mintInfo?.mintAuthority;
        // const pubkey = new PublicKey(uintArray);
        // const supply = BigNumber.from(mintInfo?.supply.reverse()).toString();

        // const mintAddress = supply.toString()

        const mintAddress = '5Dmmc5CC6ZpKif8iN5DSY9qNYrWJvEKcX2JrxGESqRMu'

        // Token account address
        const fromAddress = await findAssociatedTokenAddress(publicKey, new PublicKey(mintAddress))
        console.log(fromAddress);
        const transferAmountParsed: bigint = BigInt(1000000)
        // const targetAddressStr 
        // const targetAddress = hexToUint8Array(targetAddressStr)
        const targetAddress = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 46, 41, 229, 166, 119, 28, 85, 194, 201, 109, 202, 121, 93, 56, 186, 139, 33, 120, 79])
        const originAddress = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 117, 117, 115, 100])
        const targetChain = 3 // CHAIN_ID_TERRA
        // const originAddressStr = ""
        // const originAddress = originAddressStr
            // ? zeroPad(hexToUint8Array(originAddressStr), 32)
            // ? hexToUint8Array(originAddressStr)
            // : undefined;
        const originChain = 3 // CHAIN_ID_SOLANA


        

        // const feeParsed = parseUnits()

        const feeParsed = parseUnits("0", 6);

        console.log("wtv")
        const transaction = await transferFromSolana(
            connection,
            SOL_BRIDGE_ADDRESS,
            SOL_TOKEN_BRIDGE_ADDRESS,
            payerAddress,               // Public Key of Wallet
            fromAddress.toString(),                // Wallet's specific address for the token (UST)
            mintAddress,                // wUST's address
            transferAmountParsed,       // 
            targetAddress,              // 
            targetChain,                // Terra
            originAddress,              // 
            originChain,                // Solana
            undefined,
            feeParsed.toBigInt()
        );
        console.log("happiness")
        const signed = await signTransaction?.(transaction);
        console.log("Signed: ", signed)
        
        console.log("Signed serizlie: ", signed!.serialize())
        const txid = await connection.sendRawTransaction(signed!.serialize());
        await connection.confirmTransaction(txid);
       
        // try {
        //     const signature = await sendTransaction(transaction, connection);
        // } catch (e) {
        //     console.log("error in the send transaction thing")
        //     return;
        // }
        // await connection.confirmTransaction(signature, 'processed');

        // redeem on the terra side

        const TERRA_TOKEN_BRIDGE_ADDRESS = "terra1pseddrv0yfsn76u4zxrjmtf45kdlmalswdv39a"

        console.log("1")
        const info = await connection.getTransaction(txid);
        console.log("2")

        const sequence = parseSequenceFromLogSolana(info!);
        console.log("3")

        const emitterAddress = await getEmitterAddressSolana(SOL_TOKEN_BRIDGE_ADDRESS);
        console.log("4")

        // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
        const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            CHAIN_ID_SOLANA,
            emitterAddress,
            sequence,
          );
        console.log("5")

        const msg = await redeemOnTerra(TERRA_TOKEN_BRIDGE_ADDRESS, 
                            "terra1hqhznedxwuw9tskfdh98jhfch29jz7z0696x2a",
                            signedVAA)

        console.log("msg: ", msg)
        const TERRA_PRIVATE_KEY = 'alcohol casual worry owner recycle mention tourist legend spray document lab obvious spider brass canoe wool funny mandate alpha blanket south purse layer summer'

        const TERRA_GAS_PRICES_URL = "https://fcd.terra.dev/v1/txs/gas_prices"

        const mk = new MnemonicKey({
            mnemonic: TERRA_PRIVATE_KEY
        });



        const lcd = new LCDClient({
            URL: 'https://bombay-lcd.terra.dev',
            chainID: 'bombay-12',
        })


        // const mk = new MnemonicKey()

    
        console.log("6")

        const wallet = lcd.wallet(mk)
        console.log("7")

        const gasPrices = await axios
            .get(TERRA_GAS_PRICES_URL)
            .then((result) => result.data);
        console.log("8")

        const feeEstimate = await lcd.tx.estimateFee(
        [
            {
            sequenceNumber: await wallet.sequence(),
            publicKey: wallet.key.publicKey,
            },
        ],
        {
            msgs: [msg],
            memo: "localhost",
            feeDenoms: ["uluna"],
            gasPrices,
        }
        );
        console.log("9")
        const tx = await wallet.createAndSignTx({
            msgs: [msg],
            memo: "localhost",
            feeDenoms: ["uluna"],
            gasPrices,
            fee: feeEstimate,
        });
        console.log("10")

        await lcd.tx.broadcast(tx);
        




        console.log("end of the thing")
    }, [connection, props.network, publicKey, sendTransaction]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Send $1 to Wormhole!
        </button>
    );
};