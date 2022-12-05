import React from 'react';

export const PaymentToTitle = ({ centerX }) => {
    const style = { fontWeight: 'bold', fill: 'hsl(10, 70%, 50%)' }
    return (
        <text
            x={centerX - 30}
            y={-30}
            style={style}
        >
            Paid To
        </text>
    );
};