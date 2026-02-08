import express from 'express';
import cors from "cors";
import { rateLimiter } from './src/middlewares/rateLimitMiddleware.js';
import { proxyController, proxyControllerNotes } from './src/controllers/proxyController.js';
import { verifyToken } from './src/middlewares/verifyToken.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser()); //allow express to parse cookies from req headers
app.use(rateLimiter);        // apply to all or move to specific routes

const authRoutes = ['/login', '/signup', '/logout'];
const authTarget = 'http://auth-service:4000';

const notesRoutes = ['/notes'];
const notesTarget = 'http://notes-service:4001';

authRoutes.forEach(route => {
  app.use(route,proxyController(route, authTarget));
});

notesRoutes.forEach(route => {
  app.use(route,verifyToken, proxyControllerNotes(route, notesTarget));
}); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app;