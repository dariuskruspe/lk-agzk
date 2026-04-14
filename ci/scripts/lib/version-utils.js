function incrementVersion(version, type) {
  switch (type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'patch':
      version.patch++;
      break;
  }
}

function parseVersionFromTag(tag) {
  const [major, minor, patch] = tag
    .split('-')[0]
    .split('.')
    .map((i) => parseInt(i, 10));

  return { major, minor, patch };
}

function versionToString({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

module.exports = {
  incrementVersion,
  parseVersionFromTag,
  versionToString,
};
