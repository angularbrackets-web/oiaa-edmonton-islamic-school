# MCP Servers Setup for Islamic School Website

## Configured MCP Servers

### 1. GitHub MCP Server (Official)
- **Purpose**: Repository management, issue tracking, code analysis
- **Installation**: Docker-based (ghcr.io/github/github-mcp-server)
- **Authentication**: GitHub Personal Access Token required
- **Capabilities**: 
  - Repository browsing and code analysis
  - Issue and PR management
  - CI/CD workflow monitoring
  - Code security analysis

### 2. Web Search MCP Server (Free)
- **Purpose**: Islamic content research, prayer times, educational resources
- **Installation**: NPX-based (@pskill9/web-search-mcp-server)
- **Authentication**: No API key required (free)
- **Capabilities**:
  - Free web search using Google results
  - Islamic educational content research
  - Prayer time API discovery
  - Community event information

### 3. Code Checker MCP Server
- **Purpose**: Code quality analysis and bug detection
- **Installation**: NPX-based (@mcp/code-checker)
- **Authentication**: None required
- **Capabilities**:
  - Real-time code analysis for Next.js/React
  - Security vulnerability detection
  - Performance optimization suggestions
  - Best practices enforcement

### 4. File System MCP Server
- **Purpose**: Content file monitoring and validation
- **Installation**: NPX-based (@modelcontextprotocol/server-filesystem)
- **Authentication**: File system access
- **Capabilities**:
  - JSON content file monitoring
  - Structure validation for school-info.json, programs.json, news.json
  - Automatic backup and change tracking
  - File integrity checks

### 5. Web Testing MCP Server
- **Purpose**: Basic website functionality testing
- **Installation**: NPX-based (@mcp/web-testing)
- **Authentication**: None required
- **Capabilities**:
  - Form submission testing
  - Navigation verification
  - Basic functionality checks

### 6. Playwright MCP Server (Microsoft Official) ⭐ NEW!
- **Purpose**: Advanced browser automation and testing
- **Installation**: Docker-based (mcr.microsoft.com/playwright/mcp)
- **Authentication**: None required
- **Capabilities**:
  - **Multi-browser testing** (Chrome, Firefox, Safari)
  - **Accessibility testing** (WCAG compliance for educational sites)
  - **Mobile responsiveness testing** (crucial for parent engagement)
  - **Arabic text rendering verification** (Islamic content)
  - **Cross-platform compatibility**
  - **Performance auditing** with Lighthouse integration
  - **Screenshot capture** for visual regression testing
  - **Form automation** (contact forms, applications)
  - **End-to-end user journey testing**

## Setup Instructions

### For VS Code Users:
1. The `.vscode/mcp.json` file is already configured
2. Install MCP extension in VS Code
3. Configure your GitHub PAT and PostgreSQL connection when prompted

### For Claude Desktop Users:
Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_pat"
      }
    },
    "web-search": {
      "command": "npx",
      "args": ["-y", "@pskill9/web-search-mcp-server"]
    },
    "postgres": {
      "command": "npx", 
      "args": ["-y", "@devjoy/postgres-mcp-server"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "your_postgres_connection"
      }
    }
  }
}
```

## Environment Variables Needed

Create a `.env.local` file with:
```
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat_here
DATABASE_URL=postgresql://username:password@localhost:5432/islamic_school
POSTGRES_CONNECTION_STRING=postgresql://username:password@localhost:5432/islamic_school
```

## Usage in Development Workflow

### Step 1 (Think Hardest) - Enhanced by MCP:
- **Web Search MCP**: Research Islamic educational standards, prayer time APIs
- **GitHub MCP**: Analyze similar Islamic school implementations  
- **PostgreSQL MCP**: Query database patterns and optimizations

### Step 2 (Plan Exceptionally Well) - Enhanced by MCP:
- **Web Search MCP**: Find relevant libraries and Islamic content APIs
- **GitHub MCP**: Review best practices and code patterns
- **PostgreSQL MCP**: Plan database schemas and relationships

### Step 5 (Execute Implementation) - Enhanced by MCP:
- **PostgreSQL MCP**: Streamlined database operations
- **GitHub MCP**: Automated version control workflows
- **Web Search MCP**: Real-time Islamic data fetching

## Benefits for Islamic School Website

1. **Dynamic Islamic Content**: Auto-fetch prayer times, Islamic calendar events
2. **Educational Resources**: Research latest Islamic curriculum standards  
3. **Community Updates**: Find and integrate local Islamic community events
4. **Database Efficiency**: Optimized queries for student/staff data
5. **Development Automation**: Streamlined GitHub workflows and deployments

## Next Steps

1. Install Docker (for GitHub MCP server)
2. Set up GitHub Personal Access Token
3. Configure PostgreSQL database connection
4. Test MCP server functionality
5. Integrate with CMS development workflow