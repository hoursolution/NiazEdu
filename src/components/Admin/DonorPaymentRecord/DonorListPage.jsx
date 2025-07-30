import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
import DonorList from "./DonorList";
import { Container, Typography, Box, Button, Dialog } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // For Add Donor button
import { ArrowBack } from "@mui/icons-material";
import DonorCreation from "../Profiles/DonorCreation";
import AddDonor from "./AddDonor";

// --- Glass Lavender + Midnight Mode ---
const primaryColor = "#312E81"; // Indigo-900 for nav
const secondaryColor = "#A78BFA"; // Light violet
const accentColor = "#8B5CF6"; // Purple-500 for buttons
const bgColor = "rgba(255, 255, 255, 0.5)"; // Translucent base
const cardBg = "rgba(255, 255, 255, 0.65)";
const textColor = "#1E1B4B"; // Deep indigo for text
const headerBg = "rgba(243, 232, 255, 0.25)";

export default function DonorListPage() {
  const [donors, setDonors] = useState([]);
  const [addDonorDialogOpen, setAddDonorDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDonors = () => {
    api.get(`/donor/`).then((res) => setDonors(res.data));
  };

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  return (
    <Container sx={{ marginTop: "-100px" }}>
      {/* heading and button */}
      <Box
        sx={{
          width: { xs: "100%", md: "100%", sm: "auto" },
          display: "flex",
          gap: 2,
          justifyContent: {
            xs: "center",
            md: "space-between",
            sm: "flex-start",
          },
          order: { xs: 2, sm: 1 }, // Order for responsiveness
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="contained"
          sx={{
            backgroundColor: accentColor,
            color: "white",
            marginBottom: 2,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#1C3070",
            },
          }}
        >
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Donors List
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: accentColor,
            color: "white",
            marginBottom: 2,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#1C3070",
            },
          }}
          onClick={() => setAddDonorDialogOpen(true)}
          endIcon={<AddCircleOutlineIcon />}
        >
          Add Donor
        </Button>
      </Box>

      {/* main table */}
      <DonorList
        donors={donors}
        onSelectDonor={(id) => navigate(`/Admin/donors/${id}/plan`)}
      />

      {/* donor create modal */}
      <Dialog
        open={addDonorDialogOpen}
        onClose={() => setAddDonorDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: cardBg, // Match card background
            color: textColor,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <AddDonor onClose={addDonorDialogOpen} onDonorCreated={fetchDonors} />
      </Dialog>
    </Container>
  );
}
