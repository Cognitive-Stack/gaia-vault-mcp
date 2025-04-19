"use strict";

import { z } from "zod";
import { FastMCP } from "fastmcp";

export type ToolConfig = {
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
  execute: (args: any) => Promise<string>;
};

export type Tool = FastMCP["addTool"]; 