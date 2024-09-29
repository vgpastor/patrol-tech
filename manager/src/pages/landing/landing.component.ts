import { Component } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(
    private meta: Meta,
    private title: Title
  ) {
  }

  ngOnInit() {
    this.title.setTitle('PatrolTech - Gestión Avanzada de Rondas de Seguridad');
    this.meta.addTags([
      {
        name: 'description',
        content: 'PatrolTech ofrece soluciones avanzadas de gestión de rondas de seguridad con tecnología QR, NFC y GPS en tiempo real. Optimiza tu vigilancia con nuestro sistema open source.'
      },
      {name: 'keywords', content: 'seguridad, rondas, vigilancia, QR, NFC, GPS, open source'},
      {name: 'robots', content: 'index, follow'},
      {property: 'og:title', content: 'PatrolTech - Gestión Avanzada de Rondas de Seguridad'},
      {
        property: 'og:description',
        content: 'Revoluciona tus rondas de seguridad con PatrolTech. Tecnología avanzada para una vigilancia eficiente y confiable.'
      },
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://patroltech.online'},
      {property: 'og:image', content: 'https://patroltech.online/assets/og-image.jpg'}, // Asegúrate de crear esta imagen
    ]);
  }
}
