export const ResourceType = {
    IRON: {name: 'Iron', productionCapacity: .35},
    TITANIUM: {name: 'Titanium', productionCapacity: .52},
    NAONITE: {name: 'Naonite', productionCapacity: .79},
    TRINIUM: {name: 'Trinium', productionCapacity: 1.18},
    XANION: {name: 'Xanion', productionCapacity: 1.77},
    OGONITE: {name: 'Ogonite', productionCapacity: 2.66},
    AVORION: {name: 'Avorion', productionCapacity: 4.0},

};

ResourceType.asList = () => [
    ResourceType.IRON,
    ResourceType.TITANIUM,
    ResourceType.NAONITE,
    ResourceType.TRINIUM,
    ResourceType.XANION,
    ResourceType.OGONITE,
    ResourceType.AVORION,
];