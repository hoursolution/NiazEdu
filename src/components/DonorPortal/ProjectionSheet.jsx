import { Search } from "@mui/icons-material";
import { Box, Input, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import ProjectionSheetTable from "./ProjectionSheetTable";

const ProjectionSheet = () => {
  const [studentIds, setStudentIds] = useState([]);
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://zeenbackend-production.up.railway.app";
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "20px",
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "black",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(1)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "200px",
      },
    },
  }));
  useEffect(() => {
    // Fetch data from the API with authorization token
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
        // Check if the data is an array with at least one element
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          // setStudentsData(data);
          // Extract and set the student IDs
          const ids = data.map((student) => student.id);
          setStudentIds(ids);
          console.log(studentIds);
        } else {
          console.error("Invalid data format or empty array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className=" h-screen">
      <div className="flex flex-row space-x-3">
        <Paper
          sx={{
            marginTop: 2,
            height: 80,
            width: 300,
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              marginTop: "0px",
              // backgroundColor: "pink",
              height: 80,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#d7e5d7",
              borderRadius: "3px",
            }}
          >
            <Search>
              {/* <SearchIconWrapper></SearchIconWrapper> */}
              <StyledInputBase
                placeholder="status"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
        </Paper>
        <Paper
          sx={{
            marginTop: 2,
            height: 80,
            width: 300,
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              marginTop: "0px",
              height: 80,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#d7e5d7",
              borderRadius: "20px",
            }}
          >
            <Search>
              {/* <SearchIconWrapper></SearchIconWrapper> */}
              <StyledInputBase
                placeholder="sponsorship commitment"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
        </Paper>
      </div>
      <ProjectionSheetTable studentIds={studentIds} />
    </div>
  );
};

export default ProjectionSheet;
