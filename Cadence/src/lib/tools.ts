// Define available tools and their configurations
export const tools = {
  // Explicitly not including web search to prevent costs
  codeExecution: {
    enabled: true,
    name: 'python',
    description: 'Execute Python code for data analysis',
  },
  fileOperations: {
    enabled: true,
    description: 'Read and write files for data processing',
  },
} as const;

// Helper to check if a tool is enabled
export const isToolEnabled = (toolName: keyof typeof tools) => {
  return tools[toolName]?.enabled ?? false;
};

// Get available tools based on configuration
export const getAvailableTools = () => {
  return Object.entries(tools)
    .filter(([_, config]) => config.enabled)
    .reduce((acc, [name, config]) => {
      acc[name] = config;
      return acc;
    }, {} as Record<string, any>);
}; 