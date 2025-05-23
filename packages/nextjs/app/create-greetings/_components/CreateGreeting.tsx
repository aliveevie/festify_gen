import { useState, useEffect, useMemo } from "react";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Textarea } from "~~/components/ui/textarea";
import { Button } from "~~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~~/components/ui/select";
import { useToast } from "~~/hooks/use-toast";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import DesignSelector from "./DesignSelector";
import GreetingPreview from "./GreetingPreview";
import { festivalDesigns } from "~~/components/templates/festivalDesigns";

const FESTIVAL_TYPES = [
  "Diwali",
  "Christmas",
  "Hanukkah", 
  "Eid",
  "New Year",
  "Birthday",
  "Anniversary",
  "Thanksgiving",
  "Other"
];

const CURRENCIES = ["USD", "ETH", "BTC"];

const CreateGreeting = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [festivalType, setFestivalType] = useState("");
  const [message, setMessage] = useState("");
  const [fromName, setFromName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedDesign, setSelectedDesign] = useState(festivalDesigns[0].id);
  const [isMinting, setIsMinting] = useState(false);
  const [today, setToday] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "FestivalGreetings",
  });

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || !festivalType || !message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields." });
      return;
    }
    setIsMinting(true);
    try {
      await writeContractAsync({
        functionName: "mintGreetingCard",
        args: [recipientAddress, message, festivalType, selectedDesign, false],
      });
      toast({ title: "Greeting created!", description: "Your greeting has been minted as an NFT." });
      setRecipientAddress("");
      setFestivalType("");
      setMessage("");
      setFromName("");
      setAmount("");
      setCurrency("USD");
      setSelectedDesign(festivalDesigns[0].id);
    } catch (err) {
      toast({ title: "Minting failed", description: "There was an error minting your greeting." });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Preview Card Centered */}
      <div className="flex flex-col items-center mb-10">
        <GreetingPreview 
          message={message || "Your greeting message will appear here..."}
          festivalType={festivalType || "Other"}
          design={selectedDesign}
          sender={fromName || address || "Your Name"}
          date={today}
        />
      </div>
      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-transparent">
        <div>
          <Label htmlFor="recipientAddress" className="font-semibold">Recipient Address</Label>
          <Input
            id="recipientAddress"
            placeholder="Enter wallet address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="mt-2 w-full"
          />
        </div>
        <div>
          <Label htmlFor="fromName" className="font-semibold">From Name</Label>
          <Input
            id="fromName"
            placeholder="Enter your name (optional)"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            className="mt-2 w-full"
          />
        </div>
        <div>
          <Label htmlFor="festivalType" className="font-semibold">Festival Type</Label>
          <Select value={festivalType} onValueChange={setFestivalType}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Select festival type" />
            </SelectTrigger>
            <SelectContent>
              {FESTIVAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message" className="font-semibold">Your Message</Label>
          <Textarea
            id="message"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 mt-2 w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount" className="font-semibold">Payment Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full"
            />
          </div>
          <div>
            <Label htmlFor="currency" className="font-semibold">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-festival-lavender text-lg font-bold py-3 mt-2" disabled={isMinting}>
          {isMinting ? "Minting..." : "MINT NFT"}
        </Button>
      </form>
      {/* Design Selector */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Choose a Design</h3>
        <DesignSelector selectedDesign={selectedDesign} onSelectDesign={setSelectedDesign} />
      </div>
    </div>
  );
};

export default CreateGreeting; 