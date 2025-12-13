'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTreasuryBalance, getTreasuryAddress, sendTreasuryTransaction } from '@/lib/actions';

interface TreasuryState {
    address: string | null;
    balance: { total: number };
    refresh: () => Promise<void>;
    send: (to: string, amount: number) => Promise<{ success: boolean; error?: string; ticketId?: string }>;
}

interface User {
    id: string;
    name: string;
    organizationId: string;
}

interface AuthContextType {
    user: User;
    treasury: TreasuryState;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
    id: 'user-1',
    name: 'Agent Admin',
    organizationId: 'org-1'
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [treasuryAddress, setTreasuryAddress] = useState<string | null>(null);
    const [treasuryBalance, setTreasuryBalance] = useState({ total: 0 });

    const refreshTreasury = async () => {
        try {
            const [addr, bal] = await Promise.all([
                getTreasuryAddress(),
                getTreasuryBalance()
            ]);
            setTreasuryAddress(addr);
            setTreasuryBalance(bal);
        } catch (e) {
            console.error("Failed to fetch treasury info", e);
        }
    };

    useEffect(() => {
        refreshTreasury();
    }, []);

    const send = async (to: string, amount: number) => {
        const result = await sendTreasuryTransaction(to, amount);
        if (result.success) {
            await refreshTreasury();
        }
        return {
            success: result.success,
            error: result.error || undefined,
            ticketId: result.ticketId || undefined
        };
    };

    const value = {
        user: MOCK_USER,
        isAuthenticated: true,
        treasury: {
            address: treasuryAddress,
            balance: treasuryBalance,
            refresh: refreshTreasury,
            send
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
