const fs = require('fs');
const path = require('path');

function rmrf(dir) {
    if (!fs.existsSync(dir)) return;
    fs.rmSync(dir, { recursive: true, force: true });
}

function deleteNodeModulesRecursively(folder) {
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(folder, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules') {
                console.log('Suppression de:', fullPath);
                rmrf(fullPath);
            } else {
                deleteNodeModulesRecursively(fullPath);
            }
        }
    }
}

// ---- Suppression node_modules racine ----
rmrf('node_modules');

// ---- Suppression node_modules dans packages/* ----
const packagesDir = path.join(__dirname, '..', 'packages');
if (fs.existsSync(packagesDir)) {
    const pkgs = fs.readdirSync(packagesDir);
    pkgs.forEach(pkg => deleteNodeModulesRecursively(path.join(packagesDir, pkg)));
}

// ---- Suppression du lock file ----
rmrf('package-lock.json');