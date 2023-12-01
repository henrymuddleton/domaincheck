const express = require('express');
const whois = require('whois');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/check/:domain', (req, res) => {
  const domain = req.params.domain;

  checkDomainAvailability(domain)
    .then((result) => {
      res.json({ domain, available: result });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

function checkDomainAvailability(domain) {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Check if the response contains certain strings indicating domain availability
        const available =
          data.includes('No match for domain') ||
          data.includes('NOT FOUND') ||
          data.includes('No data found') ||
          data.includes('AVAILABLE') ||
          data.includes('free');

        resolve(available);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
