import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiService } from "../services/api.service";

interface WalletState {
  available: number;
  frozen: number;
}

interface WalletContextType {
  wallet: WalletState;
  deduct: (amount: number) => boolean;
  addFunds: (amount: number) => void;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, updateUser } = useAuth();
  const [wallet, setWallet] = useState<WalletState>({
    available: user?.walletBalance || 0,
    frozen: 0,
  });

  // Sync wallet with user data
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      setWallet(prev => ({
        ...prev,
        available: user.walletBalance
      }));
    }
  }, [user?.walletBalance]);

  // Fetch wallet data from API
  const refreshWallet = async () => {
    if (!token) return;
    try {
      const data = await apiService.getWallet(token);
      setWallet({
        available: data.balance,
        frozen: 0
      });
      updateUser({ walletBalance: data.balance });
    } catch (error) {
      console.error("Failed to refresh wallet:", error);
    }
  };

  const deduct = (amount: number): boolean => {
    if (wallet.available >= amount) {
      setWallet((prev) => ({
        ...prev,
        available: prev.available - amount,
      }));
      updateUser({ walletBalance: wallet.available - amount });
      return true;
    }
    return false;
  };

  const addFunds = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      available: prev.available + amount,
    }));
    updateUser({ walletBalance: wallet.available + amount });
  };

  return (
    <WalletContext.Provider value={{ wallet, deduct, addFunds, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
