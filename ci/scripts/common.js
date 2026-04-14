const path = require('node:path');

const branchMaps = {
  rel: 'release',
  cur: 'current',
  dev: 'develop',
  lts: 'lts',
  cin: 'ci-test',
};

const invertedBranchMaps = Object.entries(branchMaps).reduce(
  (obj, [key, val]) => {
    obj[val] = key;
    return obj;
  },
  {},
);

module.exports.getReleaseInfo = (tagName) => {
  if (!tagName) {
    throw new Error('CI_COMMIT_TAG is required');
  }
  // todo: проверяем регуляркой
  const rawVersion = tagName.split('-')[0].trim();
  const branch = tagName.split('-')[1].trim();
  const fullBranchName = branchMaps[branch] || branch;
  const version = rawVersion.split('.').map((i) => parseInt(i));

  return { tagName, rawVersion, branch, fullBranchName, version };
};

module.exports.getTagPostfix = (branchName) => {
  return invertedBranchMaps[branchName] ?? branchName;
};

module.exports.ROOT_DIR = path.join(__dirname, '../../');
