import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Movie } from '../../models/movie';
import { Router } from '@angular/router'; // Importando Router

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteMovies: Movie[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private router: Router // Injetando o Router no construtor
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteMovies = this.favoritesService.getFavorites();
  }

  removeFavorite(movieId: string): void {
    this.favoritesService.removeFavorite(movieId);
    this.loadFavorites(); // Atualiza a lista após remoção
  }

  // Função para voltar para a página anterior ou inicial
  goBack(): void {
    this.router.navigate(['/']); // Navega para a página inicial
    // Ou, para voltar à página anterior no histórico, use:
    // history.back();
  }
}
