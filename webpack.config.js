const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Four outputs in dist/:
//   index.js    React components + theme API (UMD; React is the app's own).
//               Injects the core CSS: primitives, type roles, Apollo White and
//               every component's styles.
//   respawn.js  The same components as plain DOM for Respawn (no React).
//               Injects the same core CSS.
//   theme.js    The theme API alone (setTheme…), no CSS, no React.
//   nurvus.css  The core CSS as a file, for pages that link it themselves.
// tools/finish-build.mjs then copies the theme files to dist/themes/.
const DIST = path.resolve(__dirname, 'dist');
const resolve = { extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'] };
const scripts = { test: /\.(t|j)sx?$/, exclude: /node_modules/, use: 'babel-loader' };
const styles = (extract) => ({
  test: /\.s?css$/i,
  use: [
    extract ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    { loader: 'sass-loader', options: { sourceMap: true } },
  ],
});
const fonts = {
  test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
  use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' } }],
};

const umd = ({ name, entry, library, externals = [], extract = false }) => ({
  name,
  entry,
  output: { filename: `${name}.js`, library, libraryTarget: 'umd', path: DIST },
  externals,
  resolve,
  module: { rules: [scripts, styles(extract), fonts] },
  plugins: extract ? [new MiniCssExtractPlugin({ filename: 'nurvus.css' })] : [],
});

module.exports = [
  umd({ name: 'index', entry: './src/index.ts', library: 'ui', externals: ['react', 'react-dom'] }),
  umd({ name: 'respawn', entry: './src/respawn/index.ts', library: 'nurvusRespawn' }),
  umd({ name: 'theme', entry: './src/theme.ts', library: 'nurvusTheme' }),
  umd({ name: 'css-entry', entry: './src/css.ts', library: 'nurvusCss', extract: true }),
];
