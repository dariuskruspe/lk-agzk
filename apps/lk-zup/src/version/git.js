const { exec: execFn, exit } = require('shelljs');
const https = require('https');

const exec = (...args) => {
  console.log(`exec: ${args[0]}`);
  return execFn(...args);
};

module.exports.Git = class Git {
  tagDelete(name) {
    exec(`git tag -d ${name}`);
  }

  tagCreate(name) {
    const result = exec(`git tag ${name}`);
    if (result.code !== 0) {
      console.log(`Version ${name} already exists`);
      this.tagDelete(name);
      const retry = exec(`git tag ${name}`);
      if (retry.code !== 0) {
        exit(1);
      }
    }
  }

  push(message) {
    exec('git config --global user.email "user@mail.com"');
    exec('git config --global user.name "Update Bot"');
    exec('git add --all');
    exec(`git commit -m "${message}"`);
    exec('git remote rm ssh_origin || true');
    // git remote add origin https://<access-token-name>:<access-token>@gitlab.com/myuser/myrepo.git
    exec(
      `git remote add ssh_origin https://ci:${process.env.LKS_GITLAB_TOKEN}@git.9958258.ru/${process.env.CI_PROJECT_PATH}.git`
    );
    exec(
      `git push --push-option=ci.skip ssh_origin HEAD:${process.env.CI_COMMIT_REF_NAME}`
    );
    exec(`git push --push-option=ci.skip --tags ssh_origin`);
  }

  getCommit() {
    const result = exec(`git show --quiet --pretty='%s%n%b'`);

    if (result.code !== 0) {
      exit(1);
    }

    const [message, ...descriptionArr] = result.stdout.split('\n');
    const detail = descriptionArr.join('\n');

    let type = 'commit';
    let mergeId;

    const mergeRequestInfo = detail.match(/See merge request.+?!(\d+)/gim);
    console.log('mergeRequestInfo', mergeRequestInfo);

    if (mergeRequestInfo && mergeRequestInfo[0]) {
      const result = mergeRequestInfo[0].match(/See merge request.+?!(\d+)/i);
      if (result?.[1]) {
        type = 'merge';
        mergeId = parseInt(result[1]);
      }
    }

    return {
      type,
      message,
      detail,
      mergeId,
    };
  }

  getLastTag(branch) {
    const tags = this._getBranchTags(branch);
    tags.sort((a, b) => this._versionToNumber(b) - this._versionToNumber(a));

    return tags[0];
  }

  _versionToNumber(version) {
    const [ver, branch] = version.split('-');
    const [major, minor, patch] = ver.split('.').map((i) => parseInt(i));

    return major * 100000 + minor * 1000 + patch;
  }

  _getBranchTags(branch) {
    const result = exec(`git tag -l "*-${branch}"`, { silent: true });
    if (result.code !== 0) {
      return null;
    }
    const tags = result.stdout.split('\n').filter((i) => i.trim().length);

    return tags.length ? tags : null;
  }

  getCommitsUntilTag(tag) {
    const result = exec(`git log ${tag}..HEAD --pretty='%s%n%b'`);
    if (result.code !== 0) {
      return null;
    }

    return result
      .split('\n\n')
      .map((i) => i.trim())
      .filter((i) => i)
      .reverse();
  }

  getMergeCommits(id) {
    return new Promise((response) => {
      const options = {
        hostname: 'git.9958258.ru',
        path: `/api/v4/projects/217/merge_requests/${id}/commits`,
        method: 'GET',
        headers: {
          'PRIVATE-TOKEN': process.env.LKS_GITLAB_TOKEN,
        },
        json: true,
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const commits = JSON.parse(data).map((e) => {
            return e.message;
          });
          response(commits);
        });
      });
      req.end();
    });
  }
};
