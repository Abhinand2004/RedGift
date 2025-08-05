import Admin from "./Models/Admin.js";
import College from "./Models/College.js"
import Hospital from "./Models/Hospital.js"
import User from "./Models/User.js"
import Student from "./Models/Student.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Requests from "./Models/BloodRequest.js"
import mongoose, { model } from "mongoose";
import Notification from './Models/Notification.js';
import Ambulance from './Models/Ambulance.js';
import path from 'path';
import fs from 'fs'

//****************REGISTER EVERY USER************************ *//
export async function addAdmin(req, res) {
  
  try {
    const { name, email, password } = req.body;
   
    

    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required." });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(409).send({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).send({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    console.error("Error in addAdmin:", err);
    res.status(500).send({ message: "Server error" });
  }
}




export async function addCollege(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).send({ message: "Required fields are missing." });
    }

    const exists = await College.findOne({ email });
    if (exists) {
      return res.status(409).send({ message: "College already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCollege = await College.create({ name, email, password: hashedPassword, phone });

    res.status(201).send({
      message: "College registered successfully. Awaiting admin approval.",
      college: newCollege
    });
  } catch (err) {
    console.error("Error in createCollege:", err);
    res.status(500).send({ message: "Server error." });
  }
}



export async function addHospital(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).send({ message: "Required fields are missing." });
    }

    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(409).send({ message: "Hospital already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newHospital = await Hospital.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address: null,
      district: null,
      state: null,
      pincode: null
    });

    return res.status(201).send({
      message: "Hospital registered successfully. Awaiting admin approval.",
      hospital: newHospital
    });

  } catch (err) {
    console.error("Error in addHospital:", err);
    res.status(500).send({ message: "Server error." });
  }
}




export async function addUser(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).send({ message: "All fields are required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).send({ message: "User already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone

    });

    res.status(201).send({
      message: "User registered successfully.",
      user: newUser
    });
  } catch (err) {
    console.error("Error in addUser:", err);
    res.status(500).send({ message: "Server error." });
  }
}



export async function addStudent(req, res) {
  try {
    const { name, email, phone, bloodGroup, address, pincode, state } = req.body;
    const collegeId=req.user.userId

    if (!name || !email || !phone || !bloodGroup || !collegeId ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).send({ message: "Student already exists" });
  

    const student = await Student.create({
      name,
      email,
      phone,
      bloodGroup,
      address,
      pincode,
      state,
      collegeId
    });

    res.status(201).send({
      message: "Student created. Awaiting student approval.",
      student
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).send({ message: "Server error" });
  }
}

//****************************REGISTER END************************** *//



//***************************LOGIN START****************************** *//

const models = { student: Student, admin: Admin, college: College, hospital: Hospital,user:User };

export async function login(req, res) {
  try {
    const { usertype, email, password } = req.body;

    if (!usertype || !email) {
      return res.status(400).send({ msg: "Usertype and email are required" });
    }

    const Model = models[usertype.toLowerCase()];
    if (!Model) {
      return res.status(400).send({ msg: "Invalid user type" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).send({ msg: "User not found" });
    }

    if (usertype.toLowerCase() !== "student") {
      if (!password) {
        return res.status(400).send({ msg: "Password is required" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ msg: "Invalid email or password" });
      }
    }

    const token = jwt.sign(   { userId: user._id, role: usertype },  process.env.JWT_KEY,  { expiresIn: "24h" });

  
    res.status(200).send({ token, usertype, userId: user._id, email: user.email});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ msg: "Server error during login" });
  }
}

//*************************LOGIN END******************************* */





//*************************FETCHING ALL USER DATA*********************** */
export async function fetchUserData(req, res) {
  
  try {
   const type = req.params.type
    const  userId  = req.user.userId;

    if (!type || !userId) {
      return res.status(401).send({ msg: "Usertype and token userId are required" });
    }

    const Model = models[type.toLowerCase()];
    if (!Model) {
      return res.status(401).send({ msg: "Invalid user type" });
    }

    const user = await Model.findById(userId).select("-password");
    if (!user) {
      return res.status(401).send({ msg: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(401).send({ msg: "Server error while fetching user data" });
  }
}

export async function editUserData(req, res) {
  try {
    const type = req.params.type?.toLowerCase();
    const userId = req.user?.userId;

    if (!type || !userId) {
      return res.status(400).json({ msg: "User type and user ID are required" });
    }

    const Model = models[type];
    if (!Model) {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    const { name, phone, state, address, pincode } = req.body;

    let updateData = {};

    if (type === "admin") {
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
    } else {
      updateData = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(state && { state }),
        ...(address && { address }),
        ...(pincode && { pincode }),
      };

      // 🔽 If user is hospital and uploaded file exists
      if (type === "hospital" && req.file) {
        const certificatePath = `/uploads/${req.file.filename}`;
        updateData.certificateUrl = certificatePath;
      }
    }

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Edit user error:", error);
    res.status(500).json({ msg: "Server error while editing user data" });
  }
}




export async function downloadCertificate(req, res) {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital || !hospital.certificateUrl) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    const filePath = path.join(process.cwd(), hospital.certificateUrl); // adjust path as needed
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: 'File does not exist on server' });
    }

    res.download(filePath); // triggers download
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ msg: 'Failed to download certificate' });
  }
}
//*************************FETCH ALL USER DATA COMPLETED************************** */



//******************************FETCH ALL STUDENTS************************* */



  export async function fetchAllStudents(req, res) {
  try {
    const usertype = req.params.usertype;
    const userId = req.user.userId; 
  

    let students;

    if (usertype === "college") {
      students = await Student.find({ collegeId: userId, isApproved: true }).populate("collegeId", "name email");
    } else if (usertype === "admin" || usertype === "hospital" || usertype === "user") {
      students = await Student.find({ isApproved: true }).populate("collegeId", "name email");
    } else {
      return res.status(400).send({ message: "Invalid user type" });
    }

    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ message: "Error fetching students", error });
  }
}
/***************************END FETCH ALL STUDENTS************************ */





//***********************STUDENT APPROOVING BLOOD DONATION*********************** */

export async function updateStudentApprovalStatus(req,res) {
  
  try {
    const studentId = req.user.userId; 
    const { status } = req.body;
    
    if (typeof status !== "boolean") {
      return res.status(400).send({ message: "Status must be true or false" });
    }

    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { isApproved: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Student not found" });
    }

    res.status(200).send({
      message: `Student approval status changed to ${status}`,
      isApproved: status,
    });

  } catch (error) {
    console.error("Error updating student approval status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};




export async function showpendingapprovedstudents(req, res) {
  try {
    const userId = req.user.userId; // from token

    // Verify college exists
    const college = await College.findById(userId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Find students with pending approval from this college
    const students = await Student.find({
      collegeId: userId,
      $or: [
        { isApproved: false },
        { isApproved: null }
      ]
    });

    res.status(200).json({
      message: 'Pending/Unapproved students fetched successfully',
      students
    });
  } catch (error) {
    console.error('Error in showpendingapprovedstudents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

//********************END BLOOD DONATION COLLAGE REQUEST STUDENT APPROVE*********************** */




/***********************BLOOD REQUIST AND ACCEPT USER HOSPITAL TO STUDENT**************************** */


export const createBloodRequest = async (req, res) => {
  try {
    const { studentId, message, requesterType } = req.body;
    const requesterId = req.user.userId;

    if (!studentId || !requesterType) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // 1. Check for existing pending request
    const existing = await Requests.findOne({
      student: studentId,
      requesterId,
      requesterType,
      status: "pending",
    });

    if (existing) {
      return res.status(409).send({ message: "You have already sent a pending request to this student." });
    }

    // 2. Find requester
    let requester;
    if (requesterType === "user") {
      requester = await User.findById(requesterId);
    } else if (requesterType === "hospital") {
      requester = await Hospital.findById(requesterId);
    } else if (requesterType === "admin") {
      requester = await Admin.findById(requesterId);
    } else {
      return res.status(400).send({ message: "Invalid requesterType" });
    }

    if (!requester) {
      return res.status(404).send({ message: "Requester not found" });
    }

    const requestedUsername = requester.username || requester.name || requester.email;

    // 3. Fetch full student details
    const studentDetails = await Student.findById(studentId);
    if (!studentDetails) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Convert Mongoose document to plain JS object
    const studentObj = studentDetails.toObject();

    // 4. Create the request with embedded student details
    const newRequest = await Requests.create({
      studentId,
      requesterId,
      requesterType,
      message,
      requestedUsername,
      student: [studentObj], // ← Store full student info as array
    });

    res.status(201).send({ message: "Blood request sent successfully", request: newRequest });

  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};



export async function getRequestsForStudent(req, res) {
  try {
    const studentId = req.user.userId;

    const requests = await Requests.find({ studentId:new mongoose.Types.ObjectId(studentId) });
    
  
    if (!requests || requests.length === 0) {
      return res.status(404).send({ message: "No requests found for this student." });
    }

    res.status(200).send({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}




export async function acceptRequstOfHospitalorUser(req, res) {
  try {
    const { id, status } = req.body;

    // Only allow "accepted" or "rejected"
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).send({ message: "Invalid status value." });
    }

    const updatedRequest = await Requests.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).send({ message: "Request not found." });
    }

    return res.send({
      message: `Request status updated to ${status}.`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
}




export async function showMyRequests(req, res) {
  try {
    
    const requesterId = req.user.userId;
    
    // Find all requests and populate student details
    const myRequests = await Requests.find({
      requesterId: new mongoose.Types.ObjectId(requesterId),
    })

    if (!myRequests || myRequests.length === 0) {
      return res.status(404).send({ message: "No requests found for you." });
    }


    return res.status(200).send({ requests: myRequests });
  } catch (error) {
    console.error("Error fetching my requests:", error);
    res.status(500).send({ message: "Internal server error." });
  }
}


/*********************** END BLOOD REQUIST AND ACCEPT USER HOSPITAL TO STUDENT**************************** */



export const setApprovalStatusByAdmin = async (req, res) => {
  try {
    const requesterId = req.user.userId; // From decoded token
    const { targetId, type, state } = req.body; // type = "college" or "hospital"
    
    

    if (!targetId || typeof state !== "boolean" || !["college", "hospital"].includes(type)) {
      return res.status(400).send({ success: false, message: "targetId, type and state are required" });
    }

    // Check if requester is an admin
    const requester = await Admin.findById(requesterId);

    
   
    // Decide which model to update
    const Model = type === "college" ? College : Hospital;
   
    // Update the approval status of the target
    const updated = await Model.updateOne(
      { _id: targetId },
      { $set: { isApproved: state } }
    );
   
    

    if (updated.modifiedCount === 0) {
      return res.status(404).send({ success: false, message: "Target not found or already in this state" });
    }

    res.status(200).send({ success: true, message: `isApproved set to ${state}` });
  } catch (err) {
    console.error("Error updating isApproved:", err);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

export const getAllCollegesAndHospitals = async (req, res) => {
  try {
    const adminId = req.user.userId;
    
    

    // Check if the user making the request is a valid admin
    const isAdmin = await Admin.findById(adminId);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only.",
      });
    }

    // Fetch all colleges and hospitals
    const colleges = await College.find();
    const hospitals = await Hospital.find();


    return res.status(200).send({
      success: true,
      colleges,
      hospitals,
    });
  } catch (error) {
    console.error("Error fetching colleges and hospitals:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};






export async function findStudentDetailsForRequest(req, res) {
  try {
    const studentId = req.params.id;
    
    
    if (!studentId) {
      return res.status(400).send({ message: "Student ID not found in request." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found." });
    }

    const collegen = await College.findById(student.collegeId);
    
    const collegeName = collegen ? collegen.name : "Unknown College";
   
    
    // Respond with student and college name
    res.status(200).send({ 
      student,
      collegeName 
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).send({ message: "Internal server error." });
  }
}





export const createNotification = async (req, res) => {
  try {
    const { announcement, startDate, lastDate } = req.body;
    const adminId = req.user.userId;
    console.log(adminId);
    
    if (!adminId || !announcement || !startDate || !lastDate) {
      return res.status(400).send({ message: 'All fields are required' });
    }

 const admin = await Admin.findOne({_id: adminId });
    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    const newNotification = await Notification.create({
      adminId,
      adminName: admin.name, // Assuming "name" field exists in your User model
      announcement,
      startDate,
      lastDate
    });

    res.status(201).send({
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};




export const showAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // latest first

    res.status(200).send({
      message: 'Notifications fetched successfully',
      notifications,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// controllers/notificationController.js



export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user.userId;
console.log(userId,notificationId);

    if (!notificationId) {
      return res.status(400).send({ message: 'Notification ID is required' });
    }

     const user = await Admin.findOne({_id: userId })
   
     
    
    if (! user) { 
      return res.status(403).send({ message: 'Access denied. Admin only.' });
    }

    const deleted = await Notification.findByIdAndDelete(notificationId);

    if (!deleted) {
      return res.status(404).send({ message: 'Notification not found' });
    }

    res.status(200).send({ message: 'Notification deleted successfully' });

  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};



// controllers/ambulanceController.js



export const addAmbulance = async (req, res) => {
  try {
    const { vehicleName, area, driverName, vehicleNumber, driverPhone } = req.body;

    if (!vehicleName || !area || !driverName || !vehicleNumber || !driverPhone) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const existing = await Ambulance.findOne({ vehicleNumber });
    if (existing) {
      return res.status(409).send({ message: 'Vehicle number already exists' });
    }

    const newAmbulance = await Ambulance.create({
      vehicleName,
      area,
      driverName,
      vehicleNumber,
      driverPhone
    });

    res.status(201).send({
      message: 'Ambulance added successfully',
      ambulance: newAmbulance
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};


export const getAllAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find().sort({ createdAt: -1 });

    res.status(200).send({
      message: 'Ambulances fetched successfully',
      ambulances
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};


export const deleteAmbulance = async (req, res) => {
  try {
    const { ambulanceId } = req.body;
    const userId = req.user.userId;

    if (!ambulanceId) {
      return res.status(400).send({ message: 'Ambulance ID is required' });
    }

   const user = await Admin.findOne({_id: userId })
    if (!user ) {
      return res.status(403).send({ message: 'Access denied. Admin only.' });
    }

    const deleted = await Ambulance.findByIdAndDelete(ambulanceId);
    if (!deleted) {
      return res.status(404).send({ message: 'Ambulance not found' });
    }

    res.status(200).send({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};
