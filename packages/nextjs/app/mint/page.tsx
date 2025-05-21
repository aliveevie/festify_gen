"use client";

import dynamic from "next/dynamic";

const MintPage = dynamic(() => import("../../components/MintPage"), {
  ssr: false,
});

export default function Page() {
  return <MintPage />;
} 