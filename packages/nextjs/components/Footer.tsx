import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { Globe, Send, Twitter } from "lucide-react";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <>
      <footer className="bg-gray-50 py-10 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Logo and description */}
          <div>
            <div className="flex items-center mb-2">
              <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">FG</span>
              </div>
              <span className="font-bold text-xl">Festival Greetings</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-xs">
              Send personalized festival greetings to your loved ones and spread joy. Create beautiful designs and share memorable moments.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="https://arbilearn.club" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Globe className="w-5 h-5 text-gray-700" />
              </a>
              <a href="https://t.me/ibrahim_193" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Send className="w-5 h-5 text-gray-700" />
              </a>
              <a href="https://x.com/iabdulkarim472" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Twitter className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>
          {/* Center: Links */}
          <div>
            <h4 className="font-bold mb-3">Links</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/create-greetings">Create Greetings</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
          {/* Right: Support */}
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="bg-gray-50 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        Forked with <span className="text-red-500">❤️</span> by <a href="https://buidlguidl.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#8854d0]">BuidlGuidl</a>
      </div>
    </>
  );
};
