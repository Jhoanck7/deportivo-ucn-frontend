import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SportBranch } from '../../services/sport-branches.service';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './make-branch-form.component.html',
  styleUrl: './make-branch-form.component.css'
})
export class BranchFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  // Propiedad para bloquear el botón al guardar
  @Input() isSaving = false;

  // Rama que se va a editar (opcional, si es null es modo creación)
  @Input() branchToEdit?: SportBranch;

  // Eventos para avisarle al componente padre (Page) qué hacer
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  // Días de la semana para los botones presionables
  availableDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  selectedDays: string[] = [];

  // Definición del formulario con validaciones e inputs de horario individuales
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    trainingDays: ['', [Validators.required]], // Se llenará mediante la interacción de los botones
    trainingSector: ['', [Validators.required]],
    associatedDT: ['', [Validators.required]],
    athleteLimit: [20, [Validators.required, Validators.min(1)]]
  });

  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      // Mantener el orden cronológico de la semana al agregarlo
      this.selectedDays = [...this.selectedDays, day].sort((a, b) => {
        return this.availableDays.indexOf(a) - this.availableDays.indexOf(b);
      });
    }

    // Actualizar el control del formulario con la cadena de texto de días
    const daysString = this.selectedDays.join(', ');
    this.form.patchValue({ trainingDays: daysString });
    this.form.get('trainingDays')?.markAsTouched();
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  ngOnInit(): void {
    if (this.branchToEdit) {
      // 1. Pre-seleccionar días de entrenamiento en la barra de botones
      if (this.branchToEdit.trainingDays) {
        this.selectedDays = this.branchToEdit.trainingDays.split(', ').map(d => d.trim());
      }
      
      // 2. Extraer horarios de inicio y fin
      let start = '';
      let end = '';
      if (this.branchToEdit.trainingHours) {
        const parts = this.branchToEdit.trainingHours.split(' - ');
        if (parts.length === 2) {
          start = parts[0].trim();
          end = parts[1].trim();
        }
      }

      // 3. Rellenar formulario reactivo
      this.form.patchValue({
        name: this.branchToEdit.name,
        startTime: start,
        endTime: end,
        trainingDays: this.branchToEdit.trainingDays,
        trainingSector: this.branchToEdit.trainingSector,
        associatedDT: this.branchToEdit.coachId ? String(this.branchToEdit.coachId) : '',
        athleteLimit: this.branchToEdit.athleteLimit
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      const { startTime, endTime, ...rest } = rawValue;

      // Unificar el horario de inicio y fin en un solo campo trainingHours esperado por el modelo
      const payload = {
        ...rest,
        trainingHours: `${startTime} - ${endTime}`
      };

      this.save.emit(payload);
    }
  }

  onDelete(): void {
    if (this.branchToEdit) {
      if (confirm(`¿Estás seguro de que deseas eliminar la rama "${this.branchToEdit.name}"?`)) {
        this.delete.emit(this.branchToEdit.id);
      }
    }
  }

  onClose() {
    this.close.emit();
  }
}