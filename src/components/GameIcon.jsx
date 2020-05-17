import React from 'react';
import {ENV} from '../constants/environment';

export const GameIcon = ({src, size = 'med'}) => {
    return (<div className={`game-icon icon-size-${size}`}><img src={ENV.IMG_ROOT + "icons/" + src}/></div>);
};