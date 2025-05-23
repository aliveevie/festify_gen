import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~~/components/ui/dialog";
import { Button } from "~~/components/ui/button";
import { useState } from "react";
import { Facebook, Twitter, Linkedin, Mail, Copy, Check, Share2 } from "lucide-react";
import { useToast } from "~~/hooks/use-toast";

interface Greeting {
  id: string;
  recipient: string;
  message: string;
  festivalType: string;
  design: string;
  date: string;
}

interface ShareModalProps {
  greeting: Greeting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal = ({ greeting, open, onOpenChange }: ShareModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://festivalgreetings.com/share/${greeting.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "The greeting link was copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let url = "";
    const messageText = `Check out my ${greeting.festivalType} greeting: \"${greeting.message.substring(0, 50)}${greeting.message.length > 50 ? '...' : ''}\"`;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(messageText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(messageText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(`${greeting.festivalType} Greeting for you`)}&body=${encodeURIComponent(`${messageText}\n\nView it here: ${shareUrl}`)}`;
        break;
    }
    window.open(url, "_blank");
    toast({ title: "Sharing initiated!", description: `Sharing on ${platform} has been initiated.` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} /> Share Your {greeting.festivalType} Greeting
          </DialogTitle>
          <DialogDescription>
            Share this greeting with your friends and family on social media
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("twitter")}> <Twitter className="h-6 w-6 text-[#1DA1F2]" /> <span className="text-xs">Twitter</span> </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("facebook")}> <Facebook className="h-6 w-6 text-[#1877F2]" /> <span className="text-xs">Facebook</span> </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("linkedin")}> <Linkedin className="h-6 w-6 text-[#0A66C2]" /> <span className="text-xs">LinkedIn</span> </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("email")}> <Mail className="h-6 w-6 text-gray-600" /> <span className="text-xs">Email</span> </Button>
        </div>
        <div className="relative flex items-center">
          <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10" readOnly value={shareUrl} />
          <Button type="button" variant="ghost" className="absolute right-0 h-10 w-10 text-xs" onClick={handleCopyLink} disabled={copied}> {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} </Button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">This will share a link to view your greeting card</p>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal; 