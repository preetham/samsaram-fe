export const calculatePaymentModes = (data) => {
    const modeCount = {};
    let totalAmount = Number(0);
    data.forEach(d => {
        if (d.mode && (d.mode in modeCount)) {
            modeCount[d.mode] = Number(modeCount[d.mode]) + Number(d.amount);
        } else {
            modeCount[d.mode] = Number(d.amount);
        }
        totalAmount = totalAmount + Number(d.amount);
    });
    const pieData = [];
    for (const key in modeCount) {
        pieData.push({
            'id': key.toUpperCase(),
            'value': parseFloat(((modeCount[key] / totalAmount) * 100).toFixed(2)),
        });
    }
    return pieData;
};

export const calculatePaymentReceivers = (data) => {
    const typeCount = {};
    let totalAmount = Number(0);
    data.forEach(d => {
        if (d.payment_type && (d.payment_type in typeCount)) {
            typeCount[d.payment_type] = typeCount[d.payment_type] + Number(d.amount);
        } else {
            typeCount[d.payment_type] = Number(d.amount);
        }
        totalAmount = totalAmount + d.amount;
    });
    const pieData = [];
    for (const key in typeCount) {
        pieData.push({
            'id': key,
            'label': key === 'p2a' ? 'Person': 'Merchant',
            'value': parseFloat(((typeCount[key] / totalAmount) * 100).toFixed(2)),
        });
    }
    return pieData;
};
