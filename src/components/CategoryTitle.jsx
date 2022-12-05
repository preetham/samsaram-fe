import React from 'react';

export const CategoryTitle = ({ centerX }) => {
    const style = { fontWeight: 'bold', fill: 'hsl(200, 70%, 50%)' }
    return (
        <text
            x={centerX - 30}
            y={-30}
            style={style}
        >
            Category
        </text>
    )
};