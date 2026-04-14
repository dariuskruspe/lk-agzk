'use strict';

const { echo, exit, which, cd, touch } = require('shelljs');
const path = require('path');
const fs = require('fs');
const { Git } = require('./git');

const VERSION_FILE_PATH = path.join(__dirname, 'version.json');
const RELEASE_NOTES_PATH = path.join(__dirname, 'release-notes');

const git = new Git();

if (!which('git')) {
  echo('This script requires git');
  exit(1);
}

const branchName =
  process.env.CI_COMMIT_BRANCH || process.env.CI_COMMIT_REF_NAME;

const tagPostfix = branchName.substr(0, 3);

// получаем последний тег
const currentTag = git.getLastTag(tagPostfix);

// получаем все коммиты начиная с этого тега
const commits = git.getCommitsUntilTag(currentTag);

const version = parseVersionFromTag(currentTag);
const previousVersion = { ...version };

const releaseNotes = [];
// коммиты возвращаются в порядке от старых к новым
for (const commit of commits) {
  const changeTag = getCommitChangeTag(commit);
  switch (changeTag) {
    case 'bc':
      incrementVersion(version, 'major');
      break;
    case 'feat':
      incrementVersion(version, 'minor');
      break;
    case 'fix':
      incrementVersion(version, 'patch');
      break;
  }
  if (changeTag !== 'skip') {
    releaseNotes.push(commit);
  }
}

const ver = versionToString(version);

if (ver === versionToString(previousVersion)) {
  echo('No changes');
  exit(0);
}

fs.writeFileSync(
  VERSION_FILE_PATH,
  JSON.stringify({ version: ver, type: tagPostfix })
);

git.tagDelete(currentTag);
git.tagCreate(`${ver}-${tagPostfix}`);

cd(RELEASE_NOTES_PATH);
touch(`${ver}.md`);

git.push(
  `${branchName} #lk-zup update version to ${ver}, previous ${versionToString(
    previousVersion
  )}`
);

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

function getCommitChangeTag(str) {
  const start = str.indexOf('[') + 1;
  const stop = str.indexOf(']') - 1;
  return start >= 0 && stop >= 0 ? str.substr(start, stop) : 'skip';
}
