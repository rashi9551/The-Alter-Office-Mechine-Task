import { Application } from "express";
import connectDB from "./config/mongo";
import express from "express";
import route from "./app/routes/routes";
import http from 'http'
import cors from 'cors'
import compression from 'compression'
import helmet from "helmet";
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { setUpSocketIO } from "./services/socket";

class App{
    public app:Application;
    server:http.Server<typeof http.IncomingMessage,typeof http.ServerResponse>

    constructor(){
        this.app=express()
        this.server=http.createServer(this.app)
        this.applyMiddleware()
        this.routes()
        connectDB()
        setUpSocketIO(this.server)
    }
    
    private applyMiddleware(): void {
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(
          cors()
        );
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(logger("dev"));
        this.app.use(cookieParser());
        // this.app.use(limiter)
    }

    private routes():void{
        this.app.use('/api',route)
        
    }

    public startServer(PORT:number):void{
        this.server.listen(PORT,()=>{
            console.log(`server is running  http://localhost:${PORT}`);
            
        })
    }

}
export default App

