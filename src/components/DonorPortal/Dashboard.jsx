import { Box, Grid, Paper } from "@mui/material";
import React from "react";
import Box1 from "./Box1";
import Box2 from "./Box2";
import BashBoardTable from "./DashBoardTable";

const Dashboard = () => {
  return (
    <div>
      <Grid
        container
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          marginTop: 6,
        }}
      >
        {/* <Grid item>
          <Box2 />
        </Grid> */}
        <BashBoardTable />
      </Grid>
    </div>
  );
};

export default Dashboard;
