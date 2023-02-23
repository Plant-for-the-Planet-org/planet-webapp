export default function handler(req, res) {
  if (req.method === 'GET') {
    // Process a POST request - Example:
    res.status(200).json({ trees_planted: 'hello_world' });
    
  } else {
    res.status(400).send(`${req.method} Method not supported`);
  }
}
