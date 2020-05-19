import React, {Fragment} from 'react';

const SECONDS_IN_ONE_HOUR = 60.0 * 60.0;
const SECONDS_IN_ONE_MINUTE = 60.0;

export const TimeFormat = ({seconds}) => {
    const hours = Math.floor(seconds / SECONDS_IN_ONE_HOUR);
    const minutes = Math.floor((seconds % SECONDS_IN_ONE_HOUR) / SECONDS_IN_ONE_MINUTE);
    const displaySeconds = Math.floor(seconds % SECONDS_IN_ONE_MINUTE);
    return (
        <Fragment>{hours} hours {minutes} minutes {displaySeconds} seconds</Fragment>
    );
};