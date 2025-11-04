/**
 * Custom CKEditor 5 build with Alignment plugin
 * Run: node build-ckeditor.js
 */

const path = require('path');
const fs = require('fs');

// This script will create a custom build
// For now, let's use a simpler approach - we'll modify the component to use
// the source version if available, or guide the user to use the online builder

console.log(`
To add Alignment (text center) option to CKEditor:

Option 1 (RECOMMENDED - Easiest):
1. Go to: https://ckeditor.com/ckeditor-5/online-builder/
2. Select "Classic Editor"
3. Add "Alignment" plugin
4. Download and extract the build
5. Copy the build folder to your project
6. Import from the custom build instead of @ckeditor/ckeditor5-build-classic

Option 2 (Advanced):
Create a custom build using webpack configuration.
`);
