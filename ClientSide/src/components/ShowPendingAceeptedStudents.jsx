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
  Grid,
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
    <Container className="py-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Pending Students</h2>
        <p className="text-gray-600 text-base md:text-lg">These students are not yet approved</p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress color="error" />
        </div>
      ) : error ? (
        <Alert severity="error" className="text-base mt-6">{error}</Alert>
      ) : students.length === 0 ? (
        <Typography variant="h6" className="text-center text-gray-500 mt-6">
          No pending students found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {students.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student._id}>
              <Card className="shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-red-600 rounded-2xl bg-white">
                <CardContent className="p-6">
                  <Typography variant="h6" className="text-red-600 font-semibold mb-2">
                    {student.name}
                  </Typography>
                  <div className="text-gray-800 space-y-1 text-sm">
                    <p><b>Email:</b> {student.email}</p>
                    <p><b>Phone:</b> {student.phone}</p>
                    <p><b>Blood Group:</b> {student.bloodGroup}</p>
                    <p><b>Address:</b> {student.address || 'N/A'}</p>
                    <p><b>Pincode:</b> {student.pincode || 'N/A'}</p>
                    <p><b>State:</b> {student.state || 'N/A'}</p>
                    <p><b>College ID:</b> {student.collegeId}</p>
                  </div>
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
