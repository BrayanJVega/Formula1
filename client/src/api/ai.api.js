import { apiClient } from './client';
export const aiApi = {
    async getPredictions(raceId) {
        const { data } = await apiClient.get(`/ai/predictions/${raceId}`);
        return data;
    },
    async getWinProbabilities(raceId) {
        const { data } = await apiClient.get(`/ai/win-probabilities/${raceId}`);
        return data;
    },
};
//# sourceMappingURL=ai.api.js.map