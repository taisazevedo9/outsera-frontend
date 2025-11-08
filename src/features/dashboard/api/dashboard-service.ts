import { ApiClient } from "@/shared/services/api-client";
import {
  YearWithMultipleWinners,
  YearsWithMultipleWinnersResponse,
  StudioCountPerWin,
  StudiosWithWinCountResponse,
  ProducerWithInterval,
  MaxMinWinIntervalForProducersResponse,
} from "../types";

export class DashboardService {
  constructor(private apiClient: ApiClient) {}

  async getYearsWithMultipleWinners(): Promise<YearWithMultipleWinners[]> {
    const response = await this.apiClient.get<YearsWithMultipleWinnersResponse>(
      "/api/movies/yearsWithMultipleWinners"
    );
    return response.years;
  }

  async getStudiosWithWinCount(limit?: number): Promise<StudioCountPerWin[]> {
    const response = await this.apiClient.get<StudiosWithWinCountResponse>(
      "/api/movies/studiosWithWinCount",
      {
        params: limit ? { limit } : undefined,
      }
    );
    return response.studios;
  }

  async getProducersWithInterval(): Promise<{
    min: ProducerWithInterval[];
    max: ProducerWithInterval[];
  }> {
    const response =
      await this.apiClient.get<MaxMinWinIntervalForProducersResponse>(
        "/api/movies/maxMinWinIntervalForProducers"
      );
    return {
      min: response.min,
      max: response.max,
    };
  }
}
