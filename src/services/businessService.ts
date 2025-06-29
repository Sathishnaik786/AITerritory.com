import api from './api';

export const businessService = {
  async getBusinessFunctions() {
    const response = await api.get('/business-functions/functions');
    return response.data;
  },
}; 