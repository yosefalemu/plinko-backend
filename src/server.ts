import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { config } from 'dotenv';

config();

const app = express();
app.use(
  cors({
    origin: 'https://127.0.0.1:8000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(bodyParser.json());

// ---------- Config ----------
const PORT = Number(process.env.PORT || 4000);

// ---------- Functions ----------
function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// ---------- API Routes ----------
app.post('/bet', (req, res) => {
  const { rowNumber, ballCount, pinGap, pinSize, width, clientSeed, nounce } =
    req.body;
  if (
    !rowNumber ||
    !ballCount ||
    !pinGap ||
    !pinSize ||
    !width ||
    !clientSeed ||
    !nounce
  ) {
    return res.status(400).json({
      error:
        'rowNumber, ballCount, pinGap, pinSize, width, clientSeed, and nounce are required',
    });
  }

  const throwXPosition = [
    width / 2,
    width / 2 - pinGap,
    width / 2 + pinGap,
    width / 2 - pinGap / 2,
    width / 2 + pinGap / 2,
  ];
  const results = [];
  for (let i = 0; i < ballCount; i++) {
    const throwBallX =
      throwXPosition[Math.floor(Math.random() * throwXPosition.length)];
    const directions = [];
    const centerX = width / 2;
    const leftPinX = centerX - pinGap;
    const rightPinX = centerX + pinGap;
    const leftGapStart = leftPinX + pinSize;
    const leftGapEnd = centerX - pinSize;
    const rightGapStart = centerX + pinSize;
    const rightGapEnd = rightPinX - pinSize;
    const input = `${clientSeed}:${nounce}`;
    const hash = sha256(input);
    if (throwBallX >= leftGapStart && throwBallX <= leftGapEnd) {
      directions.push('null');
      for (let i = 0; i < rowNumber - 1; i++) {
        const byte = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
        directions.push(byte % 2 === 0 ? 'L' : 'R');
      }
    } else if (throwBallX >= rightGapStart && throwBallX <= rightGapEnd) {
      directions.push('null');
      for (let i = 0; i < rowNumber - 1; i++) {
        const byte = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
        directions.push(byte % 2 === 0 ? 'L' : 'R');
      }
    } else {
      for (let i = 0; i < rowNumber; i++) {
        const byte = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
        directions.push(byte % 2 === 0 ? 'L' : 'R');
      }
    }
    results.push({ directions, throwBallX, rowNumber });
  }
  return res.json(results);
});
app.listen(PORT, () => {
  console.log(`Plinko backend running on http://localhost:${PORT}`);
});
