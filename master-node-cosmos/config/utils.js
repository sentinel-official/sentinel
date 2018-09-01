let lodash = require('lodash');
let glob = require('glob');


let getGlobbedFiles = (globPatterns, removeRoot) => {
  let _this = this;
  let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
  let output = [];

  if (lodash.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = lodash.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else {
    if (lodash.isString(globPatterns)) {
      if (urlRegex.test(globPatterns)) {
        output.push(globPatterns);
      } else {
        let files = glob(globPatterns, {
          sync: true
        });
        if (removeRoot) {
          files = files.map((file) => {
            return file.replace(removeRoot, '');
          });
        }
        output = lodash.union(output, files);
      }
    }
  }
  return output;
};

module.exports = {
  getGlobbedFiles
};