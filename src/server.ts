import { server } from './http';
import './websocket/WebSocketService';

server.listen(3000, () => console.log('Server is Running'));
