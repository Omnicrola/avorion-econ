import React from "react";

function Resource({data}) {
    return (<div className="resource">{data.amount}x {data.name}</div>);
}

export function Factory({factory}) {
    return (<div className="factory">
        <h2 className="name">{factory.name}</h2>
        <div className="wrapper">
        <div className="stats">
            <div className="label">Type:</div>
            <div>{factory.type}</div>
            <div className="label"> Cost:</div>
            <div>{Intl.NumberFormat('en-US').format(factory.cost)} Cr</div>
            <div className="label">Upgrade Cost:</div>
            <div>{Intl.NumberFormat('en-US').format(factory.cost)} Cr x Level</div>
        </div>
            <img src="icon.png" className="icon"/>
        </div>
        <div className="production">
            <div className="inputs">
                <h4>Inputs</h4>
                {factory.inputs.map(i => (<Resource data={i}/>))}
            </div>
            <div className="divider">&gt;</div>
            <div className="outputs">
                <h4>Outputs</h4>
                {factory.outputs.map(i => (<Resource data={i}/>))}
            </div>
        </div>
    </div>);
}