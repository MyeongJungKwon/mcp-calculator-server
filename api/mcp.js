// MCP Calculator Server - Vercel API Route
export default async function handler(req, res) {
  // CORS 헤더 설정 (중요!)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청 - 서버 정보 반환
  if (req.method === 'GET') {
    res.status(200).json({
      name: "Calculator MCP Server",
      version: "1.0.0",
      protocol: "mcp/0.1.0",
      status: "ready",
      message: "Use POST method to interact with MCP protocol",
      timestamp: new Date().toISOString()
    });
    return;
  }

  // POST 요청만 처리
  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['GET', 'POST', 'OPTIONS']
    });
    return;
  }
  // Calculator 도구 정의
  const tools = [
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

  // Calculator 함수들
  const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
      if (b === 0) throw new Error("Division by zero is not allowed");
      return a / b;
    }
  };

  // MCP 요청 처리
  try {
    const { method, params, id } = req.body;
    console.log(`MCP Request: ${method}`, params);

    let response;

    switch (method) {
      case 'initialize':
        response = {
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
        break;

      case 'notifications/initialized':
        response = {
          jsonrpc: "2.0",
          id,
          result: {}
        };
        break;

      case 'tools/list':
        response = {
          jsonrpc: "2.0",
          id,
          result: {
            tools
          }
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;
        try {
          let calcResult;
          switch (name) {
            case "add":
              calcResult = calculator.add(args.a, args.b);
              break;
            case "subtract":
              calcResult = calculator.subtract(args.a, args.b);
              break;
            case "multiply":
              calcResult = calculator.multiply(args.a, args.b);
              break;
            case "divide":
              calcResult = calculator.divide(args.a, args.b);
              break;
            default:
              throw new Error(`Unknown tool: ${name}`);
          }
          
          response = {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: `Result: ${calcResult}`
                }
              ]
            }
          };
        } catch (error) {          response = {
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
        break;

      default:
        response = {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        };
    }

    console.log(`MCP Response:`, response);
    res.status(200).json(response);

  } catch (error) {
    console.error('MCP Error:', error);
    res.status(200).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: error.message || "Internal error"
      }
    });
  }
}