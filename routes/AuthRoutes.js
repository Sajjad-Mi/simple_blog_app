const {Router} = require("express");
const authControllers = require("../controllers/authControllers");

const router = Router();

router.get("/sign-up", authControllers.signup_get);
router.post("/sign-up", authControllers.signup_post);
router.get("/log-in", authControllers.login_get);
router.post("/log-in", authControllers.login_post);
router.get("/log-out", authControllers.logout_get);


module.exports = router;