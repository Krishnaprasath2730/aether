
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Client {
    ws: WebSocket;
    sessionId: string;
    role: 'host' | 'guest';
}

const clients = new Map<WebSocket, Client>();

console.log('Signaling server running on port 8080');

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
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
                    // Check if session exists (basic check: simply assign them to it)
                    // In a real app, we'd check if a host exists for this ID.
                    clients.set(ws, { ws, sessionId, role: 'guest' });
                    ws.send(JSON.stringify({ type: 'SESSION_JOINED', sessionId, role: 'guest' }));

                    // Notify Host
                    broadcastToSession(sessionId, { type: 'GUEST_JOINED' }, ws);
                    console.log(`Client joined session: ${sessionId}`);
                    break;

                case 'NAVIGATE':
                case 'SCROLL':
                case 'CURSOR_MOVE':
                case 'CLICK':
                case 'INPUT':
                case 'PRIVACY_TOGGLE':
                    // Relay to others in the session
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
