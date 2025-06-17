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
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {},
                logging: {}
              },
              serverInfo: {
                name: "calculator-server",
                version: "1.0.0"
              },
              instructions: "Use this server to perform basic arithmetic calculations."
            }
          };

        case 'notifications/initialized':
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

const mcpServer = new MCPServer();

export default function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.json({
      name: "Calculator MCP Server",
      version: "1.0.0",
      protocol: "mcp/2024-11-05",
      status: "ready",
      message: "Use POST method to interact with MCP protocol"
    });
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('MCP Request:', JSON.stringify(req.body, null, 2));
      const response = mcpServer.handleRequest(req.body);
      console.log('MCP Response:', JSON.stringify(response, null, 2));
      
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    } catch (error) {
      console.error('MCP Error:', error);
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.id || null,
        error: {
          code: -32603,
          message: error.message
        }
      });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
