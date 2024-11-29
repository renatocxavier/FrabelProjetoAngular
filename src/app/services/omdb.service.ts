import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovieSearchResponse, MovieDetails } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class OmdbService {
  private readonly apiUrl = 'https://www.omdbapi.com/';
  private readonly apiKey = '9cece6c2';

  constructor(private http: HttpClient) {}

  private buildUrl(params: Record<string, string | number>): string {
    const query = new URLSearchParams({ ...params, apikey: this.apiKey }).toString();
    return `${this.apiUrl}?${query}`;
  }

  searchMovies(title: string, page: number = 1): Observable<MovieSearchResponse> {
    const url = this.buildUrl({ s: title, page });
    return this.http.get<MovieSearchResponse>(url).pipe(catchError(this.handleError));
  }

  getMovieDetails(id: string): Observable<MovieDetails> {
    return this.http
      .get<MovieDetails>(`${this.apiUrl}?i=${id}&apikey=${this.apiKey}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro ao buscar dados. Por favor, tente novamente.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = 'Recurso não encontrado (404).';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor (500).';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
