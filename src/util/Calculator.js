import {BASE_FACTORY_PRODUCTION, MINIMUM_FACTORY_PRODUCTION_TIME} from "../constants/factory";

const onlyUnique = (value, index, self) => self.indexOf(value) === index;
export const sumTotal = (a, b) => a + b;


function getAllChildren(parents) {
    return [
        ...parents,
        ...parents.flatMap(f => getAllChildren(f.children))
    ]
}

export function findTotalTechTreeBuildCost(techTree) {
    const allFactories = [techTree, ...getAllChildren(techTree.children)];
    const uniqueFactories = allFactories.filter(onlyUnique);
    return uniqueFactories.map(f => f.cost).reduce(sumTotal, 0);
}

export function calculateAssembleyForFastestProduction(productionTime, resourceType) {
    // time = baseProductionTime / productionPerM3 * m3
    // time * baseProductionTime / productionPerM3 = m3
    // (minTime - currentTime) * resourceType.productionCap
    const currentCycleTime = productionTime / BASE_FACTORY_PRODUCTION;
    const cycleTimeDifference = currentCycleTime - MINIMUM_FACTORY_PRODUCTION_TIME;
    const neededAssemblyVolume = cycleTimeDifference / resourceType.productionCapacity;
    return Math.ceil(neededAssemblyVolume);
}