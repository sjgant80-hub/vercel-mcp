#!/usr/bin/env node
// vercel-mcp · stdio MCP server exposing foldkit as Claude-callable tools + resources
// canonical exemplar shape for AI-Native Solutions estate -mcp companions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { TOOLS, callTool } from './tools.js';
import { RESOURCES, readResource } from './resources.js';

const server = new Server(
  { name: 'vercel-mcp', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    const result = await callTool(req.params.name, req.params.arguments || {});
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: 'text', text: `vercel-mcp error: ${err.message}` }]
    };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: RESOURCES }));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  const body = await readResource(req.params.uri);
  return {
    contents: [{ uri: req.params.uri, mimeType: 'application/json', text: JSON.stringify(body, null, 2) }]
  };
});

await server.connect(new StdioServerTransport());
