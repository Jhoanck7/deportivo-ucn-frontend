import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  templateUrl: './design-system-page.component.html',
  styleUrl: './design-system-page.component.css'
})
export class DesignSystemPageComponent {
  // ── ESTADOS DE ANIMACIÓN COMPARTIDOS ──
  triggerFade = signal<boolean>(true);
  triggerSlide = signal<boolean>(true);

  // ── BTN SNIPPETS ──
  codeBtnPrimary   = `<button class="btn btn-primary">Botón Primario</button>`;
  codeBtnSecondary = `<button class="btn btn-secondary">Botón Secundario</button>`;
  codeBtnAccent    = `<button class="btn btn-accent">Botón Acento</button>`;
  codeBtnWhatsapp  = `<button class="btn btn-whatsapp">WhatsApp Soporte</button>`;

  // ── FORM SNIPPETS ──
  codeFormGroup = `<div class="form-group">
  <label for="rut">RUT del Socio</label>
  <input type="text" id="rut" placeholder="12.345.678-9">
</div>`;

  // ── BADGE SNIPPETS ──
  codeBadges = `<span class="badge badge-abonado">Abonado</span>
<span class="badge badge-pendiente">Pendiente</span>
<span class="badge badge-warning">En Revisión</span>`;

  // ── LAYOUT & CONTAINER SNIPPETS ──
  codeFeatureCard = `<div class="feature-card court-rent-card animate-slide-up">
  <div class="court-card-header">
    <div class="court-info-group">
      <span class="court-icon-wrapper">⚽</span>
      <h3 class="court-name-title">Cancha Central</h3>
    </div>
  </div>
  <div class="slots-layout-grid">
    <button class="slot-tile">18:00</button>
  </div>
</div>`;

  codeCustomTable = `<div class="custom-table-container">
  <table class="custom-table">
    <thead>
      <tr><th>HORA</th><th>CANCHA</th><th>ESTADO</th></tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: 800;">18:00</td>
        <td>Pádel Court 1</td>
        <td><span class="badge badge-abonado">ABONADO</span></td>
      </tr>
    </tbody>
  </table>
</div>`;

  // ── ANIMATION SNIPPETS (¡NUEVOS!) ──
  codeAnimFadeIn  = `<div class="animate-fade-in">Este contenido aparece suavemente...</div>`;
  codeAnimSlideUp = `<div class="animate-slide-up">Este contenido sube de forma elegante...</div>`;

  // Métodos rápidos para resetear las micro-interacciones en vivo
  replayFade(): void {
    this.triggerFade.set(false);
    setTimeout(() => this.triggerFade.set(true), 10);
  }

  replaySlide(): void {
    this.triggerSlide.set(false);
    setTimeout(() => this.triggerSlide.set(true), 10);
  }
}