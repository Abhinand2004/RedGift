import { Router } from "express";
import * as rh from './reqhandler.js'
import Auth from "./Authentication/Auth.js";
import upload from "./middlewares/multer.js";
const router=Router();

router.route('/addadmin').post(rh.addAdmin)
router.route('/addcollege').post(rh.addCollege)
router.route('/addhospital').post(rh.addHospital)
router.route('/adduser').post(rh.addUser)
router.route('/addstudent').post(Auth,rh.addStudent)



router.route('/login').post(rh.login)
router.route('/fetchuserdata/:type').get(Auth,rh.fetchUserData)
router.route("/edituserdata/:type").put(
  Auth,
  upload.single("certificate"), // 'certificate' is the field name used in form-data
  rh.editUserData
);

router.get('/certificate/:id', Auth, rh.downloadCertificate);

router.route("/getallstudent/:usertype").get(Auth,rh.fetchAllStudents)

router.route("/updatecollagerequest").put(Auth,rh.updateStudentApprovalStatus)



router.route('/bloodrequist').post(Auth,rh.createBloodRequest)
router.route('/getrequest').get(Auth,rh.getRequestsForStudent)
router.route('/acceptbystudent').post(Auth,rh.acceptRequstOfHospitalorUser)

router.route('/approverequestbyadmin').put(Auth,rh.setApprovalStatusByAdmin)

router.route("/getallhopitalandcollegedata").get(Auth,rh.getAllCollegesAndHospitals)



router.route("/getStudentbyid/:id").get(rh.findStudentDetailsForRequest)


router.route("/showmyrequest").get(Auth,rh.showMyRequests)


router.route("/createnotification").post(Auth,rh.createNotification)
router.route("/showallnotifications").get(rh.showAllNotifications)
router.route("/deletenotifications").delete(Auth,rh.deleteNotification)




router.route('/addambulance').post(Auth,rh.addAmbulance)
router.route('/getambulances').get(rh.getAllAmbulances)
router.route('/deleteambulance').delete(Auth,rh.deleteAmbulance)


router.route("/findnotapprovedstudents").get(Auth,rh.showpendingapprovedstudents)

export default router;