const fs = require('fs'); 
const path = require('path');

const readDirectory = async (rootpath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(rootpath, { withFileTypes: true }, (error, files) => {
      if (error) {
        reject(error);
      } else {
        let directories  = []; 
        files.forEach((file) => {
          const isConfig = ['scripts', 'node_modules'].includes(file.name);
          const isDir = file.isDirectory(); 
          if (!isConfig && isDir){  
            directories.push(file.name);
          } 
        });
        resolve(directories);
      }
    });
  });
};


const syncPackageJsonFiles = async () => {
  const rootSrcPath = path.resolve(__dirname, '..');
  try {
    const directories = await readDirectory(rootSrcPath);
    const fsp = fs.promises;
    const originPackage = path.resolve(__dirname, '..', 'package.json');
    await fsp.access(originPackage, fs.constants.R_OK);
    directories.forEach(async (destDirectories) => {
      const destinationDir = path.resolve(__dirname, '..', destDirectories, 'package.json');
      await fsp.access(destinationDir, fs.constants.W_OK);
      fs.copyFile(originPackage, destinationDir, fs.constants.COPYFILE_FICLONE, (error) => {
        if (error) throw error;
      }) 
    });
  } catch (error) {
    console.error("could sync the package.json to deploy on SAM", error); 
    throw error;
  }
}; 

syncPackageJsonFiles();
