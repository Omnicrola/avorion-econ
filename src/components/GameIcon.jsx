import React from 'react';

export const GameIcon = ({src, size='med'}) => {
    return (<div className={`game-icon icon-size-${size}`}><img src={src}/></div>);
};