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

