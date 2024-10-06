import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {LucideAngularModule} from "lucide-angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-how-to-start-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './how-to-start-page.component.html',
  styleUrl: './how-to-start-page.component.scss'
})
export class HowToStartPageComponent {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit() {
    this.title.setTitle('PatrolTech: Gestión de Rondas Open Source Gratuito | Empieza a controlar las rondas');
    this.meta.addTags([
      { name: 'description', content: 'Empieza a controlar la comunidad desde cualquier teléfono móvil' },
      { name: 'keywords', content: 'códigos QR, seguridad, mantenimiento, control de rondas, aplicación móvil' },
      { property: 'og:title', content: 'PatrolTech: Gestión de Rondas Open Source Gratuito | Empieza a controlar las rondas' },
      { property: 'og:description', content: 'Empieza a controlar la comunidad desde cualquier teléfono móvil.' },
      { property: 'og:image', content: 'https://patroltech.online/assets/og-image.jpg' },
      { property: 'og:url', content: 'https://patroltech.online/how-to-start' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]);
  }

  sendInstructions() {
    // Implementa la lógica para enviar instrucciones
    console.log('Enviando instrucciones a los controladores');
  }

}
