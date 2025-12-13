import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // ethers.BrowserProvider accepts Eip1193Provider, which is basically any object with request method.
    // simpler to cast to any internally if needed or just leave as unknown dependent on ethers types.
    // verification showed error on line 5:16 which is the type definition inside global.
    return new ethers.BrowserProvider(window.ethereum as any); 
  }
  return null;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
