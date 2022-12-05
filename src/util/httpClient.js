import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

export const login = async () => {
    const response = await axios.get(`${baseURL}/api/v1/login`);
    const url = response.data;
    window.location.replace(url);
};

export const authorize = async (code) => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/authorize`, {
            code: code,
        });
        const data = response.data;
        if (data && data.user) {
            return data.user;
        }
        return null;
    } catch (err) {
        return err;
    }
};

export const upload = async (bank, file) => {
    const formData = new FormData();
    formData.append('bank', bank);
    formData.append('statement', file);
    try {
        const response = await axios.post(`${baseURL}/api/v1/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response && response.data && response.data.data) {
            return response.data.data;
        }
        return [];
    } catch (err) {
        return [];
    }
};

export const fetchGroups = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/groups`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response && response.data) {
            return response.data;
        }
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/v1/categories`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response && response.data) {
            return response.data;
        }
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const createExpenses = async (rawExpenseList) => {
    const payload = rawExpenseList.map(expense => {
        return {
            'group_id': expense.groupId,
            'description': `${expense.mode}: ${expense.transferred_to.name}`,
            'cost': expense.amount.toString(),
            'category_id': expense.categoryId,
            'date': expense.transaction_date,
        };
    });
    try {
        const response = await axios.post(`${baseURL}/api/v1/expenses`, {
            'expenses': payload,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response && response.data) {
            return response.data;
        }
        return [];
    } catch (err) {
        return err;
    }
}