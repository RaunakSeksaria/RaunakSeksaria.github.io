const fs = require('fs');
const path = require('path');

// Function to recursively delete a directory
function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    console.log(`Cleaning directory: ${directoryPath}`);
    
    try {
      // Try the simple approach first
      fs.rmSync(directoryPath, { recursive: true, force: true });
      console.log(`Successfully removed ${directoryPath}`);
    } catch (err) {
      console.error(`Error removing directory with fs.rmSync: ${err.message}`);
      
      // If that fails, try manual deletion
      try {
        fs.readdirSync(directoryPath).forEach((file) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            try {
              fs.unlinkSync(curPath);
            } catch (e) {
              console.error(`Failed to delete file: ${curPath}`, e.message);
            }
          }
        });
        
        try {
          fs.rmdirSync(directoryPath);
        } catch (e) {
          console.error(`Failed to remove directory: ${directoryPath}`, e.message);
        }
      } catch (e) {
        console.error(`Failed in manual directory cleanup: ${e.message}`);
      }
    }
  }
}

// Clean these directories
console.log('Starting cache cleanup...');
deleteFolderRecursive(path.join(__dirname, '.next'));
deleteFolderRecursive(path.join(__dirname, 'out'));
deleteFolderRecursive(path.join(__dirname, 'cache'));
console.log('Cache cleanup completed');
