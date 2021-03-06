import fs from 'fs';
import path from 'path';

const name = 'remote-redux-devtools-on-debugger';
const flag = `<!--  ${name} -->`;
const end = '</body>\n</html>\n';

export const dir = 'local-cli/server/util';
export const file = 'debugger.html';
export const fullPath = path.join(dir, file);

export const inject = (modulePath, bundleCode, options) => {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const opts = { ...options, autoReconnect: true };
  // Check development mode
  const bundleTag = !process.env.__DEV__ ?
    `  <script>\n    ${bundleCode}\n  </script>` :
    '  <script src="http://localhost:3030/js/bundle.js"></script>';
  const optionsTag = options ?
    `  <script>window.remotedevOptions = ${JSON.stringify(opts)};</script>` :
    '';
  const code = [
    flag,
    '  <style>',
    '    body { overflow: hidden; }',
    '  </style>',
    `  <div id="${name}"></div>`,
    optionsTag, bundleTag, end,
  ].join('\n');

  const html = fs.readFileSync(filePath, 'utf-8');
  let position = html.indexOf(flag);  // already injected ?
  if (position === -1) {
    position = html.indexOf('</body>');
  }
  fs.writeFileSync(filePath, html.substr(0, position) + code);
  return true;
};

export const revert = modulePath => {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const html = fs.readFileSync(filePath, 'utf-8');
  const position = html.indexOf(flag);
  if (position !== -1) {
    fs.writeFileSync(filePath, html.substr(0, position) + end);
  }
  return true;
};
