import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Grid
} from '@mui/material';

const ShowPendingAcceptedStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (userType !== 'college') {
      setError('Access denied. Only college users can view this.');
      setLoading(false);
      return;
    }

    const fetchPendingStudents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/findnotapprovedstudents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(res.data.students || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, [token, userType]);

  return (
    <Container sx={{ py: 6 }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" fontWeight="bold" color="error" gutterBottom>
          Pending Students
        </Typography>
        <Typography variant="body1" color="text.secondary">
          These students are not yet approved
        </Typography>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <CircularProgress color="error" />
        </div>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3, fontSize: '1rem' }}>{error}</Alert>
      ) : students.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 3 }}>
          No pending students found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {students.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student._id}>
              <Card
                sx={{
                  minWidth: 280,
                  borderTop: '4px solid #d32f2f',
                  borderRadius: '16px',
                  boxShadow: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
                    {student.name}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Email:</b> {student.email}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Phone:</b> {student.phone}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Blood Group:</b> {student.bloodGroup}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Address:</b> {student.address || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>Pincode:</b> {student.pincode || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <b>State:</b> {student.state || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ShowPendingAcceptedStudents;
