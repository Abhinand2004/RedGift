import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { BASE_URL } from './api.jsx'; // your backend URL

const AddIcon = () => (
  <svg
    className="w-5 h-5 mr-1"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-5 h-5 mr-1"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-4-4m4 4l4-4m-4-8v8" />
  </svg>
);

const AcceptedStudentsWithCertificates = () => {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [hospitalData, setHospitalData] = useState(null);
  const [certificates, setCertificates] = useState({}); // Map studentId -> certificateUrl
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch accepted students
        const studentsRes = await axios.get(`${BASE_URL}/showmyrequest`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const accepted = (studentsRes.data.requests || []).filter(
          (req) => req.status === 'accepted'
        );
        setAcceptedStudents(accepted);

        // Fetch hospital data if userType is hospital
        if (userType === 'hospital') {
          const hospitalRes = await axios.get(`${BASE_URL}/fetchuserdata/${userType}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHospitalData(hospitalRes.data);
        }

        // Fetch certificates and create a map studentId -> certificateUrl
        const certRes = await axios.get(`${BASE_URL}/mycertificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const certMap = {};
        certRes.data.certificates.forEach((cert) => {
          certMap[cert.studentId] = cert.certificateUrl;
        });
        setCertificates(certMap);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('User is not authenticated.');
      setLoading(false);
    }
  }, [token, userType]);

  // Function to generate PDF Blob using jsPDF
  const generateCertificatePdfBlob = (student, hospital) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Blood Donation Certificate', 105, 30, null, null, 'center');

    doc.setFontSize(16);
    doc.text('This is to certify that', 105, 50, null, null, 'center');

    doc.setFontSize(20);
    doc.text(student.name, 105, 65, null, null, 'center');

    doc.setFontSize(16);
    doc.text('has successfully donated blood at', 105, 80, null, null, 'center');

    doc.setFontSize(18);
    doc.text(hospital.name || hospital.collegeName || 'Hospital Name', 105, 95, null, null, 'center');

    doc.setFontSize(14);
    doc.text(`Address: ${hospital.address || 'N/A'}`, 105, 110, null, null, 'center');

    doc.text(`Phone: ${hospital.phone || 'N/A'}`, 105, 120, null, null, 'center');

    doc.setFontSize(12);
    doc.text('Thank you for your valuable contribution!', 105, 140, null, null, 'center');

    return doc.output('blob');
  };

  // Upload the generated PDF blob to backend
  const handleCreateCertificate = async (student, requestId) => {
    if (!hospitalData) {
      alert('Hospital details not found.');
      return;
    }

    try {
      const pdfBlob = generateCertificatePdfBlob(student, hospitalData);

      const formData = new FormData();
      formData.append('studentId', student._id);
      formData.append('requestId', requestId); // <== Send request id here
      formData.append('collegeId', hospitalData._id || hospitalData.collegeId || '');
      formData.append('collegeName', hospitalData.name || hospitalData.collegeName || 'Hospital Name');
      formData.append('certificate', pdfBlob, `${student.name}_certificate.pdf`);

      const res = await axios.post(`${BASE_URL}/certificate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Certificate created successfully!');
      setCertificates((prev) => ({
        ...prev,
        [student._id]: res.data.data.certificateUrl,
      }));
    } catch (err) {
      console.error(err);
      alert('Error creating certificate');
    }
  };

  // Download certificate file
  const handleDownload = async (certificateUrl, collegeName) => {
    try {
      const url = certificateUrl.startsWith('http')
        ? certificateUrl
        : `${BASE_URL}${certificateUrl}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${collegeName || 'certificate'}.pdf`);
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

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <h2 className="text-3xl font-extrabold text-center text-red-600 mb-10">
        Accepted Students
      </h2>

      {acceptedStudents.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">No accepted students found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {acceptedStudents.map((req) =>
            Array.isArray(req.student) && req.student.length > 0 ? (
              req.student.map((stud) => (
                <div
                  key={stud._id}
                  className="flex flex-col md:flex-row justify-between items-center p-4 border border-red-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  <div className="flex-grow w-full md:w-auto">
                    <h3 className="text-red-700 font-semibold mb-1 text-lg">{stud.name}</h3>
                    <p className="mb-0.5 text-gray-700">
                      <strong>Email:</strong> {stud.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Blood Group:</strong> {stud.bloodGroup}
                    </p>
                  </div>

                  {userType === 'hospital' && (
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                      {!certificates[stud._id] ? (
                        <button
                          onClick={() => handleCreateCertificate(stud, req._id)} // pass request _id here
                          className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold transition-colors duration-200 whitespace-nowrap"
                        >
                          <AddIcon />
                          Create Certificate
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleDownload(
                              certificates[stud._id],
                              hospitalData?.name || hospitalData?.collegeName
                            )
                          }
                          className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition-colors duration-200 whitespace-nowrap"
                        >
                          <DownloadIcon />
                          Download Certificate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p key={req._id} className="text-center text-red-600 font-semibold">
                Student details not found.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedStudentsWithCertificates;
