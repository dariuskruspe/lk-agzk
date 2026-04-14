const { Git } = require('./git');

const git = new Git();

const lastTag = git.getLastTag('cur');

console.log('current', lastTag);

const commits = git.getCommitsUntilTag(lastTag);
console.log(commits);
