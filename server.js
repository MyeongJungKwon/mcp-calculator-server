import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Calculator functions
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }
    return a / b;
  }
};

// MCP Protocol handler
class MCPServer {
  constructor() {
    this.tools = [
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" }
          },
          required: ["a", "b"]
        }
      },
      {
        name: "subtract", 
        description: "Subtract second number from first number",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" }
          },
          required: ["a", "b"]
        }
      },
      {
        name: "multiply",
        description: "Multiply two numbers", 
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" }
          },
          required: ["a", "b"]
        }
      },
      {
        name: "divide",
        description: "Divide first number by second number",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Dividend" },
            b: { type: "number", description: "Divisor" }
          },
          required: ["a", "b"]
        }
      }
    ];
  }

  handleRequest(message) {
    const { method, params, id } = message;

    try {
      switch (method) {
        case 'initialize':
          return {
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "0.1.0",
              capabilities: {
                tools: {}
              },
              serverInfo: {
                name: "calculator-server",
                version: "1.0.0"
              }
            }
          };

        case 'notifications/initialized':
          // Claude가 초기화 완료를 알릴 때
          return {
            jsonrpc: "2.0",
            id,
            result: {}
          };

        case 'ping':
          return {
            jsonrpc: "2.0", 
            id,
            result: {}
          };

        case 'tools/list':
          return {
            jsonrpc: "2.0", 
            id,
            result: {
              tools: this.tools
            }
          };

        case 'tools/call':
          return this.handleToolCall(params, id);

        default:
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`
            }
          };
      }
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: error.message
        }
      };
    }
  }

  handleToolCall(params, id) {
    const { name, arguments: args } = params;
    
    try {
      let result;
      switch (name) {
        case "add":
          result = calculator.add(args.a, args.b);
          break;
        case "subtract":
          result = calculator.subtract(args.a, args.b);
          break;
        case "multiply":
          result = calculator.multiply(args.a, args.b);
          break;
        case "divide":
          result = calculator.divide(args.a, args.b);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: `Result: ${result}`
            }
          ]
        }
      };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text", 
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        }
      };
    }
  }
}

// Create Express app
const app = express();

// Enhanced CORS configuration for MCP
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));

// Handle preflight requests
app.options('*', cors());

const mcpServer = new MCPServer();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: "Calculator MCP Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      mcp: "/mcp (POST)",
      websocket: "/ws"
    },
    tools: mcpServer.tools.map(tool => ({
      name: tool.name,
      description: tool.description
    }))
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Calculator MCP Server is running',
    version: '1.0.0',
    node_version: process.version
  });
});

// MCP HTTP endpoint
app.post('/mcp', (req, res) => {
  try {
    console.log('MCP Request received:', JSON.stringify(req.body, null, 2));
    const response = mcpServer.handleRequest(req.body);
    console.log('MCP Response sent:', JSON.stringify(response, null, 2));
    
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body.id || null,
      error: {
        code: -32603,
        message: error.message
      }
    });
  }
});

// Add GET support for MCP endpoint (some clients expect this)
app.get('/mcp', (req, res) => {
  res.json({
    name: "Calculator MCP Server",
    version: "1.0.0",
    protocol: "mcp/2024-11-05",
    status: "ready",
    message: "Use POST method to interact with MCP protocol"
  });
});

// Server setup
const PORT = process.env.PORT || 3001;
const server = createServer(app);

// WebSocket support (optional)
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const response = mcpServer.handleRequest(message);
      ws.send(JSON.stringify(response));
    } catch (error) {
      ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error"
        }
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Calculator MCP Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`Node.js version: ${process.version}`);
});
