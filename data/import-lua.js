const fs = require('fs');

const propertyNames = ['factory', 'factoryStyle', 'ingredients', 'name', 'amount', 'optional', 'results', 'garbages'];

try {
    const fileData = fs.readFileSync('./data/productionsindex.lua', 'utf8');
    const lines = fileData.split('\n');

    console.log(`Processing ${lines.length} lines`);
    const data = lines.map(processLuaLine).filter(d => d !== null);
    const factories = data.map(transformFactory);
    console.log(`Writing to file...`);
    fs.writeFileSync('./data/factories.json', JSON.stringify(factories), 'utf8');
    console.log(`Done.`);

} catch (err) {
    console.log(err);
}

function transformFactory(data, index) {
    const factory = {id: index + 1};

    const firstGood = data.results[0].name;
    factory.name = data.factory.replace('${size}', '').replace('${good}', firstGood).trim();
    factory.type = data.factoryStyle;
    factory.inputs = data.ingredients || [];
    factory.outputs = data.results || [];
    factory.garbage = data.garbage || [];

    return factory;
}

function processLuaLine(line) {
    if (!line.includes('table.insert')) {
        return null;
    }
    line = line.replace(/=/gi, ':');
    line = line.replace(/{{/gi, '[{');
    line = line.replace(/}}/gi, '}]');
    line = line.replace('table.insert(productions, ', '');
    line = line.replace(')', '');
    line = line.substr(0, line.length - 1);
    line = line + '}';

    propertyNames.forEach(propName => {
        line = encapsulateProperty(line, propName);
    });
    try {
        return JSON.parse(line);
    } catch (err) {
        console.error("Error parsing line:\n" + line + "\n" + err);
    }
}

function encapsulateProperty(line, propertyName) {
    return line.replace(RegExp(propertyName + ':', 'gi'), `"${propertyName}":`);
}