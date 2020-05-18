import React from "react";
import factories from '../data/factories.json';
import {findTotalTechTreeBuildCost} from '../util/Calculator';
import {Credits} from "./Credits";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {GameIcon} from "./GameIcon";
import {FactoryTypeIcons} from "../constants/FactoryTypeIcons";
import {UNKNOWN_FACTORY} from "../constants/factory";

function findChildFactoriesFor(goodsToProduce) {
    const childFactories = [];
    for (let i = 0; i < goodsToProduce.length; i++) {
        let goodToProduce = goodsToProduce[i];
        const goodId = goodToProduce.id;
        let firstFactoryFound = factories.find(f => f.outputs.map(o => o.id).includes(goodId));
        if (!firstFactoryFound) {
            firstFactoryFound = {...UNKNOWN_FACTORY};
        }
        firstFactoryFound.children = findChildFactoriesFor(firstFactoryFound.inputs);
        firstFactoryFound.sourceFor = goodToProduce.name;
        childFactories.push(firstFactoryFound);
    }
    return childFactories;
}

function TreeNode({node, onSelect, level = 0}) {
    return (
        <React.Fragment>
            <div className={'tree-node indent-' + level} onClick={() => onSelect(node)}>
                &#x2514;<GameIcon size="sm"
                                  src={FactoryTypeIcons[node.type.toLowerCase()]}/>
                                  {node.name} ({node.sourceFor})
            </div>
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
        <Card className="build-list">
            <CardContent>
                <h2>Complete Tech Tree</h2>
                <h3>Total Build Cost: <Credits amount={totalInvestment}/></h3>
                <div className="list">
                    {tree.children.map((c, idx) => <TreeNode key={tree.id * idx} onSelect={onSelect} node={c}
                                                             level={0}/>)}
                </div>
            </CardContent>
        </Card>
    );
}