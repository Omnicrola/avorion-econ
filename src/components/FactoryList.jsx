import React from 'react';
import factories from '../data/factories.json';
import {Input} from '@material-ui/core';
import {List, ListItem, ListItemText, Icon} from '@material-ui/core';
import {FactoryTypeIcons} from "../constants/FactoryTypeIcons";
import {GameIcon} from "./GameIcon";


const FactoryListItem = ({factory, selected, onClick}) => {
    return (
        <ListItem button key={factory.id} selected onClick={() => onClick(factory)}>
            <GameIcon size="sm"
                      src={FactoryTypeIcons.factory}/>
            <ListItemText primary={factory.name}/>
        </ListItem>
    );
};

export const FactoryList = ({onSelect}) => {

    const [selectedId, setSelectedId] = React.useState(1);
    const [filter, setFilter] = React.useState();

    const onClickItem = (factory) => {
        setSelectedId(factory.id);
        onSelect(factory);
    };
    const filterList = (factoryName) => {
        if (!filter) return true;
        return factoryName.toLowerCase().includes(filter);
    }

    return (<div className="factory-list">
        <Input type="text" className="search" placeholder="search..."
               onChange={e => setFilter((e.target.value || '').toLowerCase())}/>
        <List>
            {factories
                .filter(f => filterList(f.name))
                .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
                .map((f, index) => <FactoryListItem
                    key={f.id}
                    factory={f}
                    selected={index === selectedId}
                    onClick={onClickItem}/>)}
        </List>
    </div>);
}