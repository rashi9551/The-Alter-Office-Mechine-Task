import express,{Application} from 'express'
import AuthControllers from '../controllers/authController'


const route:Application=express()
const authController=new AuthControllers()

route.get('/register',authController.register)

export default route