const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'dist');

// Define which files/folders to copy to the mobile app bundle
const itemsToCopy = [
  'index.html',
  'charity-quiz.html',
  'style.css',
  'js'
];

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

itemsToCopy.forEach(item => {
  const srcPath = path.join(srcDir, item);
  const destPath = path.join(destDir, item);
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath);
    console.log(`Copied ${item} to dist/`);
  }
});

console.log("Build complete! You can now run 'npx cap sync'");
