import React from "react";
import {Factory} from "./Factory";

export class TechTree extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="tech-tree"><Factory factory={this.props.selectedFactory}/></div>)
    }
}
