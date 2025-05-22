"use client";

import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

interface IpfsUploaderProps {
  onUploadComplete: (hash: string) => void;
}

const IpfsUploader = ({ onUploadComplete }: IpfsUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [ipfs, setIpfs] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initIpfs = async () => {
      try {
        // Only import and initialize IPFS in the browser
        if (typeof window !== 'undefined') {
          const { create } = await import('ipfs-http-client');
          const ipfsClient = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
              authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET}`,
              ).toString("base64")}`,
            },
          });
          setIpfs(ipfsClient);
        }
      } catch (err) {
        console.error("Failed to initialize IPFS:", err);
        toast.error("Failed to initialize IPFS client");
      }
    };

    initIpfs();
  }, [isMounted]);

  const handleIpfsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ipfs) {
      try {
        setIsUploading(true);
        const added = await ipfs.add(file);
        onUploadComplete(added.path);
        toast.success("Image uploaded to IPFS successfully!");
      } catch (err) {
        toast.error("Failed to upload to IPFS");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Don't render anything until we're mounted on the client
  if (!isMounted) {
    return null;
  }

  return (
    <Button variant="outlined" component="label" disabled={isUploading || !ipfs}>
      {isUploading ? <CircularProgress size={24} /> : "Upload to IPFS"}
      <input type="file" hidden accept="image/*" onChange={handleIpfsUpload} />
    </Button>
  );
};

export default IpfsUploader; 