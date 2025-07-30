import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Paper,
} from "@mui/material";

const MentorForm = ({ onSubmit }) => {
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
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h4" align="center" gutterBottom>
          CREATE MENTOR
        </Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("mentor_name", { required: true })}
                label="Name"
                fullWidth
                error={errors.mentor_name ? true : false}
                helperText={
                  errors.mentor_name ? "Name is required" : "Password = name123"
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("mentor_cnic", {
                  required: true,
                  minLength: 13,
                  maxLength: 13,
                  pattern: /^[0-9]+$/,
                })}
                label="CNIC"
                fullWidth
                error={errors.mentor_cnic ? true : false}
                helperText={
                  errors.mentor_cnic
                    ? "Invalid CNIC (Should be exactly 13 digits)"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("mentor_contact", {
                  required: true,
                  minLength: 11,
                  pattern: /^[0-9\b]+$/,
                })}
                label="Contact"
                fullWidth
                error={errors.mentor_contact ? true : false}
                helperText={
                  errors.mentor_contact
                    ? "Invalid contact number (At least 11 digits)"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("mentor_email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                label="Email"
                fullWidth
                error={errors.mentor_email ? true : false}
                helperText={
                  errors.mentor_email
                    ? "Invalid email address"
                    : "Will be considered as Mentor username"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("mentor_Expertise", { required: true })}
                label="Expertise"
                fullWidth
                error={errors.mentor_Expertise ? true : false}
                helperText={
                  errors.mentor_Expertise ? "Expertise is required" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("mentor_country", { required: true })}
                label="Country"
                fullWidth
                error={errors.mentor_country ? true : false}
                helperText={errors.mentor_country ? "Country is required" : ""}
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

export default MentorForm;
