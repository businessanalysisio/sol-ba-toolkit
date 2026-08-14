/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // The Claude Agent SDK ships a CLI it spawns as a subprocess — bundling it
  // breaks that, so it has to stay an external require on the server.
  serverExternalPackages: ["@anthropic-ai/claude-agent-sdk"],
}

export default nextConfig
