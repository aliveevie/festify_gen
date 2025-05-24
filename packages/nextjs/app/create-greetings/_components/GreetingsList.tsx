import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "~~/components/ui/button";
import ShareModal from "./ShareModal";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

type GreetingCardProps = {
  tokenId: bigint;
  isSent: boolean;
};

const GreetingCard = ({ tokenId, isSent }: GreetingCardProps) => {
  // Fetch all greeting details using useScaffoldReadContract
  const { data: festival } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingFestival",
    args: [tokenId],
  });
  const { data: message } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingMessage",
    args: [tokenId],
  });
  const { data: imageType } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingImageType",
    args: [tokenId],
  });
  const { data: sender } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingSender",
    args: [tokenId],
  });
  const { data: image } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingImage",
    args: [tokenId],
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Prepare image URL
  let imageUrl = image;
  if (image && typeof image === "string" && !image.startsWith("data:") && !image.trim().startsWith("<svg")) {
    imageUrl = `https://ipfs.io/ipfs/${image.replace("ipfs://", "")}`;
  }

  // Show loading state if any data is missing
  if (
    festival === undefined ||
    message === undefined ||
    imageType === undefined ||
    sender === undefined ||
    image === undefined
  ) {
    return (
      <div className="greeting-card bg-white rounded-xl shadow p-6 flex flex-col gap-2 animate-pulse min-h-[250px]">
        <div className="w-full h-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
      </div>
    );
  }

  return (
    <div className="greeting-card bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      {imageUrl && typeof imageUrl === "string" && imageUrl.trim().startsWith("<svg") ? (
        <div
          className="w-full flex justify-center mb-2"
          dangerouslySetInnerHTML={{ __html: imageUrl }}
        />
      ) : imageUrl ? (
        <img src={imageUrl} alt="NFT" className="w-full max-h-48 object-contain mb-2 rounded" />
      ) : null}
      <div className="flex flex-col items-center mb-2">
        <span className="text-lg font-semibold text-center">{festival}</span>
        <span className="text-gray-700 italic text-center mt-1">{message}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>From:</span>
        <Address address={sender} size="sm" />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Token #{tokenId.toString()}</span>
        <span>Design: {imageType}</span>
      </div>
      <div className="flex justify-end mt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShareModalOpen(true)}
        >
          <Share2 size={16} /> Share
        </Button>
      </div>
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        greeting={{ tokenId, festival, message, imageType, sender, image }}
      />
    </div>
  );
};

const GreetingsList = () => {
  const { address } = useAccount();
  const [activeView, setActiveView] = useState<"sent" | "received">("sent");

  // Fetch sent and received tokenIds
  const { data: sentTokenIds, isLoading: loadingSent } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getSentGreetings",
    args: [address],
    watch: true,
  });
  const { data: receivedTokenIds, isLoading: loadingReceived } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getReceivedGreetings",
    args: [address],
    watch: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant={activeView === "sent" ? "default" : "outline"}
          onClick={() => setActiveView("sent")}
          className="min-w-[150px]"
        >
          Sent Greetings
          {sentTokenIds && sentTokenIds.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
              {sentTokenIds.length}
            </span>
          )}
        </Button>
        <Button
          variant={activeView === "received" ? "default" : "outline"}
          onClick={() => setActiveView("received")}
          className="min-w-[150px]"
        >
          Received Greetings
          {receivedTokenIds && receivedTokenIds.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
              {receivedTokenIds.length}
            </span>
          )}
        </Button>
      </div>

      {activeView === "sent" ? (
        loadingSent ? (
          <div className="text-center py-8 text-gray-500">Loading sent greetings...</div>
        ) : !sentTokenIds || sentTokenIds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">You haven't sent any greetings yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentTokenIds.map((tokenId: bigint) => (
              <GreetingCard key={tokenId.toString()} tokenId={tokenId} isSent={true} />
            ))}
          </div>
        )
      ) : loadingReceived ? (
        <div className="text-center py-8 text-gray-500">Loading received greetings...</div>
      ) : !receivedTokenIds || receivedTokenIds.length === 0 ? (
        <div className="text-center py-8 text-gray-500">You haven't received any greetings yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receivedTokenIds.map((tokenId: bigint) => (
            <GreetingCard key={tokenId.toString()} tokenId={tokenId} isSent={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GreetingsList; 