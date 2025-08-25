import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import puppeteer, { Browser, Page } from "puppeteer";
import os from 'os';

class ViewportControlServer {
  private server: Server;
  private browser: Browser | null = null;
  private page: Page | null = null;
  private browserConfig: {executablePath?: string} = {};

  constructor() {
    // Detect Chrome executable path based on OS
    this.detectBrowserPath();
    
    this.server = new Server(
      {
        name: 'viewport-control',
        version: '0.2.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
    await this.server.close();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description: 'Launch browser at specified URL with custom viewport',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to navigate to',
              },
              width: {
                type: 'number',
                description: 'Viewport width in pixels',
                minimum: 320,
                maximum: 3840,
              },
              height: {
                type: 'number',
                description: 'Viewport height in pixels',
                minimum: 240,
                maximum: 2160,
              },
              deviceScaleFactor: {
                type: 'number',
                description: 'Device scale factor (pixel ratio)',
                minimum: 1,
                maximum: 3,
                default: 1
              },
              isMobile: {
                type: 'boolean',
                description: 'Whether to emulate a mobile device',
                default: false
              },
              imageFormat: {
                type: 'string',
                description: 'Screenshot image format (jpeg, png, or webp)',
                enum: ['jpeg', 'png', 'webp'],
                default: 'jpeg'
              },
              imageQuality: {
                type: 'number',
                description: 'Image quality (1-100) for jpeg and webp formats',
                minimum: 1,
                maximum: 100,
                default: 60
              },
              fullPage: {
                type: 'boolean',
                description: 'Whether to take a screenshot of the full scrollable page',
                default: false
              }
            },
            required: ['url', 'width', 'height'],
          },
        },
        {
          name: "resize_viewport",
          description: "Resize browser viewport",
          inputSchema: {
            type: "object",
            properties: {
              width: {
                type: "number",
                description: "New viewport width in pixels",
                minimum: 320,
                maximum: 3840,
              },
              height: {
                type: "number",
                description: "New viewport height in pixels",
                minimum: 240,
                maximum: 2160,
              },
              imageFormat: {
                type: 'string',
                description: 'Screenshot image format (jpeg, png, or webp)',
                enum: ['jpeg', 'png', 'webp'],
                default: 'jpeg'
              },
              imageQuality: {
                type: 'number',
                description: 'Image quality (1-100) for jpeg and webp formats',
                minimum: 1,
                maximum: 100,
                default: 60
              },
              fullPage: {
                type: 'boolean',
                description: 'Whether to take a screenshot of the full scrollable page',
                default: false
              }
            },
            required: ["width", "height"],
          },
        },
        {
          name: "close_browser",
          description: "Close the browser instance",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "launch_browser":
          return this.handleLaunchBrowser(request.params.arguments);
        case "resize_viewport":
          return this.handleResizeViewport(request.params.arguments);
        case "close_browser":
          return this.handleCloseBrowser();
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private detectBrowserPath() {
    const platform = os.platform();
    
    if (platform === 'win32') {
      const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ];
      
      for (const browserPath of possiblePaths) {
        try {
          if (require('fs').existsSync(browserPath)) {
            this.browserConfig.executablePath = browserPath;
            break;
          }
        } catch (e) {
          // Path not found, continue to next
        }
      }
    } else if (platform === 'darwin') {
      this.browserConfig.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    // For Linux, let Puppeteer find Chrome automatically
  }

  private async handleLaunchBrowser(args: any) {
    try {
      if (this.browser) {
        await this.browser.close();
      }

      this.browser = await puppeteer.launch({
        ...this.browserConfig,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true, // Use headless mode
      });
      
      this.page = await this.browser.newPage();

      // Validate viewport dimensions
      if (!args.width || !args.height || isNaN(Number(args.width)) || isNaN(Number(args.height))) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          "Invalid viewport dimensions. Width and height must be valid numbers."
        );
      }

      await this.page.setViewport({
        width: Number(args.width),
        height: Number(args.height),
        deviceScaleFactor: args.deviceScaleFactor || 1,
        isMobile: args.isMobile || false,
      });

      await this.page.goto(args.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Extract page content and convert to markdown
      const pageContent = await this.page.evaluate(() => {
        // Get page title
        const title = document.title;
        
        // Get main content text
        const bodyText = document.body.innerText.substring(0, 15000); // Limit text length
        
        // Get all links
        const links = Array.from(document.querySelectorAll('a'))
          .filter(link => link.href && link.href.startsWith('http'))
          .map(link => `- [${link.textContent?.trim() || link.href}](${link.href})`)
          .slice(0, 20) // Limit number of links
          .join('\n');
        
        // Format as markdown
        return `# ${title}\n\n## Page Content\n\n${bodyText}\n\n## Links\n\n${links}`;
      });

      // Determine screenshot format (default to jpeg if not specified)
      const format = args.imageFormat || 'jpeg';
      let screenshotOptions: any = {
        encoding: "base64",
        fullPage: args.fullPage || false
      };
      
      // Set format-specific options
      if (format === 'jpeg') {
        screenshotOptions.type = 'jpeg';
        screenshotOptions.quality = args.imageQuality || 60;
      } else if (format === 'png') {
        screenshotOptions.type = 'png';
      } else if (format === 'webp') {
        screenshotOptions.type = 'webp';
        screenshotOptions.quality = args.imageQuality || 80;
      }

      const screenshot = await this.page.screenshot(screenshotOptions);

      return {
        content: [
          {
            type: "text",
            text: `Browser launched with viewport ${args.width}x${args.height}`,
          },
          {
            type: "text",
            text: pageContent,
          },
          {
            type: "text",
            text: `data:image/${format};base64,${screenshot}`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to launch browser: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async handleResizeViewport(args: any) {
    if (!this.page) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Browser not launched. Call launch_browser first."
      );
    }

    await this.page.setViewport({
      width: args.width,
      height: args.height,
    });

    // Extract page content and convert to markdown
    const pageContent = await this.page.evaluate(() => {
      // Get page title
      const title = document.title;
      
      // Get main content text
      const bodyText = document.body.innerText.substring(0, 15000); // Limit text length
      
      // Get all links
      const links = Array.from(document.querySelectorAll('a'))
        .filter(link => link.href && link.href.startsWith('http'))
        .map(link => `- [${link.textContent?.trim() || link.href}](${link.href})`)
        .slice(0, 20) // Limit number of links
        .join('\n');
      
      // Format as markdown
      return `# ${title}\n\n## Page Content\n\n${bodyText}\n\n## Links\n\n${links}`;
    });

    // Determine screenshot format (default to jpeg if not specified)
    const format = args.imageFormat || 'jpeg';
    let screenshotOptions: any = {
      encoding: "base64",
      fullPage: args.fullPage || false
    };
    
    // Set format-specific options
    if (format === 'jpeg') {
      screenshotOptions.type = 'jpeg';
      screenshotOptions.quality = args.imageQuality || 30;
    } else if (format === 'png') {
      screenshotOptions.type = 'png';
    } else if (format === 'webp') {
      screenshotOptions.type = 'webp';
      screenshotOptions.quality = args.imageQuality || 50;
    }

    const screenshot = await this.page.screenshot(screenshotOptions);

    return {
      content: [
        {
          type: "text",
          text: `Viewport resized to ${args.width}x${args.height}`,
        },
        {
          type: "text",
          text: pageContent,
        },
        {
          type: "text",
          text: `data:image/${format};base64,${screenshot}`,
        },
      ],
    };
  }

  private async handleCloseBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
    return {
      content: [
        {
          type: "text",
          text: "Browser closed",
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Viewport Control MCP server running on stdio");
  }
}

const server = new ViewportControlServer();
server.run().catch(console.error);











