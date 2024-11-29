import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly storageKey = 'favorites';

  getFavorites(): Movie[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    if (!this.isFavorite(movie.imdbID)) {
      favorites.push(movie);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  removeFavorite(movieId: string): void {
    const favorites = this.getFavorites().filter((m) => m.imdbID !== movieId);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  isFavorite(movieId: string): boolean {
    return this.getFavorites().some((m) => m.imdbID === movieId);
  }
}
