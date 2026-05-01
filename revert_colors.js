const fs = require('fs');
const path = require('path');

function replaceColorsBack(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Hex colors back to orange
    content = content.replace(/#3b82f6/g, '#f97316');
    content = content.replace(/#1d4ed8/g, '#c2410c');
    content = content.replace(/#60a5fa/g, '#fb923c');
    content = content.replace(/#93c5fd/g, '#fdba74');

    // RGB colors back to orange
    content = content.replace(/59,130,246/g, '249,115,22');
    content = content.replace(/59,\s*130,\s*246/g, '249,115,22');
    
    content = content.replace(/96,165,250/g, '251,146,60');
    content = content.replace(/96,\s*165,\s*250/g, '251,146,60');
    
    content = content.replace(/147,197,253/g, '253,186,116');
    content = content.replace(/147,\s*197,\s*253/g, '253,186,116');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced colors back to orange in ${filePath}`);
}

['style.css', 'script.js'].forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        replaceColorsBack(fullPath);
    } else {
        console.log(`File not found: ${fullPath}`);
    }
});
