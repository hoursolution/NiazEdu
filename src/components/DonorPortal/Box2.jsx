import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import donorpaid from "../../assets/donorpaid.png";
import hourglass from "../../assets/hourglass.png";
import graduation from "../../assets/graduation.png";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44B700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(0.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Box2 = () => {
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [ongoingStudents, setOngoingStudents] = useState(0);
  const [finishedStudents, setFinishedStudents] = useState(0);

  // setOngoingStudents(ongoingCount);
  //         setFinishedStudents(finishedCount);
  const [averageSponsorship, setAverageSponsorship] = useState(0);
  const navigate = useNavigate();
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const user = localStorage.getItem("donor_name");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not available.");
      return;
    }

    fetch(`${BASE_URL}/api/donorStudents/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          // Count total applications
          const count = data.reduce(
            (total, donor) => total + (donor.applications?.length || 0),
            0
          );
          setNumberOfStudents(count);

          // Calculate total donated from all projections across all applications
          const total = data.reduce((sum, donor) => {
            return (
              sum +
              (donor.applications?.reduce((appSum, application) => {
                return (
                  appSum +
                  (application.projections?.reduce((projSum, pro) => {
                    return projSum + parseFloat(pro.total_amount || 0);
                  }, 0) || 0)
                );
              }, 0) || 0)
            );
          }, 0);
          setTotalDonated(total.toFixed(2));

          // Calculate remaining amount from unpaid projections
          const totalRemaining = data.reduce((sum, donor) => {
            return (
              sum +
              (donor.applications?.reduce((appSum, application) => {
                const unpaidProjections =
                  application.projections?.filter((pro) => {
                    const challanDueDate = pro.challan_due_date
                      ? new Date(pro.challan_due_date)
                      : null;
                    const challanPaymentDate = pro.challan_payment_date
                      ? new Date(pro.challan_payment_date)
                      : null;
                    const currentDate = new Date();

                    let status = "NYD";
                    if (challanPaymentDate) {
                      status = "Paid";
                    } else if (challanDueDate && challanDueDate < currentDate) {
                      status = "Overdue";
                    } else if (
                      challanDueDate &&
                      challanDueDate >= currentDate
                    ) {
                      status = "Due";
                    }

                    return status !== "Paid";
                  }) || [];

                return (
                  appSum +
                  unpaidProjections.reduce(
                    (projSum, pro) =>
                      projSum + parseFloat(pro.total_amount || 0),
                    0
                  )
                );
              }, 0) || 0)
            );
          }, 0);

          // Count ongoing/finished students (student-level status)
          let ongoingCount = 0;
          let finishedCount = 0;
          data.forEach((donor) => {
            const applications = donor.applications || [];
            applications.forEach((app) => {
              const status = app.education_status?.trim();
              if (status === "Finished") {
                finishedCount++;
              } else {
                ongoingCount++;
              }
            });
          });

          setOngoingStudents(ongoingCount);
          setFinishedStudents(finishedCount);
          setTotalRemaining(totalRemaining.toFixed(2));
          setAverageSponsorship(count > 0 ? (total / count).toFixed(2) : 0);
        } else {
          console.error("Invalid data format or empty array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const boxStyle = {
    flex: "1 1 240px",
    minWidth: "234px",
    maxWidth: "15%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
    borderRadius: "16px",
    padding: "5px",
    textAlign: "center",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.15)",
    },
  };

  const renderBox1 = (icon, lines, onClick, customStyle = {}) => (
    <Box sx={{ ...boxStyle, ...customStyle }} onClick={onClick}>
      <Box sx={{ mb: 1 }}>{icon}</Box>
      {lines.map((item, idx) => (
        <Typography
          key={idx}
          sx={{ fontSize: "12px", color: "#000", fontWeight: 600 }}
        >
          {item.label}: <strong className="text-[14px]">{item.value}</strong>
        </Typography>
      ))}
    </Box>
  );

  const renderBox = (icon, title, value, onClick, customStyle = {}) => (
    <Box sx={{ ...boxStyle, ...customStyle }} onClick={onClick}>
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography sx={{ fontSize: "12px", color: "#000", fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography
        variant="h6"
        sx={{ fontSize: "14px", color: "#000", fontWeight: "bold", mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: isMobile ? "center" : "space-between",
        gap: 2,
        padding: "5px",
      }}
    >
      {/* Welcome Box - now styled like the others */}
      <Box
        sx={{
          ...boxStyle,
          background: "linear-gradient(135deg, #263238, #37474f)", // dark blue-grey
          alignItems: "center",
          flexDirection: "row",
          gap: 1.5,
        }}
      >
        <CelebrationIcon sx={{ fontSize: 32, color: "#80cbc4", mt: 0.5 }} />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#e0f2f1", fontSize: "14px" }}
          >
            Welcome, {user}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontStyle: "italic",
              opacity: 0.85,
              fontSize: "12px",
              color: "#b2dfdb",
            }}
          >
            Here's your impact at a glance.
          </Typography>
        </Box>
      </Box>

      {/* Metrics Boxes */}
      {renderBox1(
        <img src={graduation} style={{ height: 40 }} />,
        [
          { label: "Total Students Sponsored", value: numberOfStudents },
          { label: "Completed Students", value: finishedStudents },
          { label: "Inprogress Students", value: ongoingStudents },
        ],
        () => navigate("#"),
        {
          background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
        }
      )}

      {renderBox(
        <img src={donorpaid} style={{ height: 40 }} />,
        "Total Donated So Far (PKR)",
        `${parseFloat(totalDonated).toLocaleString()}`,
        () => navigate("#"),
        {
          background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", // light green
        }
      )}

      {renderBox(
        <img src={hourglass} style={{ height: 40 }} />,
        " Remaining Sponsorship (PKR)",
        `${parseFloat(totalRemaining).toLocaleString()}`,
        () => navigate("#"),
        {
          background: "linear-gradient(135deg, #F1B9AA, #EB6959)", // light orange
        }
      )}
    </Box>
  );
};

export default Box2;
