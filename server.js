const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('public'));

app.get('/download', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Walang URL na ibinigay.');

  try {
    console.log(`🚀 Kinukuha ng mabilis na server ang laro mula sa: ${targetUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      timeout: 120000 // 2 minutong allowance para sa napakalaking laro
    });

    res.setHeader('content-disposition', response.headers['content-disposition'] || 'attachment; filename="game.apk"');
    res.setHeader('content-type', response.headers['content-type'] || 'application/vnd.android.package-archive');

    // Direktang ibinubuga ng server papunta sa phone mo
    response.data.pipe(res);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Nabigo ang server na makuha ang file.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Turbo Server ay handa na sa port ${PORT}`);
});
