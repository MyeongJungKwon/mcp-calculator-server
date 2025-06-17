export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  res.json({
    status: 'ok',
    message: 'Calculator MCP Server is running on Vercel',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    node_version: process.version,
    environment: process.env.NODE_ENV || 'production'
  });
}
