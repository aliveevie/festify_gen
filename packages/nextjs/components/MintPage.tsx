"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { create } from "ipfs-http-client";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";

// Predefined SVG designs
const predefinedDesigns = [
  {
    id: 1,
    name: "Gradient Celebration",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6a11cb;stop-opacity:1">
            <animate attributeName="stop-color" values="#6a11cb;#2575fc;#6a11cb" dur="10s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#2575fc;stop-opacity:1">
            <animate attributeName="stop-color" values="#2575fc;#6a11cb;#2575fc" dur="10s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#grad1)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="white" font-weight="bold">
        {{message}}
      </text>
    </svg>`,
  },
  {
    id: 2,
    name: "Festive Stars",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
      <rect width="500" height="500" fill="#1a1a1a"/>
      <g>
        <path d="M50,50 L55,65 L70,65 L60,75 L65,90 L50,80 L35,90 L40,75 L30,65 L45,65 Z" fill="gold"/>
        <path d="M400,100 L405,115 L420,115 L410,125 L415,140 L400,130 L385,140 L390,125 L380,115 L395,115 Z" fill="gold"/>
        <path d="M150,400 L155,415 L170,415 L160,425 L165,440 L150,430 L135,440 L140,425 L130,415 L145,415 Z" fill="gold"/>
      </g>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="32" fill="white" font-weight="bold">
        {{message}}
      </text>
    </svg>`,
  },
] as const;

// Styled components
const PreviewCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const DesignCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

interface Design {
  id: number;
  name: string;
  svg: string;
}

const MintPage = () => {
  const { address } = useAccount();
  const [message, setMessage] = useState("");
  const [festival, setFestival] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [customSvg, setCustomSvg] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "FestivalGreetings",
  });

  // Initialize IPFS client
  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization: `Basic ${Buffer.from(
        `${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET}`,
      ).toString("base64")}`,
    },
  });

  // Update preview when message or design changes
  useEffect(() => {
    if (selectedDesign) {
      const design = predefinedDesigns.find(d => d.id === selectedDesign);
      if (design) {
        setPreview(design.svg.replace("{{message}}", message));
      }
    } else if (customSvg) {
      setPreview(customSvg.replace("{{message}}", message));
    }
  }, [message, selectedDesign, customSvg]);

  const handleDesignSelect = (designId: number) => {
    setSelectedDesign(designId);
    setCustomSvg("");
    setIpfsHash("");
  };

  const handleCustomSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setCustomSvg(result);
          setSelectedDesign(null);
          setIpfsHash("");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleIpfsUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const added = await ipfs.add(file);
        setIpfsHash(added.path);
        setSelectedDesign(null);
        setCustomSvg("");
        toast.success("Image uploaded to IPFS successfully!");
      } catch (err) {
        setError("Failed to upload to IPFS");
        toast.error("Failed to upload to IPFS");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMint = async () => {
    if (!message || !festival) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      toast.error("Please connect your wallet");
      return;
    }

    try {
      let imageUri = "";
      let isIpfsLink = false;

      if (ipfsHash) {
        imageUri = `ipfs://${ipfsHash}`;
        isIpfsLink = true;
      } else if (selectedDesign) {
        const design = predefinedDesigns.find(d => d.id === selectedDesign);
        imageUri = design?.svg.replace("{{message}}", message) || "";
        isIpfsLink = false;
      } else if (customSvg) {
        imageUri = customSvg.replace("{{message}}", message);
        isIpfsLink = false;
      }

      await writeContractAsync({
        functionName: "mintGreetingCard",
        args: [address, message, festival, imageUri, isIpfsLink],
      });

      // Reset form
      setMessage("");
      setFestival("");
      setSelectedDesign(null);
      setCustomSvg("");
      setIpfsHash("");
      setError("");
      toast.success("NFT minted successfully!");
    } catch (err) {
      setError("Failed to mint NFT");
      toast.error("Failed to mint NFT");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Create Your Festival Greeting
      </Typography>

      <Grid container spacing={4}>
        {/* Left side - Form */}
        <Grid xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Your Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Festival Type"
              value={festival}
              onChange={e => setFestival(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Choose Your Design
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {predefinedDesigns.map(design => (
              <Grid xs={6} key={design.id}>
                <DesignCard
                  onClick={() => handleDesignSelect(design.id)}
                  sx={{
                    border: selectedDesign === design.id ? "2px solid #1976d2" : "none",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 140,
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {design.name}
                    </Typography>
                  </CardMedia>
                </DesignCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Or Upload Your Own Design
            </Typography>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Upload SVG
              <input type="file" hidden accept=".svg" onChange={handleCustomSvgUpload} />
            </Button>
            <Button variant="outlined" component="label" disabled={isUploading}>
              {isUploading ? <CircularProgress size={24} /> : "Upload to IPFS"}
              <input type="file" hidden accept="image/*" onChange={handleIpfsUpload} />
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button variant="contained" size="large" fullWidth onClick={handleMint} disabled={isMining || isUploading}>
            {isMining ? <CircularProgress size={24} /> : "Mint NFT"}
          </Button>
        </Grid>

        {/* Right side - Preview */}
        <Grid xs={12} md={6}>
          <PreviewCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </CardContent>
          </PreviewCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MintPage; 