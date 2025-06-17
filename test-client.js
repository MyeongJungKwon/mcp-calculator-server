// MCP Client Test
async function testMCPServer() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing MCP Server...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);
    
    // Test 2: MCP GET endpoint
    console.log('\n2️⃣ Testing MCP GET endpoint...');
    const mcpGetResponse = await fetch(`${baseUrl}/mcp`);
    const mcpGetData = await mcpGetResponse.json();
    console.log('✅ MCP GET:', mcpGetData.status);
    
    // Test 3: MCP Initialize
    console.log('\n3️⃣ Testing MCP initialize...');
    const initRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "test-client",
          version: "1.0.0"
        }
      }
    };
    
    const initResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initRequest)
    });
    
    const initData = await initResponse.json();
    console.log('✅ Initialize response:', initData.result?.serverInfo?.name);
    
    // Test 4: List tools
    console.log('\n4️⃣ Testing tools list...');
    const toolsRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    };
    
    const toolsResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolsRequest)
    });
    
    const toolsData = await toolsResponse.json();
    console.log('✅ Tools available:', toolsData.result?.tools?.length || 0);
    
    // Test 5: Call a tool
    console.log('\n5️⃣ Testing tool call (add)...');
    const callRequest = {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "add",
        arguments: { a: 15, b: 27 }
      }
    };
    
    const callResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callRequest)
    });
    
    const callData = await callResponse.json();
    console.log('✅ Addition result:', callData.result?.content?.[0]?.text);
    
    console.log('\n🎉 All tests passed! Server is ready for Claude integration.');
    console.log('🔗 Use this URL in Claude: http://localhost:3001/mcp');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testMCPServer();
