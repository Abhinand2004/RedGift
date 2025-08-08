// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from './api.jsx'; // your base API URL
// import { Container, Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';

// const ShowCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const res = await axios.get(`${BASE_URL}/mycertificates`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCertificates(res.data.certificates || []);
//       } catch (err) {
//         setError(
//           err.response?.data?.error || err.message || 'Failed to fetch certificates'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchCertificates();
//     } else {
//       setLoading(false);
//       setError('User is not authenticated.');
//     }
//   }, [token]);

//   const handleDownload = async (certificateUrl, collegeName) => {
//     if (!certificateUrl) {
//       alert('Certificate URL is not available.');
//       return;
//     }

//     try {
//       const url = certificateUrl.startsWith('http')
//         ? certificateUrl
//         : `${BASE_URL.replace(/\/$/, '')}/${certificateUrl.replace(/^\//, '')}`;

//       const res = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: 'blob',
//       });

//       const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.setAttribute('download', `${collegeName}_certificate.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error('Download error:', error);
//       alert('Failed to download certificate.');
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <CircularProgress color="error" />
//       </div>
//     );

//   if (error)
//     return (
//       <Container maxWidth="sm" className="mt-8">
//         <Alert severity="error" variant="outlined" className="font-semibold">
//           {error}
//         </Alert>
//       </Container>
//     );

//   if (certificates.length === 0)
//     return (
//       <Container maxWidth="sm" className="mt-8">
//         <Typography
//           variant="h6"
//           align="center"
//           className="text-gray-600 font-medium"
//         >
//           No certificates found.
//         </Typography>
//       </Container>
//     );

//   return (
//     <Container maxWidth="md" className="my-8 px-4">
//       <Typography
//         variant="h4"
//         component="h2"
//         align="center"
//         className="mb-8 font-extrabold text-red-600"
//       >
//         Your Certificates
//       </Typography>

//       <div className="flex flex-col gap-6">
//         {certificates.map((cert) => (
//           <Card
//             key={cert._id}
//             className="shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg border border-red-100"
//             sx={{ backgroundColor: '#fff' }}
//           >
//             <CardContent className="p-6">
//               <Typography
//                 variant="h6"
//                 component="p"
//                 className="text-red-700 font-semibold mb-1"
//               >
//                 Hospital Name: {cert.collegeName}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="textSecondary"
//                 className="mb-4 text-gray-600"
//               >
//                 Issued On: {new Date(cert.createdAt).toLocaleDateString()}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="error"
//                 startIcon={<DownloadIcon />}
//                 onClick={() => handleDownload(cert.certificateUrl, cert.collegeName)}
//                 sx={{ textTransform: 'none', fontWeight: 'bold' }}
//               >
//                 Download Certificate
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </Container>
//   );
// };

// export default ShowCertificates;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx'; // your base API URL

const ShowCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${BASE_URL}/mycertificates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCertificates(res.data.certificates || []);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || 'Failed to fetch certificates'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCertificates();
    } else {
      setLoading(false);
      setError('User is not authenticated.');
    }
  }, [token]);

  const handleDownload = async (certificateUrl, collegeName) => {
    if (!certificateUrl) {
      alert('Certificate URL is not available.');
      return;
    }

    try {
      const url = certificateUrl.startsWith('http')
        ? certificateUrl
        : `${BASE_URL.replace(/\/$/, '')}/${certificateUrl.replace(/^\//, '')}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${collegeName}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download certificate.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-8 p-4 border border-red-400 text-red-700 bg-red-100 rounded font-semibold text-center">
        {error}
      </div>
    );

  if (certificates.length === 0)
    return (
      <div className="max-w-md mx-auto mt-8 p-4 text-center text-gray-600 font-medium">
        No certificates found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <h2 className="text-3xl font-extrabold text-center text-red-600 mb-10">
        Your Certificates
      </h2>

      <div className="flex flex-col gap-6">
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="bg-white rounded-lg shadow-lg border border-red-100 p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <p className="text-xl font-semibold text-red-700 mb-2">
              Hospital Name: {cert.collegeName}
            </p>
            <p className="text-gray-600 mb-6">
              Issued On: {new Date(cert.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => handleDownload(cert.certificateUrl, cert.collegeName)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`Download certificate from ${cert.collegeName}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4m-4-8v8"
                />
              </svg>
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCertificates;
