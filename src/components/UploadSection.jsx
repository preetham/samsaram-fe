import React from 'react';
import {
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';

export const UploadSection = ({changeBank, setFile, bank}) => {
    return (
        <Grid container style={{marginTop: '2rem'}}>
            <Grid item sm={4}></Grid>
            <Grid item sm={2}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="bank-selector">Bank</InputLabel>
                    <Select
                        onChange={changeBank}
                        label='Bank'
                        value={bank}
                        labelId='bank-selector'
                        id='bank-selector'
                    >
                        <MenuItem value=''>None</MenuItem>
                        <MenuItem value='icici'>ICICI</MenuItem>
                        <MenuItem value='sbi'>SBI</MenuItem>
                        <MenuItem value='axis'>Axis Bank</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={2}>
                <Button component="label" variant='outlined' style={{margin: '0.5rem'}}>
                    Upload
                    <input hidden accept=".xlsx, .xls" type="file" onChange={setFile}/>
                </Button>
            </Grid>
            <Grid item sm={3}></Grid>
        </Grid>
    );
}