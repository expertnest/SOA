import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add GLB/GLTF loader
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: require.resolve('file-loader'),
        options: {
          publicPath: '/assets/3d/', // URL path to access files
          outputPath: 'static/assets/3d/', // Where files will be written
        },
      },
    })

    // Add audio loader (ogg, mp3, wav, mpeg)
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: (config as any).exclude, // cast to any since exclude isn't always typed
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: (config as any).inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${(config as any).assetPrefix || ''}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: (config as any).esModule ?? false,
          },
        },
      ],
    })

    return config
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

export default nextConfig
