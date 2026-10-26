/**
 * Convert JSON Tokens to SCSS
 */
const fs = require('fs');
const path = require('path');
const varsFile = path.join(__dirname, '/vars.json');
const tokensFile = path.join(__dirname, '../src/styles/tokens.scss');

/**
 * Convert JSON to SCSS
 * @param {object} data - JSON Data
 * @returns {string} of SCSS variables
 */
function JSON2SCSS(lightData, darkData) {
  const light = JSON.parse(lightData);
  const dark = darkData ? JSON.parse(darkData) : {};
  const keys = Object.keys(light);

  // SCSS variables now resolve to the RUNTIME custom property of the same name
  // (`$--x: var(--x)`) instead of a frozen literal, so every existing
  // `$--token` consumer re-themes at runtime when `:root[data-theme]` changes —
  // with no component edits. Safe here because tokens are used as plain values,
  // never inside SCSS color functions (darken()/rgba()), which would need the
  // literal.
  const scssVars = keys.map(key => `$${key}: var(${key});`).join('\n');

  // Light is the default :root. Dark only lists the keys that differ, scoped to
  // [data-theme="dark"].
  const lightRoot = keys.map(key => `  ${key}: ${light[key]};`).join('\n');
  const darkKeys = Object.keys(dark);
  const darkRoot = darkKeys.map(key => `  ${key}: ${dark[key]};`).join('\n');

  let out = `${scssVars}\n\n:root {\n${lightRoot}\n}\n`;
  if (darkKeys.length) out += `\n:root[data-theme="dark"] {\n${darkRoot}\n}\n`;
  return out;
}

/**
 * Read a file
 * @param {string} filePath - file path to read from
 * @returns {string} of file data
 */
const readFile = async filePath => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8')
    return data;
  }
  catch(err) {
    console.log(err)
  }
}

/**
 * Write a file
 * @param {object} data - file data to write from
 */
function writeFile(data) {
  fs.writeFile(tokensFile, data, function (err) {
    if (err) throw err;
    console.log('Tokens File created successfully.');
  })
}

/**
 * Execute
 * Read the variables JSON file and convert to SCSS file to ./styles dir
 */
const darkVarsFile = path.join(__dirname, '/vars.dark.json');

Promise.all([
  readFile(varsFile),
  fs.promises.readFile(darkVarsFile, 'utf8').catch(() => null), // optional dark overrides
]).then(([light, dark]) => {
  writeFile(JSON2SCSS(light, dark));
});
