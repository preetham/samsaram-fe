import React from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { FormControl, InputLabel, Select, Button, Box, MenuItem } from "@mui/material";

export const ExpenseTable = ({
    rows,
    columns,
    categories,
    groups,
    selectedCategory,
    selectedGroup,
    handleGroupChange,
    handleCategoryChange,
    handleExpenseSelect,
    handleRowSelection,
}) => {
    const customToolbar = () => {
        return (
            <GridToolbarContainer>
                <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                    <InputLabel id="select-group">Group</InputLabel>
                    <Select
                        labelId='select-group'
                        id='select-group'
                        value={selectedGroup}
                        label='Group'
                        onChange={handleGroupChange}
                    >
                        {
                            groups && groups.length > 0 &&
                            groups.map((group) => <MenuItem value={group.id} key={group.id}>{group.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                    <InputLabel id="select-category">Category</InputLabel>
                    <Select
                        labelId='select-category'
                        id='select-category'
                        value={selectedCategory}
                        label='Category'
                        onChange={handleCategoryChange}
                    >
                        {
                            categories && categories.length > 0 &&
                            categories.map((category) => <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <Button variant='text' onClick={handleExpenseSelect}>Add as Expense</Button>
            </GridToolbarContainer>
        );
    };
    return (
        <Box style={{ width: '100%', display: 'flex', flexGrow: 1 }}>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.description}
                checkboxSelection
                onSelectionModelChange={handleRowSelection}
                components={{
                    Toolbar: customToolbar,
                }}
            />
        </Box>
    )
};