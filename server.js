const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend-backend communication
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Helper to validate if a string is Base64
function isBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
    return false;
  }
}

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  let numbers = [];
  let alphabets = [];
  let highestLowercaseAlphabet = [];

  // Separate numbers and alphabets
  data.forEach(item => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (typeof item === 'string') {
      alphabets.push(item);
      if (item === item.toLowerCase()) {
        highestLowercaseAlphabet.push(item);
      }
    }
  });

  // Find the highest lowercase alphabet
  highestLowercaseAlphabet = highestLowercaseAlphabet.length
    ? [highestLowercaseAlphabet.sort().pop()]
    : [];

  // File validation
  let fileValid = false;
  let mimeType = '';
  let fileSize = 0;

  if (file_b64 && isBase64(file_b64)) {
    fileValid = true;
    const fileBuffer = Buffer.from(file_b64, 'base64');
    fileSize = fileBuffer.length / 1024; // in KB
    mimeType = 'application/octet-stream'; // Generic MIME type
  }

  // Response structure
  const response = {
    is_success: true,
    user_id: 'john_doe_17091999',
    email: 'john@xyz.com',
    roll_number: 'ABCD123',
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: fileValid,
    file_mime_type: mimeType,
    file_size_kb: fileSize.toFixed(2),
  };

  res.status(200).json(response);
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
