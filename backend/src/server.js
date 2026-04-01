import express from 'express';
import path from "path";
import {serve} from 'inngest';
import {ENV} from './lib/env.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import { functions, inngest } from './lib/inngest.js';
const app = express();
const __dirname = path.resolve();

app.get('/health', (req, res) => {
    res.status(200).json({msg: "success form api 345353"});
});

// make our app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (res, req) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

//middleware
app.use(express.json());
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
app.use("/api/inngest", serve({ client: inngest, functions}))

const startServer = async() =>{
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log('Server is running on port', ENV.PORT));
    } catch (error) {
        console.error(error);
    }
}

startServer();