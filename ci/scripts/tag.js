const { getReleaseInfo, ROOT_DIR } = require('./lib/common');
const fs = require('node:fs');
const path = require('node:path');

const rel = getReleaseInfo(process.env.CI_COMMIT_TAG);

const command = process.argv[2];

if (command === 'version_tag') {
  putResult(rel.tagName);
}

if (command === 'version') {
  putResult(rel.rawVersion);
}

if (command === 'branch') {
  putResult(rel.branch);
}

if (command === 'docker-tag') {
  const ver = rel.rawVersion.split('.').join('-');
  putResult(
    `cr.selcloud.ru/empldocs-front/empldocs_${rel.fullBranchName}:${ver}`,
  );
}

if (command === 'docker-tag-latest') {
  putResult(
    `cr.selcloud.ru/empldocs-front/empldocs_${rel.fullBranchName}:latest`,
  );
}

if (command === 'docker-tag-node') {
  const ver = rel.rawVersion.split('.').join('-');
  putResult(
    `cr.selcloud.ru/empldocs-front/empldocs_v2_${rel.fullBranchName}:${ver}`,
  );
}

if (command === 'docker-tag-latest-node') {
  putResult(
    `cr.selcloud.ru/empldocs-front/empldocs_v2_${rel.fullBranchName}:latest`,
  );
}

const ncBaseDir = process.env.NC_DIR;

// empldocs_1-57-57.zip
if (command === 'nc_dst') {
  putResult(
    `${ncBaseDir}/${rel.fullBranchName}/empldocs_${rel.rawVersion
      .split('.')
      .join('-')}.zip`,
  );
}

if (command === 'nc_dst_latest') {
  putResult(`${ncBaseDir}/${rel.fullBranchName}/empldocs_latest.zip`);
}

if (command === 'deb_dst') {
  putResult(
    `${ncBaseDir}/${rel.fullBranchName}/empldocs-${rel.rawVersion}-astra.zip`,
  );
}

if (command === 'nc_embed_dst') {
  putResult(
    `${ncBaseDir}/${rel.fullBranchName}/empldocs-${rel.rawVersion}-embed-tools.zip`,
  );
}

if (command === 'gen_version_file') {
  fs.writeFileSync(
    path.join(ROOT_DIR, 'apps/lk-zup/src/version/version.json'),
    JSON.stringify({ version: rel.rawVersion, type: rel.branch }, null, 2),
  );
  putResult('version file generated');
}

function putResult(val) {
  process.stdout.write(val);
  process.exit(0);
}
