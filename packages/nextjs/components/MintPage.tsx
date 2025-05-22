"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, FormControl, InputLabel, Select, MenuItem, InputAdornment, Tabs, Tab, Avatar, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { festivalDesigns } from "./templates/festivalDesigns";

const PreviewCard = styled(Card)(({ theme }) => ({
  minHeight: 420,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.spacing(2),
}));

const DesignCard = styled(Card)<{ selected: boolean; bordercolor: string }>(({ selected, bordercolor, theme }) => ({
  width: 120,
  height: 120,
  margin: theme.spacing(1),
  border: selected ? `3px solid ${bordercolor}` : `2px solid ${theme.palette.divider}`,
  boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const GreetingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "all 0.2s",
  borderRadius: theme.spacing(2),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

interface Design {
  id: number;
  name: string;
  svg: string;
  color?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MintPage = () => {
  const { address } = useAccount();
  const [message, setMessage] = useState("");
  const [festival, setFestival] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<number>(festivalDesigns[0]?.id || 1);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState("USD");
  const [tabValue, setTabValue] = useState(0);
  const [sentGreetings, setSentGreetings] = useState<any[]>([]);
  const [receivedGreetings, setReceivedGreetings] = useState<any[]>([]);

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "FestivalGreetings",
  });

  // Real-time greetings polling (every 5s)
  const { data: sentTokens } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getSentGreetings",
    args: [address],
    watch: true,
  });

  const { data: receivedTokens } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getReceivedGreetings",
    args: [address],
    watch: true,
  });

  // Read greeting details for sent tokens
  const { data: sentMessages } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingMessage",
    args: [sentTokens?.[0]],
    watch: true,
  });

  const { data: sentFestivals } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingFestival",
    args: [sentTokens?.[0]],
    watch: true,
  });

  const { data: sentImages } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingImage",
    args: [sentTokens?.[0]],
    watch: true,
  });

  // Read greeting details for received tokens
  const { data: receivedMessages } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingMessage",
    args: [receivedTokens?.[0]],
    watch: true,
  });

  const { data: receivedFestivals } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingFestival",
    args: [receivedTokens?.[0]],
    watch: true,
  });

  const { data: receivedImages } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingImage",
    args: [receivedTokens?.[0]],
    watch: true,
  });

  const { data: receivedSenders } = useScaffoldReadContract({
    contractName: "FestivalGreetings",
    functionName: "getGreetingSender",
    args: [receivedTokens?.[0]],
    watch: true,
  });

  // Update state when greeting details change
  useEffect(() => {
    if (sentTokens && sentMessages && sentFestivals && sentImages) {
      const sentDetails = sentTokens.map((tokenId, index) => ({
        tokenId,
        message: sentMessages[index],
        festival: sentFestivals[index],
        image: sentImages[index],
      }));
      setSentGreetings(sentDetails);
    }
  }, [sentTokens, sentMessages, sentFestivals, sentImages]);

  useEffect(() => {
    if (receivedTokens && receivedMessages && receivedFestivals && receivedImages && receivedSenders) {
      const receivedDetails = receivedTokens.map((tokenId, index) => ({
        tokenId,
        message: receivedMessages[index],
        festival: receivedFestivals[index],
        image: receivedImages[index],
        sender: receivedSenders[index],
      }));
      setReceivedGreetings(receivedDetails);
    }
  }, [receivedTokens, receivedMessages, receivedFestivals, receivedImages, receivedSenders]);

  // Update preview when message, design, or festival changes
  useEffect(() => {
    const design = festivalDesigns.find(d => d.id === selectedDesign);
    if (design) {
      setPreview(
        design.svg
          .replace("{{message}}", message)
          .replace("{{festival}}", festival)
          .replace("{{date}}", currentDate)
      );
    }
  }, [message, selectedDesign, festival, currentDate]);

  const handleDesignSelect = (designId: number) => {
    setSelectedDesign(designId);
  };

  const convertToWei = (amount: string, currency: string): bigint => {
    if (!amount) return BigInt(0);
    const value = parseFloat(amount);
    if (isNaN(value)) return BigInt(0);
    if (currency === "USD") {
      return BigInt(Math.floor(value / 2000 * 1e18));
    }
    return BigInt(Math.floor(value * 1e18));
  };

  const handleMint = async () => {
    if (!message || !festival || !recipient) {
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
      const design = festivalDesigns.find(d => d.id === selectedDesign);
      const imageUri = design?.svg
        .replace("{{message}}", message)
        .replace("{{festival}}", festival)
        .replace("{{date}}", currentDate) || "";
      const value = convertToWei(paymentAmount, paymentCurrency);
      await writeContractAsync({
        functionName: "mintGreetingCard",
        args: [recipient, message, festival, imageUri, false],
        value,
      });
      setMessage("");
      setFestival("");
      setRecipient("");
      setSelectedDesign(festivalDesigns[0]?.id || 1);
      setPaymentAmount("");
      setError("");
      toast.success("NFT minted successfully!");
    } catch (err) {
      setError("Failed to mint NFT");
      toast.error("Failed to mint NFT");
      console.error(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Helper: get a color for each design (fallback to blue)
  const getDesignColor = (design: Design) => {
    // Try to extract a color from the SVG or use a provided color
    if (design.color) return design.color;
    const match = design.svg.match(/#([0-9a-fA-F]{6})/);
    return match ? `#${match[1]}` : "#1976d2";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight={700}>
        Festival Greetings
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
        <Tab label="Create Greeting" />
        <Tab label="My Greetings" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          {/* Form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, boxShadow: 1, height: "100%" }}>
              <TextField
                fullWidth
                label="Recipient Address"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="off"
              />
              <TextField
                fullWidth
                label="Festival Type"
                value={festival}
                onChange={e => setFestival(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="off"
              />
              <TextField
                fullWidth
                label="Your Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                autoComplete="off"
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Payment Amount"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{paymentCurrency}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={paymentCurrency}
                      label="Currency"
                      onChange={e => setPaymentCurrency(e.target.value)}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="ETH">ETH</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button variant="contained" size="large" fullWidth onClick={handleMint} disabled={isMining} sx={{ mt: 1 }}>
                {isMining ? <CircularProgress size={24} /> : "Mint NFT"}
              </Button>
            </Box>
          </Grid>
          {/* Preview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom align="center">
                  Choose a Design
                </Typography>
                <Stack direction="row" justifyContent="center" alignItems="center" flexWrap="wrap">
                  {festivalDesigns.map(design => (
                    <DesignCard
                      key={design.id}
                      selected={selectedDesign === design.id}
                      bordercolor={getDesignColor(design)}
                      onClick={() => handleDesignSelect(design.id)}
                    >
                      <Typography variant="body2" align="center" sx={{ color: getDesignColor(design) }}>
                        {design.name}
                      </Typography>
                    </DesignCard>
                  ))}
                </Stack>
              </Box>
              <PreviewCard sx={{ flex: 1 }}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" gutterBottom align="center">
                    Preview
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                </CardContent>
              </PreviewCard>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Sent Greetings
            </Typography>
            {sentGreetings.length === 0 ? (
              <Typography color="text.secondary">No greetings sent yet.</Typography>
            ) : (
              sentGreetings.map((greeting, index) => (
                <GreetingCard key={index}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Festival: {greeting.festival}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {greeting.message}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        bgcolor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: 2,
                        mb: 2,
                      }}
                      dangerouslySetInnerHTML={{ __html: greeting.image }}
                    />
                  </CardContent>
                </GreetingCard>
              ))
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Received Greetings
            </Typography>
            {receivedGreetings.length === 0 ? (
              <Typography color="text.secondary">No greetings received yet.</Typography>
            ) : (
              receivedGreetings.map((greeting, index) => (
                <GreetingCard key={index}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Festival: {greeting.festival}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {greeting.message}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        bgcolor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: 2,
                        mb: 2,
                      }}
                      dangerouslySetInnerHTML={{ __html: greeting.image }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      From: {greeting.sender}
                    </Typography>
                  </CardContent>
                </GreetingCard>
              ))
            )}
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default MintPage;