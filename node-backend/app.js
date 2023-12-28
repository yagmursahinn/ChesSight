const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/predict', (req, res) => {
  const imageBase64 = req.body.image;  // Assuming the image is sent as a base64-encoded string
  const perspective = req.body.perspective;  // 'white' or 'black'

  // Command to run the Python script
  const command = 'python3 -m chesscog.recognition.recognition /dev/stdin --${perspective}';

  // Spawn a Python process
  const pythonProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error: ${error.message}');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const responseData = JSON.parse(stdout);
      res.json(responseData);
    } catch (parseError) {
      console.error('Error parsing JSON: ${parseError.message}');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Send image data to the Python process
  pythonProcess.stdin.write(Buffer.from(imageBase64, 'base64'));
  pythonProcess.stdin.end();
});

app.listen(port, () => {
  console.log('Server is running on port ${port}');
});