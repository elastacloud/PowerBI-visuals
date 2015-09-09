/// <reference path="../../_references.ts"/>

module powerbi.visuals.capabilities {
    export var infographCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
            },
            {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
            },
        ],
        dataViewMappings: [{
            categorical: {
                categories: {
                    for: { in: 'Category' },
                },
                rowCount: { preferred: { max: 2 } }
            },
        }],
        dataPoint: {
            displayName: data.createDisplayNameGetter('Visual_DataPoint'),
            properties: {
                fill: {
                    displayName: data.createDisplayNameGetter('Visual_Fill'),
                    type: { fill: { solid: { color: true } } }
                },
            }
        },
        labels: {
            displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
            properties: {
                show: {
                    displayName: data.createDisplayNameGetter('Visual_Show'),
                    type: { bool: true }
                },
                color: {
                    displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
                    type: { fill: { solid: { color: true } } }
                },
                labelDisplayUnits: {
                    displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                    type: { formatting: { labelDisplayUnits: true } }
                }
            }
        }
    };
}