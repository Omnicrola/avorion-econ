import React from "react";
import factories from '../data/factories.json';
import {findTotalTechTreeBuildCost} from '../util/Calculator';
import {Credits} from "./Credits";

function findChildFactoriesFor(goodsToProduce) {
    const childFactories = [];
    for (let i = 0; i < goodsToProduce.length; i++) {
        const good = goodsToProduce[i].id;
        const firstFactoryFound = factories.find(f => f.outputs.map(o => o.id).includes(good));
        firstFactoryFound.children = findChildFactoriesFor(firstFactoryFound.inputs);
        childFactories.push(firstFactoryFound);
    }
    return childFactories;
}

function TreeNode({node, onSelect, level = 0}) {
    return (
        <React.Fragment>
            <div className={'indent-' + level} onClick={() => onSelect(node)}>&#x2514; {node.name}</div>
            {node.children.map((c, idx) => <TreeNode key={node.id * idx}
                                                     node={c}
                                                     level={level + 1}
                                                     onSelect={onSelect}/>)}
        </React.Fragment>
    );
}

export function TechTree({factory, onSelect}) {
    const tree = factory;
    tree.children = findChildFactoriesFor(factory.inputs);

    const totalInvestment = findTotalTechTreeBuildCost(tree);

    return (
        <div className="build-list">
            <h2>Total Build Cost: <Credits amount={totalInvestment}/></h2>
            <div className="list">
                {tree.children.map((c, idx) => <TreeNode key={tree.id * idx} onSelect={onSelect} node={c} level={0}/>)}
            </div>
        </div>
    );
}