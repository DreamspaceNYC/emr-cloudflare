import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/qr/:id', validateTokenMiddleware, handleStoreRecord);
app.get('/qr/:id', validateTokenMiddleware, handleRetrieveRecord);

export default app;
