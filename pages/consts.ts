const ci = false;


export const SOLANA_HOST = ci
    ? "http://solana-devnet:8899"
    : "http://localhost:8899";
export const SOLANA_PRIVATE_KEY = new Uint8Array([
    14, 173, 153, 4, 176, 224, 201, 111, 32, 237, 183, 185, 159, 247, 22, 161,
    89, 84, 215, 209, 212, 137, 10, 92, 157, 49, 29, 192, 101, 164, 152, 70, 87,
    65, 8, 174, 214, 157, 175, 126, 98, 90, 54, 24, 100, 177, 247, 77, 19, 112,
    47, 44, 165, 109, 233, 102, 14, 86, 109, 29, 134, 145, 132, 141,
]);
export const SOLANA_CORE_BRIDGE_ADDRESS =
    "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o";
export const SOLANA_TOKEN_BRIDGE_ADDRESS =
    "B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE";