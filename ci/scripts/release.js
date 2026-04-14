const { Git } = require('./lib/git');
const { parseVersionFromTag, versionToString } = require('./lib/version-utils');
const { getTagPostfix } = require('./common');

const command = process.argv[2];

const branchName =
  process.env.CI_COMMIT_BRANCH || process.env.CI_COMMIT_REF_NAME;

const tagPostfix = getTagPostfix(branchName);

const git = new Git();
const lastTag = git.getLastTag(tagPostfix);
if (!lastTag) {
  console.log('No tags found');
  process.exit(10);
}

const version = parseVersionFromTag(lastTag);

if (command === 'patch') {
  version.patch++;
} else if (command === 'minor') {
  version.patch = 0;
  version.minor++;
} else {
  throw new Error('Unknown command');
}

const ver = versionToString(version);

const newTag = `${ver}-${tagPostfix}`;

console.log('New version:', newTag);

git.tagCreate(`${ver}-${tagPostfix}`);

git.pushTag(newTag);
