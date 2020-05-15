import React from "react";
import {Factory} from "./Factory";
import {TechTree} from "./TechTree";

export function FactoryContainer({selectedFactory, onSelect}) {
    return (<div className="tech-tree">
        <Factory factory={selectedFactory}/>
        <TechTree factory={selectedFactory} onSelect={onSelect}/>
    </div>);
}
