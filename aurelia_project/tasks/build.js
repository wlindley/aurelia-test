import gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import { build } from 'aurelia-cli';
import project from '../aurelia.json';
import fs from 'fs';
import readline from 'readline';
import os from 'os';

export default gulp.series(
  copyAdditionalResources,
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS
  ),
  writeBundles
);

function copyAdditionalResources(done){
  readGitIgnore();
  done();
}

function readGitIgnore() {
  let lineReader = readline.createInterface({
    input: fs.createReadStream('./.gitignore')
  });
  let gitignore = [];

  lineReader.on('line', (line) => {
    gitignore.push(line);
  });

  lineReader.on('close', (err) => {
    copyFiles(gitignore);
  })
}

function copyFiles(gitignore) {
  let stream,
    bundle = project.build.bundles.find(function (bundle) {
      return bundle.name === "vendor-bundle.js";
    });

  // iterate over all dependencies specified in aurelia.json
  for (let i = 0; i < bundle.dependencies.length; i++) {
    let dependency = bundle.dependencies[i];
    let collectedResources = [];
    if (dependency.path && dependency.resources) {
      // run over resources array of each dependency
      for (let n = 0; n < dependency.resources.length; n++) {
        let resource = dependency.resources[n];
        let ext = resource.substr(resource.lastIndexOf('.') + 1);
        // only copy resources that are not managed by aurelia-cli
        if (ext !== 'js' && ext != 'css' && ext != 'html' && ext !== 'less' && ext != 'scss') {
          collectedResources.push(resource);
          dependency.resources.splice(n, 1);
          n--;
        }
      }
      if (collectedResources.length) {
        if (gitignore.indexOf(dependency.name)< 0) {
          console.log('Adding line to .gitignore:', dependency.name);
          fs.appendFile('./.gitignore', os.EOL + dependency.name, (err) => { if (err) { console.log(err) } });
        }

        for (let m = 0; m < collectedResources.length; m++) {
          let currentResource = collectedResources[m];
          if (currentResource.charAt(0) != '/') {
            currentResource = '/' + currentResource;
          }
          let path = dependency.path.replace("../", "./");
          let sourceFile = path + currentResource;
          let destPath = './' + dependency.name + currentResource.slice(0, currentResource.lastIndexOf('/'));
          console.log('Copying resource', sourceFile, 'to', destPath);
          // copy files
          gulp.src(sourceFile)
            .pipe(gulp.dest(destPath));
        }
      }
    }
  }
}


function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
