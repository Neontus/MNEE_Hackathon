import { useReadContract, useWriteContract, useAccount, useChainId, useBalance } from 'wagmi';
import { TREASURY_ABI } from '@/lib/contracts/abi';
import { TREASURY_ADDRESS } from '@/lib/contracts/addresses';
import { ERC20_ABI, CURRENT_TOKEN } from '@/lib/constants/tokens';
import { formatEther, parseEther, formatUnits } from 'viem';

export function useTreasuryAddress() {
    const chainId = useChainId();
    const chainMap: Record<number, `0x${string}`> = {
        1: TREASURY_ADDRESS.mainnet,
        11155111: TREASURY_ADDRESS.sepolia
    };
    return chainMap[chainId] || TREASURY_ADDRESS.sepolia;
}

export function useTreasuryTokenBalance() {
    const treasury = useTreasuryAddress();
    const { data: balance } = useReadContract({
        address: CURRENT_TOKEN,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [treasury],
    });
    
    // Assume USDC has 6 decimals, but we should fetch it dynamically if possible. 
    // For now we'll assume 6 for USDC.
    return balance ? formatUnits(balance, 6) : '0'; 
}

export function useTreasuryBudget() {
    const address = useTreasuryAddress();
    
    const { data: dailyLimit } = useReadContract({
        address,
        abi: TREASURY_ABI,
        functionName: 'dailyLimit',
    });

    const { data: spentToday } = useReadContract({
        address,
        abi: TREASURY_ABI,
        functionName: 'spentToday',
    });

    // Contract stores values in Wei (18 decimals assumed for simplicity in contract logic usually, 
    // but if we pay in USDC (6 decimals), we must interpret it correctly.
    // If the contract logic treats numbers as raw uint256, we must format it as USDC.
    // Assuming contract dailyLimit was set in USDC units (e.g. 1000 * 10^6).
    
    return {
        dailyLimit: dailyLimit ? formatUnits(dailyLimit, 6) : '0',
        spentToday: spentToday ? formatUnits(spentToday, 6) : '0',
    };
}

export function useSetBudget() {
    const { writeContract, isPending, isSuccess, error } = useWriteContract();
    const treasury = useTreasuryAddress();

    const setBudget = (amount: string, category?: string) => {
        // Amount is in human readable USDC (e.g. "100")
        const amountUnits = BigInt(Math.floor(Number(amount) * 1e6));
        
        if (category && category.trim().length > 0) {
            writeContract({
                address: treasury,
                abi: TREASURY_ABI,
                functionName: 'setCategoryLimit',
                args: [category, amountUnits],
            });
        } else {
            writeContract({
                address: treasury,
                abi: TREASURY_ABI,
                functionName: 'setDailyLimit',
                args: [amountUnits],
            });
        }
    }
    
    return { setBudget, isPending, isSuccess, error };
}

export function usePayInvoice() {
    const { writeContract, isPending, isSuccess, error } = useWriteContract();
    const treasury = useTreasuryAddress();

    const pay = async (to: `0x${string}`, amount: string, reason: string) => {
         // Amount is string USDC e.g "100.50"
         // Convert to 6 decimals
         const amountUnits = BigInt(Math.floor(Number(amount) * 1e6));

        writeContract({
            address: treasury,
            abi: TREASURY_ABI,
            functionName: 'pay',
            args: [CURRENT_TOKEN, to, amountUnits, reason],
        });
    };

    return { pay, isPending, isSuccess, error };
}
