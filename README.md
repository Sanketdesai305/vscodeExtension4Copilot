# Sanket MCP for Azure DevOps

Create Azure DevOps pipelines effortlessly using VS Code + GitHub Copilot Chat.

## 🚀 Features

- `/create_pipeline` command in GitHub Copilot Chat
- `Azure DevOps: Create Pipeline` in Command Palette
- Powered by a custom MCP JSON-RPC server
- Supports per-project Azure DevOps configuration

## ⚙️ Setup

1. Install the extension.
2. Configure `.vscode/settings.json` with your Azure DevOps details:
   ```json
   {
     "azureDevOps": {
       "command": "npx",
       "args": ["-y", "@sanketdesaiecanarys/sankets-mcp-server"],
       "env": {
         "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/your-org",
         "AZURE_DEVOPS_DEFAULT_PROJECT": "your-project",
         "AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN": "your-pat",
         "AZURE_DEVOPS_REPO_ID": "your-repo-id",
         "AZURE_DEVOPS_REPO_NAME": "your-repo"
       }
     }
   }
💬 Commands
/create_pipeline in Copilot Chat

Azure DevOps: Create Pipeline via Ctrl+Shift+P

🧪 Requirements
Azure DevOps account

Valid PAT token

GitHub Copilot Chat installed (for slash commands)

🛠 Built By
Sanket Desai
Software Engineer @ Canarys Automation
🚀 View More on GitHub : sanketdesai305