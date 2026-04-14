const path = require('node:path');
module.exports.getReleaseInfo = (tagName) => {
  if (!tagName) {
    throw new Error('CI_COMMIT_TAG is required');
  }

  const branchMaps = {
    rel: 'release',
    cur: 'current',
    dev: 'develop',
    cin: 'ci-test',
  };

  // todo: проверяем регуляркой
  const rawVersion = tagName.split('-')[0].trim();
  const branch = tagName.split('-')[1].trim();
  const fullBranchName = branchMaps[branch] || branch;
  const version = rawVersion.split('.').map((i) => parseInt(i));

  return { tagName, rawVersion, branch, fullBranchName, version };
};

module.exports.ROOT_DIR = path.join(__dirname, '../../../');
