import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ✅ added Unsplash support
      },
    ],
  },

  webpack: (config, { isServer }) => {
    // ✅ GLB/GLTF Loader
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: require.resolve("file-loader"),
        options: {
          publicPath: "/assets/3d/",
          outputPath: "static/assets/3d/",
        },
      },
    });

    // ✅ Audio loader (ogg, mp3, wav, mpeg)
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: 8192,
            fallback: require.resolve("file-loader"),
            publicPath: `${isServer ? "" : "/"}_next/static/media/`,
            outputPath: `${isServer ? "../" : ""}static/media/`,
            name: "[name]-[hash].[ext]",
            esModule: false,
          },
        },
      ],
    });

    return config;
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
