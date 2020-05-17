const fs = require('fs');
const sum = (a, b) => a + b;

// constants
const propertyNames = ['factory', 'factoryStyle', 'ingredients', 'name', 'amount', 'optional', 'results', 'garbages', 'plural', 'description', 'icon', 'price', 'size', 'level', 'importance', 'illegal', 'dangerous', 'tags', 'chains', 'industrial', 'military', 'consumer', 'technology', 'basic'];
const FACTORY_DATAFILE = './data/productionsindex.lua';
const GOODS_DATAFILE = './data/goodsindex.lua';

const FACTORY_OUTPUT_FILE = './src/data/factories.json';
const GOODS_OUTPUT_FILE = './src/data/goods.json';

const FACTORY_BASE_COST = 3000000;
const FACTORY_COST_MULTIPLER = 4500;
const FACTORY_UPGRADE_MULTIPLER = 1000;

// *** MAIN
try {
    const goods = loadGoods();
    const factories = loadFactories(goods);

    console.log(`Writing to file...`);
    fs.writeFileSync(FACTORY_OUTPUT_FILE, JSON.stringify(factories), 'utf8');
    fs.writeFileSync(GOODS_OUTPUT_FILE, JSON.stringify(goods), 'utf8');
    console.log(`Done.`);

} catch (err) {
    console.log(err);
}

// *** support functions
function loadGoods() {
    const fileData = fs.readFileSync(GOODS_DATAFILE, 'utf8');
    const lines = fileData.split('\n');

    console.log(`Processing ${lines.length} goods`);
    const goods = lines.map(processGoodsLuaLine)
        .filter(g => g !== null);
    return goods;
}

function loadFactories(goods) {
    const fileData = fs.readFileSync(FACTORY_DATAFILE, 'utf8');
    const lines = fileData.split('\n');

    console.log(`Processing ${lines.length} factories`);
    const factories = lines.map(processFactoryLuaLine)
        .filter(d => d !== null)
        .map((f, index) => transformFactory(f, index, goods));
    return factories;
}

function transformFactory(data, index, goods) {
    const factory = {id: index + 1};

    const firstGood = data.results[0].name;
    factory.name = data.factory.replace('${size}', '').replace('${good}', firstGood).trim();
    factory.type = data.factoryStyle;
    factory.inputs = convertInputs(data.ingredients, goods);
    factory.outputs = convertInputs(data.results, goods);
    factory.garbages = convertInputs(data.garbages, goods);

    const {cost, upgradeCost, inputTotal, outputTotal} = getFactoryCosts(factory, goods);
    factory.cost = cost;
    factory.upgradeCost = upgradeCost;
    factory.inputCost = inputTotal;
    factory.outputCost = outputTotal;

    return factory;
}


function convertInputs(inputs, goods) {
    if (!inputs || !inputs.length) {
        return [];
    }

    return inputs.map(input => {
        return {
            ...input,
            id: goods.find(g => g.name === input.name).id
        }
    });
}

// function translated from Avorion/data/scripts/lib/productions.lua:79-127
function getFactoryCosts(factory, goods) {
    const inputTotal = factory.inputs
        .map(i => findPriceForGood(i, goods))
        .reduce(sum, 0);
    const outputTotal = factory.outputs
        .map(i => findPriceForGood(i, goods))
        .reduce(sum, 0);

    const profitMargin = outputTotal - inputTotal;
    const cost = FACTORY_BASE_COST + (profitMargin * FACTORY_COST_MULTIPLER);
    const upgradeCost = profitMargin * FACTORY_UPGRADE_MULTIPLER; // should also be multiplied by size later

    return {cost, upgradeCost, inputTotal, outputTotal};
}

function findPriceForGood(input, goods) {
    const good = goods.find(good => good.name === input.name);
    return good.price * input.amount;
}

function processGoodsLuaLine(line, index) {

    if (!line.includes('goods[')) {
        return null;
    }
    const objBegin = line.indexOf('{');
    line = line.substr(objBegin);
    line = cleanProperties(line);
    line = line.replace('}, }', '}}');
    line = line.replace('nil,', 'null,');

    const data = JSON.parse(line);
    data.icon = data.icon.split('\\').pop().split('/').pop();
    data.id = index;
    return data;
}

function processFactoryLuaLine(line) {
    if (!line.includes('table.insert')) {
        return null;
    }
    line = cleanProperties(line);
    line = line.replace(/{{/gi, '[{');
    line = line.replace(/}}/gi, '}]');
    line = line.replace('table.insert(productions, ', '');
    line = line.replace(')', '');
    line = line.substr(0, line.length - 1);
    line = line + '}';

    try {
        return JSON.parse(line);
    } catch (err) {
        console.error("Error parsing line:\n" + line + "\n" + err);
    }
}

function cleanProperties(line) {
    line = line.replace(/=/gi, ':');
    propertyNames.forEach(propName => {
        line = line.replace(RegExp(propName + ':', 'gi'), `"${propName}":`);
    });
    return line;
}

