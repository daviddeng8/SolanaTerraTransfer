/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    const wasmExtensionRegExp = /\.wasm$/;
    config.resolve.extensions.push(".wasm");

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
          oneOf.exclude.push(wasmExtensionRegExp);
        }
      });
    });

    const wasmLoader = {
      test: /\.wasm$/,
      include: /node_modules\/(bridge|token-bridge)/,
      loaders: ["wasm-loader"],
    };

    addBeforeLoader(config, loaderByName("file-loader"), wasmLoader);

    return config
  },
  webpack(config) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    config.experiments = { asyncWebAssembly: true }
    config.resolve.fallback = { fs: false, https: "https-browserify", http: "stream-http",  };
    return config
  },
}
