# Plinko Game Backend 🚀

**Provably Fair Plinko Game Server** - Express.js API that generates deterministic ball trajectories using cryptographic hashing.

## 🛠️ Project Setup

### Prerequisites
```bash
Node.js 18+ | npm/yarn/pnpm
```

### 1. Clone & Install
```bash
https://github.com/yosefalemu/plinko-backend
cd plinko-backend
npm install
```

### 2. Run Server
```bash
npm run dev
# or
node src/server.ts
```

**Server runs on:** `http://localhost:4000`

### 3. Test API
```bash
curl -X POST http://localhost:4000/bet \
  -H "Content-Type: application/json" \
  -d '{
    "rowNumber": 8,
    "ballCount": 3,
    "pinGap": 50,
    "pinSize": 10,
    "width": 500,
    "clientSeed": "myseed123",
    "nounce": "1"
  }'
```

## 📖 Code Explanation

### 🎯 **Single Endpoint: `/bet` (POST)**
```
Input → SHA256 Hash → Deterministic Ball Paths → JSON Response
```

**Request Body:**
```typescript
{
  rowNumber: number,    // Pin rows (8-14)
  ballCount: number,    // Balls to drop (1-100)
  pinGap: number,       // Distance between pins
  pinSize: number,      // Pin diameter
  width: number,        // Game board width
  clientSeed: string,   // Player's seed (provably fair)
  nounce: string        // Nonce for uniqueness
}
```

**Response:**
```json
[
  {
    "directions": ["null", "L", "R", "L", ...],  // Ball path
    "throwBallX": 250,                           // Drop position
    "rowNumber": 8
  }
]
```

### 🔐 **Provably Fair Logic**
```
1. Hash = SHA256(clientSeed:nounce)
2. Each 2-hex chars → Random bit (0=L, 1=R)
3. Ball follows hash-determined path
```

### 🌐 **CORS Ready**
✅ Frontend: `https://127.0.0.1:8000`

---
