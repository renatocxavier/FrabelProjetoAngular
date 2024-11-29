import { Routes } from '@angular/router';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const appRoutes: Routes = [
  { path: '', component: MovieSearchComponent },
  { path: 'details/:id', component: MovieDetailsComponent },
  { path: 'favorites', component: FavoritesComponent }, // Rota para favoritos
];
