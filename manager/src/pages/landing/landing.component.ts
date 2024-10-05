import {Component, OnInit} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Router} from "@angular/router";
import {MatExpansionModule} from "@angular/material/expansion";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatExpansionModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit{
  features = [
    {
      icon: 'qr_code',
      title: 'Códigos QR Dinámicos',
      description: 'Genera y escanea códigos QR dinámicos que cambian en cada ronda, garantizando la autenticidad de los controles y previniendo la falsificación.'
    },
    {
      icon: 'nfc',
      title: 'Etiquetas NFC de Alta Seguridad',
      description: 'Utiliza etiquetas NFC encriptadas para un control de acceso y seguimiento sin contacto, ideal para entornos donde la higiene es crucial.'
    },
    {
      icon: 'gps_fixed',
      title: 'Seguimiento GPS de Precisión',
      description: 'Monitorea en tiempo real la ubicación del personal de seguridad con tecnología GPS de alta precisión, incluyendo geofencing para alertas automáticas.'
    },
    {
      icon: 'bar_chart',
      title: 'Análisis Predictivo',
      description: 'Utiliza big data y machine learning para predecir patrones de seguridad y optimizar las rutas de ronda basándose en datos históricos y en tiempo real.'
    },
    {
      icon: 'mobile_friendly',
      title: 'App Móvil Intuitiva',
      description: 'Accede a todas las funciones desde nuestra app móvil intuitiva, diseñada para funcionar eficientemente incluso en condiciones de baja conectividad.'
    },
    {
      icon: 'integration_instructions',
      title: 'Integración API Abierta',
      description: 'Integra fácilmente PatrolTech con tus sistemas existentes gracias a nuestra API RESTful completa y bien documentada.'
    }
  ];

  useCases = [
    {
      icon: 'apartment',
      title: 'Comunidades de Propietarios',
      description: 'Mejora la seguridad de tu comunidad con un sistema de rondas eficiente y transparente. Proporciona tranquilidad a los residentes con informes detallados y alertas en tiempo real.'
    },
    {
      icon: 'business',
      title: 'Empresas y Corporaciones',
      description: 'Optimiza tus procesos de seguridad y control de acceso. Integra PatrolTech con sistemas de control de acceso y videovigilancia para una solución de seguridad integral.'
    },
    {
      icon: 'security',
      title: 'Empresas de Seguridad',
      description: 'Ofrece un servicio diferenciado a tus clientes. PatrolTech te permite gestionar múltiples clientes y ubicaciones desde una única plataforma centralizada.'
    },
    {
      icon: 'local_shipping',
      title: 'Logística y Almacenes',
      description: 'Asegura la integridad de tu cadena de suministro. Monitorea puntos de control críticos y genera informes de cumplimiento automatizados.'
    },
    {
      icon: 'school',
      title: 'Instituciones Educativas',
      description: 'Crea un ambiente seguro para estudiantes y personal. Implementa protocolos de seguridad personalizados y gestiona eficientemente situaciones de emergencia.'
    },
    {
      icon: 'local_hospital',
      title: 'Centros de Salud',
      description: 'Garantiza la seguridad de pacientes y personal médico. Integra PatrolTech con sistemas de control de acceso para áreas restringidas y monitoreo de equipos críticos.'
    }
  ];

  testimonials = [
    {
      quote: '"PatrolTech ha revolucionado la forma en que gestionamos la seguridad en nuestra comunidad. La transparencia y eficiencia que ofrece han aumentado significativamente la confianza de nuestros residentes."',
      author: 'María Rodríguez, Presidenta de Comunidad de Propietarios'
    },
    {
      quote: '"Como empresa de seguridad, PatrolTech nos ha permitido ofrecer un servicio más profesional y transparente. La capacidad de proporcionar informes detallados y en tiempo real ha sido un verdadero diferenciador para nuestro negocio."',
      author: 'Juan Pérez, Director de Seguridad Corporativa'
    },
    {
      quote: '"La implementación de PatrolTech en nuestro campus universitario ha mejorado drásticamente nuestra capacidad de respuesta ante incidentes. La facilidad de uso y la potencia de sus análisis han superado nuestras expectativas."',
      author: 'Dr. Ana García, Directora de Seguridad Universitaria'
    }
  ];

  faqs = [
    {
      question: '¿Cómo garantiza PatrolTech la privacidad de los datos?',
      answer: 'PatrolTech utiliza cifrado de extremo a extremo y cumple con las normativas GDPR. Todos los datos se almacenan de forma segura y solo se accede a ellos mediante autenticación de doble factor.'
    },
    {
      question: '¿Puedo integrar PatrolTech con mis sistemas de seguridad existentes?',
      answer: 'Sí, PatrolTech ofrece una API RESTful completa que permite la integración con la mayoría de los sistemas de seguridad y gestión existentes, incluyendo sistemas de control de acceso y videovigilancia.'
    },
    {
      question: '¿Qué soporte técnico ofrece PatrolTech?',
      answer: 'Ofrecemos soporte técnico 24/7 a través de nuestra comunidad en línea, documentación extensa y equipo de soporte dedicado. Además, proporcionamos actualizaciones regulares y mejoras basadas en el feedback de la comunidad.'
    },
    {
      question: '¿Cómo maneja PatrolTech las situaciones de falta de conectividad?',
      answer: 'Nuestra aplicación móvil está diseñada para funcionar offline, sincronizando los datos una vez que se restablece la conexión. Esto garantiza que las rondas de seguridad puedan continuar sin interrupciones incluso en áreas con conectividad limitada.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    document.title = 'PatrolTech: Gestión de Rondas Open Source Gratuito | Seguridad Inteligente para Comunidades y Empresas';
    this.updateMetaDescription('PatrolTech: Sistema open source gratuito para gestión y seguimiento de rondas de seguridad. Solución innovadora con códigos QR, NFC y GPS para comunidades, empresas y más.');
  }

  navigateToStart() {
    this.router.navigate(['/start']);
  }

  private updateMetaDescription(content: string) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
}
