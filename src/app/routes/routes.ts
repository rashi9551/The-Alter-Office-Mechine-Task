import express,{Application} from 'express'
import AuthControllers from '../controllers/authController'


const route:Application=express()
const authController=new AuthControllers()

route.post('/register',authController.register)
route.post('/verifyOtp',authController.verifyOtp)
route.post('/login',authController.login)

export default route