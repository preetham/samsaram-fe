import React from 'react';
import { Grid } from '@mui/material';

import { PieChart } from './PieChart';
import { PaymentModeTitle } from './PaymentModeTitle';
import { PaymentToTitle } from './PaymentToTitle';
import { CategoryTitle } from './CategoryTitle';

export const ChartSection = ({ paymentPie, pTypePie, categoryCount }) => {

    return (
        <>
            <Grid container style={{ margin: "1rem" }}>
                <Grid item sm={6}>
                    <PieChart
                        data={paymentPie}
                        height={300}
                        top={50}
                        scheme='paired'
                        titleComponent={PaymentModeTitle}
                    />
                </Grid>
                <Grid item sm={6}>
                    <PieChart
                        data={pTypePie}
                        height={300}
                        top={50}
                        scheme='spectral'
                        titleComponent={PaymentToTitle}
                    />
                </Grid>
            </Grid>
            <Grid container style={{ margin: "1rem" }}>
                <Grid item sm={1}></Grid>
                <Grid item sm={10}>
                    <PieChart
                        data={categoryCount}
                        height={450}
                        top={50}
                        scheme='paired'
                        titleComponent={CategoryTitle}
                    />
                </Grid>
                <Grid item sm={1}></Grid>
            </Grid>
        </>
    );
};