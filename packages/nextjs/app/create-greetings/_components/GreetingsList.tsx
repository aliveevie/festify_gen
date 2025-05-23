import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { Button } from "~~/components/ui/button";
import ShareModal from "./ShareModal";
import { useAccount, usePublicClient } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { Address } from "~~/components/scaffold-eth";

const chainId = 31337; // or use your actual chainId logic
const contract = deployedContracts[chainId]?.FestivalGreetings;

const shortenAddress = (address: string | undefined | null) => {
  if (!address || typeof address !== 'string' || address.length < 10) return '-';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// First check if token exists before fetching details
async function checkTokenExists(tokenId: bigint, client: ReturnType<typeof usePublicClient>) {
  if (!contract || !client || tokenId === undefined || tokenId === null) return false;
  try {
    const owner = await client.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "ownerOf",
      args: [tokenId],
    });
    return !!owner;
  } catch (e) {
    return false;
  }
}

// Fetch greeting details only if token exists
async function fetchGreetingDetails(tokenId: bigint, client: ReturnType<typeof usePublicClient>) {
  if (!contract || !client || tokenId === undefined || tokenId === null) {
    console.warn(`[DEBUG] Skipping tokenId ${tokenId}: contract or client missing`);
    return null;
  }
  try {
    // First check if token exists
    const exists = await checkTokenExists(tokenId, client);
    if (!exists) {
      console.warn(`[DEBUG] Skipping tokenId ${tokenId}: ownerOf failed (token does not exist)`);
      return null;
    }

    // Fetch tokenURI (for OpenSea-style display)
    let tokenUri: string | undefined = undefined;
    let image: string | undefined = undefined;
    try {
      tokenUri = await client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "tokenURI",
        args: [tokenId],
      });
      if (!tokenUri) {
        console.warn(`[DEBUG] tokenId ${tokenId}: tokenURI is missing or empty`);
      }
      // If it's a data:application/json URI, decode it
      if (tokenUri && tokenUri.startsWith("data:application/json")) {
        const json = JSON.parse(atob(tokenUri.split(",")[1]));
        image = json.image;
      } else if (tokenUri && tokenUri.startsWith("data:image/svg+xml")) {
        image = tokenUri;
      } else {
        image = tokenUri;
      }
    } catch (e) {
      console.warn(`[DEBUG] tokenId ${tokenId}: tokenURI fetch failed`, e);
    }

    const [festival, message, imageType, sender] = await Promise.all([
      client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "getGreetingFestival",
        args: [tokenId],
      }),
      client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "getGreetingMessage",
        args: [tokenId],
      }),
      client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "getGreetingImageType",
        args: [tokenId],
      }),
      client.readContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "getGreetingSender",
        args: [tokenId],
      }),
    ]);
    console.log(`[DEBUG] tokenId ${tokenId}: festival=${festival}, message=${message}, imageType=${imageType}, sender=${sender}, image=${!!image}`);
    return { tokenId, festival, message, imageType, sender, image };
  } catch (e) {
    console.error("Failed to fetch greeting details for tokenId", tokenId, e);
    return null;
  }
}

const GreetingsList = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGreeting, setSelectedGreeting] = useState<any | null>(null);
  const [sentDetails, setSentDetails] = useState<any[]>([]);
  const [receivedDetails, setReceivedDetails] = useState<any[]>([]);
  const [loadingSent, setLoadingSent] = useState(false);
  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSentTokenIds, setLoadingSentTokenIds] = useState(true);
  const [loadingReceivedTokenIds, setLoadingReceivedTokenIds] = useState(true);
  const { address } = useAccount();
  const client = usePublicClient();

  // Fetch sent and received tokenIds
  const { data: sentTokenIds } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getSentGreetings",
    args: [address],
    watch: true,
  });
  const { data: receivedTokenIds } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getReceivedGreetings",
    args: [address],
    watch: true,
  });

  // Log the raw data returned from the contract
  useEffect(() => {
    console.log("[GreetingsList] getSentGreetings:", sentTokenIds);
    console.log("[GreetingsList] getReceivedGreetings:", receivedTokenIds);
  }, [sentTokenIds, receivedTokenIds]);

  // Track loading state for tokenIds
  useEffect(() => {
    setLoadingSentTokenIds(sentTokenIds === undefined);
  }, [sentTokenIds]);
  useEffect(() => {
    setLoadingReceivedTokenIds(receivedTokenIds === undefined);
  }, [receivedTokenIds]);

  // Defensive logging
  useEffect(() => {
    console.log("[GreetingsList] contract:", contract);
    console.log("[GreetingsList] client:", client);
    console.log("[GreetingsList] sentTokenIds:", sentTokenIds);
    console.log("[GreetingsList] receivedTokenIds:", receivedTokenIds);
  }, [contract, client, sentTokenIds, receivedTokenIds]);

  // Deduplicate tokenIds if user is both sender and recipient
  const sentIds = Array.isArray(sentTokenIds) ? sentTokenIds.map(id => id?.toString()).filter(Boolean) : [];
  const receivedIds = Array.isArray(receivedTokenIds) ? receivedTokenIds.map(id => id?.toString()).filter(Boolean) : [];
  const uniqueSent = [...new Set(sentIds)];
  const uniqueReceived = [...new Set(receivedIds.filter(id => !sentIds.includes(id)))];

  // Helper to ensure tokenId is bigint
  function toBigInt(id: string | number | bigint): bigint {
    if (typeof id === 'bigint') return id;
    if (typeof id === 'number') return BigInt(id);
    return BigInt(id);
  }

  // Fetch details for sent greetings
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoadingSent(true);
      if (!client || !contract) {
        setSentDetails([]);
        setLoadingSent(false);
        return;
      }
      try {
        const results = await Promise.all(
          uniqueSent.map(id => fetchGreetingDetails(toBigInt(id), client))
        );
        if (!cancelled) {
          setSentDetails(results.filter(Boolean));
        }
      } catch (e) {
        console.error("Error fetching sent greetings:", e);
        if (!cancelled) {
          setSentDetails([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSent(false);
        }
      }
    }
    if (uniqueSent.length > 0 && client && contract) fetchAll();
    else setSentDetails([]);
    return () => { cancelled = true; };
  }, [sentTokenIds, client, contract]);

  // Fetch details for received greetings
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoadingReceived(true);
      if (!client || !contract) {
        setReceivedDetails([]);
        setLoadingReceived(false);
        return;
      }
      try {
        const results = await Promise.all(
          uniqueReceived.map(id => fetchGreetingDetails(toBigInt(id), client))
        );
        if (!cancelled) {
          setReceivedDetails(results.filter(Boolean));
        }
      } catch (e) {
        console.error("Error fetching received greetings:", e);
        if (!cancelled) {
          setReceivedDetails([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingReceived(false);
        }
      }
    }
    if (uniqueReceived.length > 0 && client && contract) fetchAll();
    else setReceivedDetails([]);
    return () => { cancelled = true; };
  }, [receivedTokenIds, client, contract]);

  const handleShare = (greeting: any) => {
    setSelectedGreeting(greeting);
    setShareModalOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Sent Greetings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Sent Greetings</h2>
        {loadingSentTokenIds || loadingSent ? (
          <div className="text-center py-8 text-gray-500">Loading sent greetings...</div>
        ) : sentTokenIds && sentTokenIds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">You haven't sent any greetings yet.</div>
        ) : sentDetails.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No valid greetings found for your tokens.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentDetails.map(greeting => {
              // Parse name/description from tokenURI if available
              let name = "";
              let description = "";
              if (greeting.image && greeting.image.startsWith('data:application/json')) {
                try {
                  const json = JSON.parse(atob(greeting.image.split(",")[1]));
                  name = json.name || "";
                  description = json.description || "";
                } catch {}
              }
              return (
                <div key={greeting.tokenId} className="greeting-card bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                  {/* NFT Image */}
                  {greeting.image && greeting.image.startsWith('data:image/svg+xml') ? (
                    <div className="w-full flex justify-center mb-2" dangerouslySetInnerHTML={{ __html: atob(greeting.image.split(",")[1]) }} />
                  ) : greeting.image ? (
                    <img src={greeting.image} alt="NFT" className="w-full max-h-48 object-contain mb-2" />
                  ) : null}
                  {/* Name and Description */}
                  {name && <div className="text-lg font-bold text-center mb-1">{name}</div>}
                  {description && <div className="text-sm text-gray-500 text-center mb-2">{description}</div>}
                  {/* Festival and Message */}
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-base font-semibold">{greeting.festival || '...'}</span>
                    <span className="text-gray-700 italic">{greeting.message || '...'}</span>
                  </div>
                  {/* Sender with avatar */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>Sender:</span>
                    <Address address={greeting.sender} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Token #{greeting.tokenId}</span>
                    <span>Design: {greeting.imageType !== undefined ? greeting.imageType : '-'}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleShare(greeting)}
                    >
                      <Share2 size={16} /> Share
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Received Greetings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Received Greetings</h2>
        {loadingReceivedTokenIds || loadingReceived ? (
          <div className="text-center py-8 text-gray-500">Loading received greetings...</div>
        ) : receivedTokenIds && receivedTokenIds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">You haven't received any greetings yet.</div>
        ) : receivedDetails.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No valid greetings found for your tokens.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receivedDetails.map(greeting => {
              let name = "";
              let description = "";
              if (greeting.image && greeting.image.startsWith('data:application/json')) {
                try {
                  const json = JSON.parse(atob(greeting.image.split(",")[1]));
                  name = json.name || "";
                  description = json.description || "";
                } catch {}
              }
              return (
                <div key={greeting.tokenId} className="greeting-card bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                  {greeting.image && greeting.image.startsWith('data:image/svg+xml') ? (
                    <div className="w-full flex justify-center mb-2" dangerouslySetInnerHTML={{ __html: atob(greeting.image.split(",")[1]) }} />
                  ) : greeting.image ? (
                    <img src={greeting.image} alt="NFT" className="w-full max-h-48 object-contain mb-2" />
                  ) : null}
                  {name && <div className="text-lg font-bold text-center mb-1">{name}</div>}
                  {description && <div className="text-sm text-gray-500 text-center mb-2">{description}</div>}
                  <div className="flex flex-col items-center mb-2">
                    <span className="text-base font-semibold">{greeting.festival || '...'}</span>
                    <span className="text-gray-700 italic">{greeting.message || '...'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>Sender:</span>
                    <Address address={greeting.sender} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Token #{greeting.tokenId}</span>
                    <span>Design: {greeting.imageType !== undefined ? greeting.imageType : '-'}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleShare(greeting)}
                    >
                      <Share2 size={16} /> Share
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedGreeting && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          greeting={selectedGreeting}
        />
      )}
    </div>
  );
};

export default GreetingsList; 