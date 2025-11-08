export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

export interface YearWithMultipleWinners {
  year: number;
  winnerCount: number;
}

export interface YearsWithMultipleWinnersResponse {
  years: YearWithMultipleWinners[];
}

export interface StudioCountPerWin {
  name: string;
  winCount: number;
}

export interface StudiosWithWinCountResponse {
  studios: StudioCountPerWin[];
}

export interface ProducerWithInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface MaxMinWinIntervalForProducersResponse {
  min: ProducerWithInterval[];
  max: ProducerWithInterval[];
}
