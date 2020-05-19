import React, {useState} from 'react';
import {GameIcon} from "./GameIcon";
import {FactoryTypeIcons} from "../constants/FactoryTypeIcons";
import goods from '../data/goods';
import {Card} from '@material-ui/core';
import {Credits} from "./Credits";
import CardContent from "@material-ui/core/CardContent";
import {TimeFormat} from "./TimeFormat";
import {BASE_FACTORY_PRODUCTION} from "../constants/factory";
import {calculateAssembleyForFastestProduction} from "../util/Calculator";
import {ResourceType} from "../constants/ResourceType";
import {ResourceTypeDropdown} from "./ResourceTypeDropdown";
import FormControl from "@material-ui/core/FormControl";

function Resource({data}) {
    const good = goods.find(g => g.id === data.id);
    return (<div className="resource"><GameIcon size="sm" src={good.icon}/>{data.amount}x {data.name}</div>);
}

export function Factory({factory}) {
    const [resourceType, setResourceType] = useState(ResourceType.IRON);
    const assemblyVolumeRequired = calculateAssembleyForFastestProduction(factory.productionTime, resourceType);
    return (<div className="factory">
        <Card>
            <CardContent>
                <FormControl>
                    <h1 className="name">{factory.name}</h1>
                    <div className="wrapper">
                        <div className="stats">
                            <div className="label">Type:</div>
                            <div>{factory.type}</div>
                            <div className="label"> Cost:</div>
                            <div>{Intl.NumberFormat('en-US').format(factory.cost)} Cr</div>
                            <div className="label">Upgrade Cost:</div>
                            <div>{Intl.NumberFormat('en-US').format(factory.upgradeCost)} Cr x Level</div>
                            <div className="label">Base Cycle Time:</div>
                            <TimeFormat seconds={factory.productionTime / BASE_FACTORY_PRODUCTION}/>
                            <div className="label">m3 required for 15sec production:</div>
                            <div>{Intl.NumberFormat('en-US').format(assemblyVolumeRequired)} m3 of <ResourceTypeDropdown value={resourceType} onChange={r=>setResourceType(r)}/></div>
                            <div className="label">Potential Profit Per Cycle:</div>
                            <div>{Intl.NumberFormat('en-US').format(factory.outputCost - factory.inputCost)} Cr</div>
                        </div>
                        <GameIcon size="lg" src={FactoryTypeIcons[factory.type.toLowerCase()]}/>
                    </div>
                </FormControl>
            </CardContent>
        </Card>

        <Card className="production">
            <CardContent>
                <h3>Production</h3>
                <div className="input-output">
                    <div className="inputs">
                        <h4>Inputs</h4>
                        <h5>Resource Cost: <Credits amount={factory.inputCost}/></h5>
                        {factory.inputs.map(i => (
                            <Resource key={'i-' + i.id} data={i}/>))}
                    </div>
                    <div className="divider">&gt;</div>
                    <div className="outputs">
                        <h4>Outputs</h4>
                        <h5>Total Sales: <Credits amount={factory.outputCost}/></h5>
                        {factory.outputs.map(i => (
                            <Resource key={'i-' + i.id} data={i}/>))}
                        {factory.garbages.length > 0 && <h4>Garbage</h4>}
                        {factory.garbages.map(i => (
                            <Resource key={'i-' + i.id} data={i}/>))}

                    </div>
                </div>
            </CardContent>
        </Card>
    </div>);
}