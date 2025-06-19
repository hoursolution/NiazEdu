import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
} from "@mui/material";

const DonorForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography
          sx={{ fontWeight: 700, color: "#0a2547" }}
          variant="h5"
          align="center"
          gutterBottom
        >
          CREATE DONOR
        </Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("donor_name", { required: true })}
                label="Name"
                variant="outlined"
                fullWidth
                error={errors.donor_name ? true : false}
                helperText={
                  errors.donor_name ? "Name is required" : "Password = name123"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("donor_cnic", {
                  required: true,
                  minLength: 13,
                  maxLength: 13,
                  pattern: /^[0-9]+$/,
                })}
                label="CNIC"
                variant="outlined"
                fullWidth
                error={errors.donor_cnic ? true : false}
                helperText={
                  errors.donor_cnic
                    ? "Invalid CNIC (Should be exactly 13 digits)"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                {...register("donor_contact", {
                  required: true,
                  minLength: 11,
                  pattern: /^[0-9]+$/,
                })}
                label="Contact"
                variant="outlined"
                fullWidth
                error={errors.donor_contact ? true : false}
                helperText={
                  errors.donor_contact
                    ? "Invalid contact number (At least 11 digits)"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("donor_email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                label="Email"
                variant="outlined"
                fullWidth
                error={errors.donor_email ? true : false}
                helperText={
                  errors.donor_email
                    ? "Invalid email address"
                    : "Will be considered as Donor username"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("donor_country", { required: true })}
                label="Country"
                variant="outlined"
                fullWidth
                error={errors.donor_country ? true : false}
                helperText={errors.donor_country ? "Country is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default DonorForm;
