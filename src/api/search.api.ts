import { apiClient } from "./client";

export const searchSongs = async (query: string, page = 1) => {
  const response = await apiClient.get(
    `/search/songs?query=${query}&page=${page}`
  );

  return response.data.data.results;
};
