import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from './api.jsx';
import { Loader2, XCircle } from "lucide-react";

const RequestModal = ({ open, onClose, studentId }) => {
  const [student, setStudent] = useState(null);
  const [collegeName, setCollegeName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      if (open && studentId) {
        setLoading(true);
        try {
          const res = await axios.get(`${BASE_URL}/getStudentbyid/${studentId}`);
          setStudent(res.data.student);
          setCollegeName(res.data.collegeName);
        } catch (err) {
          console.error("Failed to fetch student:", err);
          setStudent(null);
          setCollegeName("");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudent();
  }, [open, studentId]);

  useEffect(() => {
    if (!open) {
      setStudent(null);
      setCollegeName("");
      setMessage("");
      setLoading(false);
      setSending(false);
      setFeedback("");
    }
  }, [open]);

  const handleRequest = async () => {
    if (!message.trim()) return alert("Please enter a request note.");
    setSending(true);
    const token = localStorage.getItem("token");
    const requesterType = localStorage.getItem("userType");

    try {
      await axios.post(`${BASE_URL}/bloodrequist`, {
        studentId,
        message,
        requesterType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedback("Request sent successfully!");
      setMessage("");
    } catch (err) {
      console.error("Request failed:", err);
      setFeedback("Failed to send request.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md mx-4 sm:mx-0 sm:w-[90%] rounded-2xl shadow-2xl p-6 animate-fadeIn relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition">
          <XCircle size={24} />
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-4">Blood Request</h2>

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading student info...</span>
          </div>
        ) : (
          <>
            <div className="text-sm space-y-1 text-gray-700 mb-4">
              <p><span className="font-semibold">Name:</span> {student?.name}</p>
              <p><span className="font-semibold">Email:</span> {student?.email}</p>
              <p><span className="font-semibold">Blood Group:</span> {student?.bloodGroup}</p>
              <p><span className="font-semibold">College:</span> {collegeName || "N/A"}</p>
              <p><span className="font-semibold">Phone:</span> {student?.phone}</p>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">Request Note:</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </div>

            {feedback && (
              <p className={`text-sm mb-3 ${feedback.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {feedback}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                disabled={sending}
                className={`px-4 py-2 rounded-md text-white transition ${
                  sending ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
