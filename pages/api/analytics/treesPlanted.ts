export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ trees_planted: 'hello_world' });

  } else {
    res.status(400).send(`${req.method} Method not supported`);
  }
}
