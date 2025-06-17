export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const tools = [
    { name: "add", description: "Add two numbers" },
    { name: "subtract", description: "Subtract second number from first number" },
    { name: "multiply", description: "Multiply two numbers" },
    { name: "divide", description: "Divide first number by second number" }
  ];

  res.json({
    name: "Calculator MCP Server",
    version: "1.0.0",
    status: "running",
    protocol: "mcp/2024-11-05",
    endpoints: {
      health: "/api/health",
      mcp: "/api/mcp (POST)",
      root: "/"
    },
    tools,
    deployment: "Vercel",
    timestamp: new Date().toISOString()
  });
}
