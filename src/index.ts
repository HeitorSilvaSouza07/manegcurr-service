import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Servidor Express com TypeScript está funcionando!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
