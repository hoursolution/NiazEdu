import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const StudentProjections = () => {
  const { id } = useParams();
  const [projections, setProjections] = useState([]);
  const BASE_URL = "https://zeenbackend-production.up.railway.app";

  useEffect(() => {
    const fetchProjections = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/students/${id}/projections/`
        );
        setProjections(response.data.projection);
      } catch (error) {
        console.error("Error fetching projections:", error);
      }
    };

    fetchProjections();
  }, [id]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <h2>Projections for Student {id}</h2>
      <DataGrid
        rows={projections.map((proj) => ({
          id: proj.id,
          semester: proj.semester_number,
          sponsor: proj.sponsor_name,
          amount: proj.total_amount,
          status: proj.status,
          dueDate: proj.challan_due_date,
        }))}
        columns={[
          { field: "semester", headerName: "Semester", flex: 1 },
          { field: "sponsor", headerName: "Sponsor", flex: 1 },
          { field: "amount", headerName: "Amount", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
          { field: "dueDate", headerName: "Due Date", flex: 1 },
        ]}
        pageSize={10}
      />
    </div>
  );
};

export default StudentProjections;
