import express from 'express';
const router = express.Router();

// Example static data, replace with DB query as needed
const destinations = [
  { id: 1, name: "Bali, Indonesia" },
  { id: 2, name: "Santorini, Greece" },
  { id: 3, name: "Tokyo, Japan" },
  { id: 4, name: "Dubai, UAE" }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: destinations });
});

export default router; 