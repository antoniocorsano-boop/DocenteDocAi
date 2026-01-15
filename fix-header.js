const fs = require('fs');

let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

// Fix quoted theme references by removing outer quotes
content = content.replace(/'layers\.ref\.spacing\[(\d+)\]'/g, "layers.ref.spacing[$1]");
content = content.replace(/'layers\.sys\.colors\.(\w+)'/g, 'layers.sys.colors.$1');
content = content.replace(/'layers\.ref\.shape\.corner\.(\w+)'/g, 'layers.ref.shape.corner.$1');
content = content.replace(/'layers\.motion\.duration\.(\w+)\s+layers\.motion\.easing\.(\w+)'/g, "`layers.motion.duration.$1 layers.motion.easing.$2`");
content = content.replace(/'layers\.sys\.elevation\.(\w+)'/g, 'layers.sys.elevation.$1');

fs.writeFileSync('src/components/Header.tsx', content, 'utf-8');
console.log('Fixed Header.tsx theme references');