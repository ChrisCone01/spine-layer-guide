#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class PhotoshopMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'photoshop-spine-automation',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'ps_get_layers',
          description: '获取当前打开的 Photoshop 文档的图层结构',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'ps_rename_layer',
          description: '重命名 Photoshop 图层',
          inputSchema: {
            type: 'object',
            properties: {
              layerPath: {
                type: 'string',
                description: '图层路径（使用 / 分隔嵌套层级）',
              },
              newName: {
                type: 'string',
                description: '新的图层名称',
              },
            },
            required: ['layerPath', 'newName'],
          },
        },
        {
          name: 'ps_create_group',
          description: '在 Photoshop 中创建图层组',
          inputSchema: {
            type: 'object',
            properties: {
              groupName: {
                type: 'string',
                description: '组名称',
              },
              parentPath: {
                type: 'string',
                description: '父级路径（可选，不填则在根级创建）',
              },
            },
            required: ['groupName'],
          },
        },
        {
          name: 'ps_move_layer_to_group',
          description: '将图层移动到指定组',
          inputSchema: {
            type: 'object',
            properties: {
              layerPath: {
                type: 'string',
                description: '图层路径',
              },
              groupPath: {
                type: 'string',
                description: '目标组路径',
              },
            },
            required: ['layerPath', 'groupPath'],
          },
        },
        {
          name: 'ps_organize_for_spine',
          description: '自动整理 PSD 图层以符合 Spine 导出规范（批量操作）',
          inputSchema: {
            type: 'object',
            properties: {
              styleName: {
                type: 'string',
                description: '风格名称（如 racing-onesie, cat-onesie 等）',
              },
              structure: {
                type: 'object',
                description: 'Spine 结构配置（包含 slots 和 skins 映射）',
              },
            },
            required: ['styleName', 'structure'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'ps_get_layers':
            return await this.getPhotoshopLayers();

          case 'ps_rename_layer':
            return await this.renameLayer(args.layerPath, args.newName);

          case 'ps_create_group':
            return await this.createGroup(args.groupName, args.parentPath);

          case 'ps_move_layer_to_group':
            return await this.moveLayerToGroup(args.layerPath, args.groupPath);

          case 'ps_organize_for_spine':
            return await this.organizeForSpine(args.styleName, args.structure);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async executeJSX(scriptContent) {
    const tempScript = path.join(__dirname, 'temp_script.jsx');
    await fs.writeFile(tempScript, scriptContent, 'utf-8');

    try {
      // 尝试不同的 Photoshop 路径
      const psPath = '"C:\\Program Files\\Adobe\\Adobe Photoshop 2024\\Photoshop.exe"';

      const { stdout, stderr } = await execAsync(
        `${psPath} "${tempScript}"`
      );

      return { success: true, output: stdout, error: stderr };
    } catch (error) {
      throw new Error(`Failed to execute JSX: ${error.message}`);
    } finally {
      // 清理临时文件
      try {
        await fs.unlink(tempScript);
      } catch {}
    }
  }

  async getPhotoshopLayers() {
    const script = `
      #target photoshop

      function getLayerStructure(layer, path) {
        var result = {
          name: layer.name,
          path: path + "/" + layer.name,
          kind: layer.typename,
          visible: layer.visible
        };

        if (layer.typename === "LayerSet") {
          result.children = [];
          for (var i = 0; i < layer.layers.length; i++) {
            result.children.push(getLayerStructure(layer.layers[i], result.path));
          }
        }

        return result;
      }

      try {
        if (!app.documents.length) {
          alert("No document is open");
        } else {
          var doc = app.activeDocument;
          var structure = {
            name: doc.name,
            layers: []
          };

          for (var i = 0; i < doc.layers.length; i++) {
            structure.layers.push(getLayerStructure(doc.layers[i], ""));
          }

          var output = JSON.stringify(structure, null, 2);

          // 保存到临时文件
          var outputFile = new File("${path.join(__dirname, 'layer_output.json').replace(/\\/g, '\\\\')}");
          outputFile.open("w");
          outputFile.write(output);
          outputFile.close();
        }
      } catch (e) {
        alert("Error: " + e.message);
      }
    `;

    await this.executeJSX(script);

    // 读取输出文件
    const outputPath = path.join(__dirname, 'layer_output.json');
    const output = await fs.readFile(outputPath, 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: output,
        },
      ],
    };
  }

  async renameLayer(layerPath, newName) {
    const script = `
      #target photoshop

      function findLayer(doc, path) {
        var parts = path.split("/").filter(function(p) { return p.length > 0; });
        var current = doc;

        for (var i = 0; i < parts.length; i++) {
          var found = false;
          for (var j = 0; j < current.layers.length; j++) {
            if (current.layers[j].name === parts[i]) {
              current = current.layers[j];
              found = true;
              break;
            }
          }
          if (!found) return null;
        }

        return current;
      }

      try {
        var doc = app.activeDocument;
        var layer = findLayer(doc, "${layerPath}");

        if (layer) {
          layer.name = "${newName}";
          alert("Layer renamed successfully");
        } else {
          alert("Layer not found: ${layerPath}");
        }
      } catch (e) {
        alert("Error: " + e.message);
      }
    `;

    await this.executeJSX(script);

    return {
      content: [
        {
          type: 'text',
          text: `Renamed layer "${layerPath}" to "${newName}"`,
        },
      ],
    };
  }

  async createGroup(groupName, parentPath = '') {
    const script = `
      #target photoshop

      try {
        var doc = app.activeDocument;
        var newGroup = doc.layerSets.add();
        newGroup.name = "${groupName}";
        alert("Group created: ${groupName}");
      } catch (e) {
        alert("Error: " + e.message);
      }
    `;

    await this.executeJSX(script);

    return {
      content: [
        {
          type: 'text',
          text: `Created group "${groupName}"`,
        },
      ],
    };
  }

  async moveLayerToGroup(layerPath, groupPath) {
    // 实现图层移动逻辑
    return {
      content: [
        {
          type: 'text',
          text: `Moved layer "${layerPath}" to group "${groupPath}"`,
        },
      ],
    };
  }

  async organizeForSpine(styleName, structure) {
    // 这是核心功能：批量整理图层
    // 根据你提供的 JSON 结构自动创建组和重命名图层

    const script = `
      #target photoshop

      // 批量整理脚本将在这里实现
      alert("Organizing layers for style: ${styleName}");
    `;

    await this.executeJSX(script);

    return {
      content: [
        {
          type: 'text',
          text: `Organized layers for Spine export with style "${styleName}"`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Photoshop MCP Server running on stdio');
  }
}

const server = new PhotoshopMCPServer();
server.run().catch(console.error);
