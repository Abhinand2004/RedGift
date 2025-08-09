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
  const [userType, setUserType] = useState('');
  const [isApproved, setIsApproved] = useState(null);

  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');

  // Fetch user data and accepted students on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !storedUserType) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setUserType(storedUserType);

      try {
        // Fetch user approval status & hospital data if applicable
        const userRes = await axios.get(`${BASE_URL}/fetchuserdata/${storedUserType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsApproved(userRes.data.isApproved);
        if (storedUserType === 'hospital') {
          setHospitalData(userRes.data);
        }

        if (userRes.data.isApproved === true) {
          // Fetch accepted students
          const studentsRes = await axios.get(`${BASE_URL}/showmyrequest`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const accepted = (studentsRes.data.requests || []).filter(
            (req) => req.status === 'accepted'
          );
          setAcceptedStudents(accepted);

          // Fetch certificates
          const certRes = await axios.get(`${BASE_URL}/mycertificates`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const certMap = {};
          certRes.data.certificates.forEach((cert) => {
            certMap[cert.studentId] = cert.certificateUrl;
          });
          setCertificates(certMap);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, storedUserType]);

  // Generate PDF certificate with border and styling
  const generateCertificatePdfBlob = (student, hospital) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Draw border
    doc.setLineWidth(2);
    doc.setDrawColor(150, 0, 0);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(178, 34, 34);
    doc.text('Blood Donation Certificate', pageWidth / 2, 100, { align: 'center' });

    // Subtitle & body
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 150, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name, pageWidth / 2, 190, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully donated blood at', pageWidth / 2, 230, { align: 'center' });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const hospitalName = hospital.name || hospital.collegeName || 'Hospital Name';
    doc.text(hospitalName, pageWidth / 2, 265, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const hospitalAddress = hospital.address || 'N/A';
    const hospitalPhone = hospital.phone || 'N/A';
    doc.text(`Address: ${hospitalAddress}`, pageWidth / 2, 300, { align: 'center' });
    doc.text(`Phone: ${hospitalPhone}`, pageWidth / 2, 320, { align: 'center' });

    // Footer message
    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text('Thank you for your valuable contribution!', pageWidth / 2, pageHeight - 100, { align: 'center' });

    return doc.output('blob');
  };

  // Upload PDF to backend
  const handleCreateCertificate = async (student, requestId) => {
    if (!hospitalData) {
      alert('Hospital details not found.');
      return;
    }

    try {
      const pdfBlob = generateCertificatePdfBlob(student, hospitalData);

      const formData = new FormData();
      formData.append('studentId', student._id);
      formData.append('requestId', requestId);
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

  // Loading spinner
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

  // Error message
  if (error)
    return (
      <div className="max-w-md mx-auto mt-8 p-4 border border-red-400 text-red-700 bg-red-100 rounded font-semibold text-center">
        {error}
      </div>
    );

  // Show messages based on isApproved
  if (isApproved === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-yellow-50 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border-2 border-yellow-400">
          <p className="text-yellow-700 text-xl font-semibold mb-3">
            Your request is under review.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed">
            Please add your certificate information in your profile section for faster approval.
          </p>
        </div>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border-2 border-red-400">
          <p className="text-red-700 text-xl font-semibold mb-3">
            Your request has been rejected.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed">
            You cannot view accepted students or certificates.
          </p>
        </div>
      </div>
    );
  }

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
                          onClick={() => handleCreateCertificate(stud, req._id)}
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
