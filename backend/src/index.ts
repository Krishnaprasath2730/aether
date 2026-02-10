import { WebSocketServer, WebSocket } from 'ws';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
dotenv.config();
import authRoutes from './routes/auth.routes';
import otpRoutes from './routes/otp.routes';
import oauthRoutes from './routes/oauth.routes';
import userDataRoutes from './routes/userDataRoutes';
import orderRoutes from './routes/orderRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import walletRoutes from './routes/walletRoutes';
import adminRoutes from './routes/adminRoutes';
import scratchCardRoutes from './routes/scratchCardRoutes';
import passport from './config/passport';


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes); // OTP routes under /api/auth
app.use('/api/auth', oauthRoutes); // OAuth routes under /api/auth
app.use('/api/user', userDataRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/password', passwordResetRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scratch-cards', scratchCardRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Aether Server Running', status: 'healthy' });
});

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

interface Client {
    ws: WebSocket;
    sessionId: string;
    role: 'host' | 'guest';
}

const clients = new Map<WebSocket, Client>();

// Connect to MongoDB
// Connect to MongoDB
const Start_Server = () => {
    connectDB()
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // console.log(`HTTP API: http://localhost:${PORT}`);
        // console.log(`WebSocket: ws://localhost:${PORT}`);
    });
}

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: any) => {
        try {
            const data = JSON.parse(message.toString());
            const { type, sessionId, payload } = data;

            switch (type) {
                case 'CREATE_SESSION':
                    const newSessionId = Math.random().toString(36).substring(7);
                    clients.set(ws, { ws, sessionId: newSessionId, role: 'host' });
                    ws.send(JSON.stringify({ type: 'SESSION_CREATED', sessionId: newSessionId, role: 'host' }));
                    console.log(`Session created: ${newSessionId}`);
                    break;

                case 'JOIN_SESSION':
                    clients.set(ws, { ws, sessionId, role: 'guest' });
                    ws.send(JSON.stringify({ type: 'SESSION_JOINED', sessionId, role: 'guest' }));
                    broadcastToSession(sessionId, { type: 'GUEST_JOINED' }, ws);
                    console.log(`Client joined session: ${sessionId}`);
                    break;

                case 'NAVIGATE':
                case 'SCROLL':
                case 'CURSOR_MOVE':
                case 'CLICK':
                case 'INPUT':
                case 'PRIVACY_TOGGLE':
                case 'SYNC_STATE':
                    if (sessionId) {
                        broadcastToSession(sessionId, { type, payload }, ws);
                    }
                    break;

                default:
                    break;
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        const client = clients.get(ws);
        if (client) {
            console.log(`Client disconnected from session ${client.sessionId}`);
            broadcastToSession(client.sessionId, { type: 'PEER_DISCONNECTED' }, ws);
            clients.delete(ws);
        }
    });
});

function broadcastToSession(sessionId: string, message: any, sender: WebSocket) {
    clients.forEach((client) => {
        if (client.sessionId === sessionId && client.ws !== sender && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    });
}

Start_Server();
