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
const MINIMUM_PRODUCTION_TIME = 15.0; // minimum time to produce a good is 15 seconds

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

    const {cost, upgradeCost, inputTotal, outputTotal, productionTime} = getFactoryCosts(factory, goods);
    factory.cost = cost;
    factory.upgradeCost = upgradeCost;
    factory.inputCost = inputTotal;
    factory.outputCost = outputTotal;
    factory.productionTime = productionTime;

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

// cost function translated from Avorion/data/scripts/lib/productions.lua:79-127
// cost to build the factory is profit (sale price of all outputs, minus cost of inputs) multiplied by a set multipler, plus a base cost
// time to produce function from Avorion/data/scripts/entity/merchants/factory.lua:1765-1786
// time per cycle is the total value of the produced goods, multipled by the the level of good, divided by the production capacity of the factory
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

    const outputTime = factory.outputs
        .map(i => getProductionTimeForGood(i, goods))
        .reduce(sum,0);
    const productionTime = Math.max(outputTime, MINIMUM_PRODUCTION_TIME);  // division by factory production capacity will be done at run-time

    return {cost, upgradeCost, inputTotal, outputTotal, productionTime};
}

function getProductionTimeForGood(input, goods) {
    const good = goods.find(good => good.id === input.id);
    const time = good.price * input.amount * Math.max(1, good.level);
    return time;
}

function findPriceForGood(input, goods) {
    const good = goods.find(good => good.id === input.id);
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

