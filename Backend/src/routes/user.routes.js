import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword,getCurrentUser,updateAccountDetails, updateUserProfilePic} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router= Router()

router.route("/register").post(
  upload.single("profilePic"),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/me").get(verifyJWT,getCurrentUser)
router.route("/update-account").put(verifyJWT,updateAccountDetails)
router.route("/update-profile-pic").put(verifyJWT,
   upload.single("profilePic"),
    updateUserProfilePic)



export default router;