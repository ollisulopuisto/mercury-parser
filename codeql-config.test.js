import fs from 'fs';
import path from 'path';
import assert from 'assert';

const repoRoot = path.resolve(__dirname);
const configPath = path.join(
  repoRoot,
  '.github',
  'codeql',
  'codeql-config.yml'
);
const workflowPath = path.join(repoRoot, '.github', 'workflows', 'codeql.yml');

describe('CodeQL security configuration', () => {
  const config = fs.readFileSync(configPath, 'utf8');
  const workflow = fs.readFileSync(workflowPath, 'utf8');

  it('excludes third-party test fixtures from scanning via paths-ignore', () => {
    assert.ok(
      config.includes('paths-ignore:'),
      'codeql-config.yml must use the "paths-ignore" key'
    );
    assert.ok(
      !config.includes('path-ignoration'),
      'invalid key "path-ignoration" must not be present'
    );
    assert.ok(
      config.includes('- "fixtures/**"'),
      'paths-ignore must cover fixtures/**'
    );
    assert.ok(
      config.includes('- "src/extractors/**/fixtures/**"'),
      'paths-ignore must cover src/extractors/**/fixtures/**'
    );
  });

  it('has a CodeQL analysis workflow that applies the configuration', () => {
    assert.ok(
      workflow.includes('name:') && workflow.includes('CodeQL'),
      'workflow must be named CodeQL'
    );
    assert.ok(
      workflow.includes('branches') && workflow.includes('master'),
      'workflow must run on master'
    );
    assert.ok(
      workflow.includes('config-file: ./.github/codeql/codeql-config.yml'),
      'CodeQL init must use .github/codeql/codeql-config.yml'
    );
    assert.ok(
      workflow.includes('uses: github/codeql-action/init@'),
      'workflow must initialize CodeQL'
    );
    assert.ok(
      workflow.includes('uses: github/codeql-action/analyze@'),
      'workflow must run CodeQL analysis'
    );
  });
});
