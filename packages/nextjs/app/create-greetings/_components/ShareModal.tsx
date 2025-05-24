import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~~/components/ui/dialog";
import { Button } from "~~/components/ui/button";
import { useState } from "react";
import { Facebook, Twitter, Linkedin, Mail, Share2 } from "lucide-react";
import { useToast } from "~~/hooks/use-toast";

interface Greeting {
  tokenId: bigint;
  festival?: string;
  message?: string;
  imageType?: number;
  sender?: string;
  image?: string;
}

interface ShareModalProps {
  greeting: Greeting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareModal = ({ greeting, open, onOpenChange }: ShareModalProps) => {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    let url = "";
    const messageText = `I've crafted a special greeting on Festify. Join me in spreading festive joy by creating your own personalized greeting!`;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(messageText)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(messageText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?summary=${encodeURIComponent(messageText)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(`${greeting.festival} Greeting for you`)}&body=${encodeURIComponent(messageText)}`;
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
            <Share2 size={20} /> Share Your {greeting.festival} Greeting
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
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal; 