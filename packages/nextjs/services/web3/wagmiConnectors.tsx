import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { rainbowkitBurnerWallet } from "burner-connector";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks } = scaffoldConfig;

// Get the WalletConnect project ID from environment variable or config
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || scaffoldConfig.walletConnectProjectId;

if (!projectId || projectId.length !== 32) {
  console.warn(
    "⚠️ WalletConnect projectId is missing or invalid. Please get a project ID at https://cloud.walletconnect.com",
  );
}

const wallets = [
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  ...(!targetNetworks.some(network => network.id !== (chains.hardhat as chains.Chain).id) || !onlyLocalBurnerWallet
    ? [rainbowkitBurnerWallet]
    : []),
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],
  {
    appName: "Festify",
    projectId: projectId || "YOUR_PROJECT_ID", // This will be replaced by the actual project ID
    chains: targetNetworks,
  },
);
