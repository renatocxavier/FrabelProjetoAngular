import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OmdbService } from '../../services/omdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { MovieDetails, MovieSummary } from '../../models/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css'],
})
export class MovieSearchComponent implements OnInit {
  searchQuery: string = '';
  movies: MovieDetails[] = []; // Corrigido para MovieDetails[]
  errorMessage: string = '';
  currentPage: number = 1;

  constructor(
    private omdbService: OmdbService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  // Função para navegar até a página de favoritos
  goToFavorites(): void {
    this.router.navigate(['/favorites']).then(() => {
      console.log('Navegação para favoritos bem-sucedida');
    }).catch((error) => {
      console.error('Erro ao navegar para favoritos', error);
    });
  }

  ngOnInit(): void {
    this.loadInitialMovies();
  }

  // Função para carregar filmes iniciais
  loadInitialMovies(): void {
    const defaultQuery = 'Marvel';
    this.omdbService.searchMovies(defaultQuery).subscribe({
      next: (response) => {
        const movies = response.Search || [];
        this.movies = []; // Limpa a lista antes de adicionar novos filmes

        // Agora, estamos buscando os detalhes completos de cada filme
        movies.forEach((movie: MovieSummary) => {
          this.omdbService.getMovieDetails(movie.imdbID).subscribe({
            next: (details: MovieDetails) => {
              if (details) {
                this.movies.push(details); // Adiciona um objeto MovieDetails à lista
              }
            },
            error: (error) => {
              this.errorMessage = 'Erro ao obter detalhes do filme: ' + error;
            },
          });
        });
      },
      error: (error) => {
        this.errorMessage = 'Erro ao buscar filmes: ' + error;
      },
    });
  }

  // Função para buscar filmes com base na consulta do usuário
  searchMovies(query: string = this.searchQuery): void {
    if (!query.trim()) {
      this.errorMessage = 'Por favor, insira um título para buscar.';
      return;
    }

    this.omdbService.searchMovies(query, this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.Search.map((movie: MovieSummary) => {
          return { imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Poster: movie.Poster };
        }) as MovieDetails[]; // Transformando os resultados para MovieDetails
        this.errorMessage = this.movies.length === 0 ? 'Nenhum filme encontrado.' : '';
      },
      error: (error) => {
        this.errorMessage = 'Erro ao realizar a busca: ' + error;
      },
    });
  }

  // Função para alternar o status de favorito
  toggleFavorite(movie: MovieDetails): void {
    if (this.favoritesService.isFavorite(movie.imdbID)) {
      this.favoritesService.removeFavorite(movie.imdbID);
    } else {
      this.favoritesService.addFavorite(movie);
    }
  }

  // Verifica se o filme já é um favorito
  isFavorite(movieId: string): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  // Função para trocar de página
  changePage(direction: number): void {
    if (this.currentPage + direction > 0) {
      this.currentPage += direction;
      this.searchMovies(); // Atualiza a busca para a nova página
    }
  }
}
