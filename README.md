# My Cline's Custom MCP Server Tools

A comprehensive collection of 10 custom MCP (Model Context Protocol) servers designed to extend Cline's capabilities with various web services, development tools, and automation features.

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chipsxp/My-Cline-Custom-MCP-Server-Tools.git
   cd My-Cline-Custom-MCP-Server-Tools
   ```

2. **Follow individual server setup instructions** in each MCP server's directory

3. **Configure Cline** using the settings template provided in `examples/cline_mcp_settings.json`

## 📋 MCP Server Inventory

| Server | Description | Language | Key Features |
|--------|-------------|----------|--------------|
| **Context7-Library** | Documentation and code library access | TypeScript | Up-to-date library documentation |
| **design-copier** | Design replication and copying | TypeScript | CSS/Tailwind design extraction |
| **fetch-mcp** | Web content fetching | TypeScript | HTTP requests with various formats |
| **firecrawl-mcp-server** | Web scraping and crawling | TypeScript | Advanced web scraping capabilities |
| **GitHub-MCP** | GitHub integration | Go | Repository management, issues, PRs |
| **hub-mcp** | Hub management | TypeScript | Centralized tool management |
| **mcp-server-browserbase** | Browser automation | TypeScript | Headless browser control |
| **mcp-server-qdrant** | Vector database operations | Python | Qdrant database integration |
| **viewport-control** | Viewport management | TypeScript | Screen/viewport manipulation |
| **WebPage-Markdown** | Web page to markdown conversion | TypeScript | Clean markdown extraction |

## 🔧 Cline MCP Settings Structure

Below is the template structure for configuring these MCP servers in Cline. Replace the placeholder values with your actual configuration:

```json
{
  "mcpServers": {
    "context7-library": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/Context7-Library/build/index.js"],
      "env": {
        "CONTEXT7_API_KEY": "[YOUR_API_KEY]"
      }
    },
    "design-copier": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/design-copier/build/index.js"]
    },
    "fetch-mcp": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/fetch-mcp/build/index.js"]
    },
    "firecrawl-mcp-server": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/firecrawl-mcp-server/build/index.js"],
      "env": {
        "FIRECRAWL_API_KEY": "[YOUR_API_KEY]"
      }
    },
    "github-mcp": {
      "command": "[PATH_TO_SERVER]/GitHub-MCP/github-mcp-server",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "[YOUR_GITHUB_TOKEN]"
      }
    },
    "hub-mcp": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/hub-mcp/build/index.js"]
    },
    "browserbase-mcp": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/mcp-server-browserbase/build/index.js"],
      "env": {
        "BROWSERBASE_API_KEY": "[YOUR_API_KEY]",
        "BROWSERBASE_PROJECT_ID": "[YOUR_PROJECT_ID]"
      }
    },
    "qdrant-mcp": {
      "command": "python",
      "args": ["[PATH_TO_SERVER]/mcp-server-qdrant/src/mcp_server_qdrant/server.py"],
      "env": {
        "QDRANT_URL": "[YOUR_QDRANT_URL]",
        "QDRANT_API_KEY": "[YOUR_API_KEY]"
      }
    },
    "viewport-control": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/viewport-control/build/index.js"]
    },
    "webpage-markdown": {
      "command": "node",
      "args": ["[PATH_TO_SERVER]/WebPage-Markdown/build/index.js"]
    }
  }
}
```

## 📁 Repository Structure

```
My-Cline-Custom-MCP-Server-Tools/
├── MCP/
│   ├── Context7-Library/     # Documentation server
│   ├── design-copier/        # Design replication
│   ├── fetch-mcp/           # Web fetching
│   ├── firecrawl-mcp-server/ # Web scraping
│   ├── GitHub-MCP/          # GitHub integration
│   ├── hub-mcp/            # Hub management
│   ├── mcp-server-browserbase/ # Browser automation
│   ├── mcp-server-qdrant/   # Vector database
│   ├── viewport-control/    # Viewport management
│   └── WebPage-Markdown/    # Markdown conversion
├── examples/
│   └── cline_mcp_settings.json
├── docs/
│   ├── SETUP.md
│   └── CONTRIBUTING.md
└── README.md
```

## 🛠️ Individual Server Setup

Each MCP server has its own setup instructions. Navigate to the respective directory and follow the README.md file for detailed installation and configuration steps.

### Common Setup Steps:
1. Install dependencies (npm install, pip install, etc.)
2. Build the server if required
3. Configure environment variables
4. Update your Cline settings with the server configuration

## 🔗 Quick Links

- [Context7-Library Setup](./MCP/Context7-Library/README.md)
- [design-copier Setup](./MCP/design-copier/README.md)
- [fetch-mcp Setup](./MCP/fetch-mcp/README.md)
- [firecrawl-mcp-server Setup](./MCP/firecrawl-mcp-server/README.md)
- [GitHub-MCP Setup](./MCP/GitHub-MCP/README.md)
- [hub-mcp Setup](./MCP/hub-mcp/README.md)
- [mcp-server-browserbase Setup](./MCP/mcp-server-browserbase/README.md)
- [mcp-server-qdrant Setup](./MCP/mcp-server-qdrant/README.md)
- [viewport-control Setup](./MCP/viewport-control/README.md)
- [WebPage-Markdown Setup](./MCP/WebPage-Markdown/README.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or check the individual server documentation for specific troubleshooting steps.
