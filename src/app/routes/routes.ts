import express,{Application} from 'express'
import Controllers from '../controllers/controller'


const route:Application=express()
const controller=new Controllers

route.get('/register',controller.register)

export default route