import React from 'react';

export const PaymentModeTitle = ({ centerX }) => {
    const style = { fontWeight: 'bold', fill: 'hsl(147, 70%, 50%)' }
    return (
        <text
            x={centerX - 60}
            y={-30}
            style={style}
        >
            Payment Mode
        </text>
    )
};