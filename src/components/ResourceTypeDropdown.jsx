import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import {ResourceType} from "../constants/ResourceType";

export const ResourceTypeDropdown = ({value, onChange}) => {
    return (
        <Select value={value} onChange={e => onChange(e.target.value)}>
            {ResourceType.asList().map(r => <MenuItem key={r.name} value={r}>{r.name}</MenuItem>)}
        </Select>
    );
};