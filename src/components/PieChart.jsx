import React from 'react';
import { Box } from '@mui/system';
import { ResponsivePie } from '@nivo/pie';

export const PieChart = ({data, height, top, scheme, titleComponent}) => {
    return (
        <Box sx={{width: '100%', height: {height}}}>
            <ResponsivePie
                data={data}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: scheme }}
                arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
                arcLinkLabelsColor={{ from: 'color' }}
                margin={{ top: top, right: 40, bottom: 40, left: 40 }}
                arcLabel={(e) => `${e.value}%`}
                arcLabelsTextColor='white'
                arcLinkLabel='label'
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            '0.3'
                        ]
                    ]
                }}
                layers={['arcLinkLabels', 'arcs', 'arcLabels', 'legends', titleComponent]}
            />
        </Box>
    );
};