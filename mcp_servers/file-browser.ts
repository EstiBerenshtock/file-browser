import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {z} from "zod";

const server=new McpServer({
    name: "file-browser-server",
    version: "1.0.0"
});

server.tool(
    "get_supported_file_types",
    "Get the list of file extensions the filr browser supports",
    {
        format: z.enum(["list", "json"]).default("list").describe("The output format")
    },
    async ({format})=>{
        const types=[".ts", ".css", ".json", ".md", ".png"];

        const result=format==="json"?JSON.stringify(types):types.join(", ");

        return{
            content: [{type: "text",text: `Supported files: ${result}`}]
        };
    }
);

server.resource(
    "design-tokens",
    "tokens://css",
    async (uri)=>({
        contents:[{
            uri: uri.href,
            text: ":root {\n  --bg-color: #1e1e1e;\n  --text-color: #cccccc;\n  --highlight: #007bff;\n}"
        }]
    })
);

server.prompt(
  "explain_file",
  "Ask Claude to explain how a specific file type is handled",
  {
    extension: z.string().describe("The file extension to explain (e.g., .ts, .css)")
  },
  ({ extension }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please explain how our file browser currently handles and renders ${extension} files. Are there any edge cases I should watch out for?`
      }
    }]
  })
);

async function main(){
    const transport=new StdioServerTransport();
    await server.connect(transport);

    console.error("File Browser MCP Server is running...");
}

main().catch(console.error);