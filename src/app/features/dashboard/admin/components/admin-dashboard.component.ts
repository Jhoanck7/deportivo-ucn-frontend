import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Reserva {
  hora: string;
  cancha: string;
  subtituloCancha: string;
  usuario: string;
  rut: string;
  estado: 'ABONADO' | 'PENDIENTE';
  contactado: boolean;
  colorBorder: string;
}

interface Actividad {
  tipo: 'confirmada' | 'cancelada' | 'recordatorio';
  textoBold: string;
  textoNormal: string;
  tiempo: string;
  responsable: string;
}

interface Demanda {
  turno: string;
  alturaPorcentaje: number;
  esActivo: boolean;
}

export interface RamaDeportiva {
  id: string;
  nombre: string;
  dtAsignado: string;
  horario: string;
  slotsUsados: number;
  slotsMax: number;
  icono: string;
  colorFondoIcono: string;
}

export interface Deportista {
  id: string;
  nombre: string;
  rut: string;
  telefono?: string;
  fechaNacimiento: string;
  email: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5059/api/test';
  private readonly nominasApiUrl = 'http://localhost:5059/api/nominas';
  private readonly deportistasApiUrl = 'http://localhost:5059/api/deportistas';
  
  private http = inject(HttpClient);
  private router = inject(Router);
  
  backendMessage: string = '';
  isBackendConnected: boolean = false;
  
  // Navigation & Interactive UI State
  activeMenu: string = 'panel-principal';
  currentPage: number = 1;
  pageSize: number = 3;
  searchQuery: string = '';
  activeTimeTab: string = 'Hoy';
  
  // Roster / Sport Branches State
  ramasDeportivas: RamaDeportiva[] = [];
  isLoadingRamas: boolean = false;
  ramasErrorMessage: string = '';

  // Sub-Nominas navigation
  activeSubNominas: 'ramas' | 'deportistas' = 'ramas';

  // Form Screen state
  nominasView: 'list' | 'form-rama' | 'form-deportista' = 'list';
  isEditing = false;

  // Active form data models
  ramaForm = {
    id: '',
    nombre: '',
    dtAsignado: '',
    dias: 'Mon / Wed / Fri',
    horas: '18:00 - 20:30',
    slotsUsados: 0,
    slotsMax: 30,
    icono: '⚽',
    colorFondoIcono: '#e0e7ff'
  };

  deportistaForm = {
    id: '',
    nombre: '',
    rut: '',
    telefono: '',
    fechaNacimiento: '1998-01-01',
    email: ''
  };

  // Deportistas State
  deportistas: Deportista[] = [];
  isLoadingDeportistas: boolean = false;
  deportistasErrorMessage: string = '';

  // Data lists
  reservasTotales: Reserva[] = [
    // PAGE 1
    {
      hora: '09:00',
      cancha: 'Cancha Tenis #1',
      subtituloCancha: 'Superficie Rápida',
      usuario: 'Ricardo Villalobos',
      rut: '15.432.887-K',
      estado: 'ABONADO',
      contactado: true,
      colorBorder: '#ff7c60' // Coral
    },
    {
      hora: '10:30',
      cancha: 'Pádel Premium #3',
      subtituloCancha: 'Panorámica',
      usuario: 'Camila Soto',
      rut: '18.122.334-0',
      estado: 'PENDIENTE',
      contactado: false,
      colorBorder: '#3b82f6' // Blue
    },
    {
      hora: '12:00',
      cancha: 'Cancha Tenis #4',
      subtituloCancha: 'Arcilla',
      usuario: 'Felipe Arancibia',
      rut: '20.001.445-3',
      estado: 'ABONADO',
      contactado: true,
      colorBorder: '#ff7c60' // Coral
    },
    // PAGE 2
    {
      hora: '13:30',
      cancha: 'Cancha Tenis #2',
      subtituloCancha: 'Superficie Rápida',
      usuario: 'Andrés Bello',
      rut: '12.839.201-1',
      estado: 'ABONADO',
      contactado: true,
      colorBorder: '#ff7c60'
    },
    {
      hora: '15:00',
      cancha: 'Pádel Premium #1',
      subtituloCancha: 'Panorámica',
      usuario: 'Javiera Carrera',
      rut: '16.745.291-K',
      estado: 'PENDIENTE',
      contactado: false,
      colorBorder: '#3b82f6'
    },
    {
      hora: '16:30',
      cancha: 'Multicancha #1',
      subtituloCancha: 'Piso Sintético',
      usuario: 'Bernardo O\'Higgins',
      rut: '10.384.281-2',
      estado: 'ABONADO',
      contactado: false,
      colorBorder: '#10b981' // Green
    },
    // PAGE 3
    {
      hora: '18:00',
      cancha: 'Cancha Tenis #3',
      subtituloCancha: 'Arcilla',
      usuario: 'Diego Portales',
      rut: '17.391.204-K',
      estado: 'PENDIENTE',
      contactado: true,
      colorBorder: '#ff7c60'
    },
    {
      hora: '19:30',
      cancha: 'Pádel Premium #2',
      subtituloCancha: 'Panorámica',
      usuario: 'Manuel Rodríguez',
      rut: '14.930.291-5',
      estado: 'ABONADO',
      contactado: true,
      colorBorder: '#3b82f6'
    },
    {
      hora: '21:00',
      cancha: 'Cancha Tenis #1',
      subtituloCancha: 'Superficie Rápida',
      usuario: 'Lautaro Epulef',
      rut: '11.832.190-3',
      estado: 'ABONADO',
      contactado: true,
      colorBorder: '#ff7c60'
    }
  ];

  reservasFiltradas: Reserva[] = [];
  reservasPaginadas: Reserva[] = [];

  actividades: Actividad[] = [
    {
      tipo: 'confirmada',
      textoBold: 'Reserva confirmada - Reserva #882',
      textoNormal: 'Carlos Pérez',
      tiempo: 'Hace 2 minutos',
      responsable: 'Carlos Pérez'
    },
    {
      tipo: 'cancelada',
      textoBold: 'Reserva cancelada - Cancha #2',
      textoNormal: 'Sistema Automático',
      tiempo: 'Hace 15 minutos',
      responsable: 'Sistema Automático'
    },
    {
      tipo: 'recordatorio',
      textoBold: 'Recordatorio enviado vía WhatsApp',
      textoNormal: 'Admin',
      tiempo: 'Hace 32 minutos',
      responsable: 'Admin'
    }
  ];

  demandaTurnos: Demanda[] = [
    { turno: 'MAÑANA', alturaPorcentaje: 40, esActivo: false },
    { turno: 'MAÑANA', alturaPorcentaje: 55, esActivo: false },
    { turno: 'MEDIODÍA', alturaPorcentaje: 65, esActivo: false },
    { turno: 'MEDIODÍA', alturaPorcentaje: 88, esActivo: true }, // The orange highlight one
    { turno: 'TARDE', alturaPorcentaje: 75, esActivo: false },
    { turno: 'TARDE', alturaPorcentaje: 50, esActivo: false },
    { turno: 'NOCHE', alturaPorcentaje: 45, esActivo: false }
  ];

  ngOnInit(): void {
    this.checkBackendConnection();
    this.updateFiltradoYPagina();
    this.loadRamasDeportivas();
    this.loadDeportistas();
  }

  checkBackendConnection(): void {
    this.http.get<any>(this.apiUrl)
      .subscribe({
        next: (response) => {
          this.backendMessage = response.mensaje;
          this.isBackendConnected = true;
          console.log('datos del backend:', response);
        },
        error: (error) => {
          console.error('Error conectando al backend', error);
          this.backendMessage = 'Error: No se pudo conectar al backend';
          this.isBackendConnected = false;
        }
      });
  }

  loadRamasDeportivas(): void {
    this.isLoadingRamas = true;
    this.ramasErrorMessage = '';
    
    this.http.get<RamaDeportiva[]>(this.nominasApiUrl)
      .subscribe({
        next: (data) => {
          this.ramasDeportivas = data;
          this.isLoadingRamas = false;
          console.log('Ramas deportivas cargadas desde el backend:', data);
        },
        error: (err) => {
          console.warn('No se pudo conectar con el backend de nóminas. Usando datos mock de alta fidelidad (Graceful degradation).', err);
          this.ramasErrorMessage = 'Conexión con backend fallida. Mostrando datos offline.';
          this.isLoadingRamas = false;
          
          this.ramasDeportivas = [
            {
              id: 'RAMA-001',
              nombre: 'Fútbol Masculino',
              dtAsignado: 'Carlos Méndez',
              horario: 'Mon / Wed / Fri \n 18:00 - 20:30',
              slotsUsados: 42,
              slotsMax: 50,
              icono: '⚽',
              colorFondoIcono: '#e0e7ff' // Soft indigo
            },
            {
              id: 'RAMA-002',
              nombre: 'Básquetbol',
              dtAsignado: 'Elena Rivas',
              horario: 'Tue / Thu \n 19:30 - 21:30',
              slotsUsados: 18,
              slotsMax: 30,
              icono: '🏀',
              colorFondoIcono: '#eff6ff' // Soft blue
            },
            {
              id: 'RAMA-003',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5' // Soft emerald
            },
            {
              id: 'RAMA-004',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5'
            },
            {
              id: 'RAMA-005',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5'
            },
            {
              id: 'RAMA-006',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5'
            },
            {
              id: 'RAMA-007',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5'
            },
            {
              id: 'RAMA-008',
              nombre: 'Natación',
              dtAsignado: 'Julian Frost',
              horario: 'Daily \n 06:00 - 08:00',
              slotsUsados: 19,
              slotsMax: 20,
              icono: '🏊',
              colorFondoIcono: '#ecfdf5'
            }
          ];
        }
      });
  }

  loadDeportistas(): void {
    this.isLoadingDeportistas = true;
    this.deportistasErrorMessage = '';
    
    this.http.get<Deportista[]>(this.deportistasApiUrl)
      .subscribe({
        next: (data) => {
          this.deportistas = data;
          this.isLoadingDeportistas = false;
          console.log('Deportistas cargados desde backend:', data);
        },
        error: (err) => {
          console.warn('Fallo al conectar con endpoint de deportistas. Cargando datos locales (graceful fallback)...', err);
          this.deportistasErrorMessage = 'Conexión con backend fallida. Mostrando datos offline.';
          this.isLoadingDeportistas = false;
          
          this.deportistas = [
            { id: 'DEP-001', nombre: 'Juan Pérez', rut: '12.839.201-1', telefono: '+56912345678', fechaNacimiento: '1988-04-12', email: 'juan.perez@example.com' },
            { id: 'DEP-002', nombre: 'Camila González', rut: '18.122.334-0', telefono: '+56998765432', fechaNacimiento: '1996-09-24', email: 'camila.g@example.com' },
            { id: 'DEP-003', nombre: 'Sebastián Rojas', rut: '20.001.445-3', telefono: '', fechaNacimiento: '2001-02-15', email: 'seba.rojas@example.com' },
            { id: 'DEP-004', nombre: 'Valentina Muñoz', rut: '15.432.887-K', telefono: '+56911223344', fechaNacimiento: '1992-06-18', email: 'vale.munoz@example.com' },
            { id: 'DEP-005', nombre: 'Diego Contreras', rut: '17.391.204-K', telefono: '', fechaNacimiento: '1995-11-05', email: 'diego.c@example.com' },
            { id: 'DEP-006', nombre: 'Fernanda Torres', rut: '16.745.291-K', telefono: '+56955667788', fechaNacimiento: '1994-03-30', email: 'fer.torres@example.com' },
            { id: 'DEP-007', nombre: 'Matías Herrera', rut: '14.930.291-5', telefono: '+56999001122', fechaNacimiento: '1991-08-14', email: 'matias.h@example.com' },
            { id: 'DEP-008', nombre: 'Nicolás Fuentes', rut: '19.876.543-2', telefono: '', fechaNacimiento: '1999-12-01', email: 'nico.fuentes@example.com' },
            { id: 'DEP-009', nombre: 'Camilo Jofre', rut: '13.932.190-3', telefono: '+56977889900', fechaNacimiento: '1990-10-22', email: 'camilo.j@example.com' }
          ];
        }
      });
  }

  showAddRamaForm(): void {
    this.isEditing = false;
    this.ramaForm = {
      id: '',
      nombre: '',
      dtAsignado: '',
      dias: 'Mon / Wed / Fri',
      horas: '18:00 - 20:30',
      slotsUsados: 0,
      slotsMax: 30,
      icono: '⚽',
      colorFondoIcono: '#e0e7ff'
    };
    this.nominasView = 'form-rama';
  }

  showEditRamaForm(rama: RamaDeportiva): void {
    this.isEditing = true;
    
    let dias = 'Mon / Wed / Fri';
    let horas = '18:00 - 20:30';
    if (rama.horario.includes('\n')) {
      const parts = rama.horario.split('\n');
      dias = parts[0].trim();
      horas = parts[1].trim();
    } else {
      dias = rama.horario;
    }

    this.ramaForm = {
      id: rama.id,
      nombre: rama.nombre,
      dtAsignado: rama.dtAsignado,
      dias: dias,
      horas: horas,
      slotsUsados: rama.slotsUsados,
      slotsMax: rama.slotsMax,
      icono: rama.icono,
      colorFondoIcono: rama.colorFondoIcono
    };
    this.nominasView = 'form-rama';
  }

  saveRamaForm(): void {
    if (!this.ramaForm.nombre.trim() || !this.ramaForm.dtAsignado.trim()) {
      alert('Por favor complete todos los campos obligatorios de la rama.');
      return;
    }

    const horario = `${this.ramaForm.dias} \n ${this.ramaForm.horas}`;
    
    let colorFondo = '#e0e7ff';
    if (this.ramaForm.icono === '🏀') colorFondo = '#eff6ff';
    if (this.ramaForm.icono === '🏊') colorFondo = '#ecfdf5';
    if (this.ramaForm.icono === '🎾') colorFondo = '#fef3c7';
    if (this.ramaForm.icono === '🏃') colorFondo = '#fdf2f8';

    if (this.isEditing) {
      const index = this.ramasDeportivas.findIndex(r => r.id === this.ramaForm.id);
      if (index !== -1) {
        this.ramasDeportivas[index] = {
          ...this.ramasDeportivas[index],
          nombre: this.ramaForm.nombre.trim(),
          dtAsignado: this.ramaForm.dtAsignado.trim(),
          horario: horario,
          slotsMax: this.ramaForm.slotsMax,
          icono: this.ramaForm.icono,
          colorFondoIcono: colorFondo
        };
        alert('Rama deportiva actualizada exitosamente.');
      }
    } else {
      const nuevo: RamaDeportiva = {
        id: `RAMA-0${this.ramasDeportivas.length + 1}`,
        nombre: this.ramaForm.nombre.trim(),
        dtAsignado: this.ramaForm.dtAsignado.trim(),
        horario: horario,
        slotsUsados: 0,
        slotsMax: this.ramaForm.slotsMax,
        icono: this.ramaForm.icono,
        colorFondoIcono: colorFondo
      };
      this.ramasDeportivas.push(nuevo);
      alert('Nueva rama deportiva registrada con éxito.');
    }

    this.nominasView = 'list';
  }

  deleteRama(rama: RamaDeportiva): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la rama deportiva "${rama.nombre}" de las nóminas activas?`)) {
      this.ramasDeportivas = this.ramasDeportivas.filter(r => r !== rama);
      alert(`Rama deportiva "${rama.nombre}" eliminada exitosamente.`);
    }
  }

  showAddDeportistaForm(): void {
    this.isEditing = false;
    this.deportistaForm = {
      id: '',
      nombre: '',
      rut: '',
      telefono: '',
      fechaNacimiento: '1998-01-01',
      email: ''
    };
    this.nominasView = 'form-deportista';
  }

  showEditDeportistaForm(dep: Deportista): void {
    this.isEditing = true;
    this.deportistaForm = {
      id: dep.id,
      nombre: dep.nombre,
      rut: dep.rut,
      telefono: dep.telefono || '',
      fechaNacimiento: dep.fechaNacimiento,
      email: dep.email
    };
    this.nominasView = 'form-deportista';
  }

  saveDeportistaForm(): void {
    if (!this.deportistaForm.nombre.trim() || !this.deportistaForm.rut.trim() || !this.deportistaForm.fechaNacimiento || !this.deportistaForm.email.trim()) {
      alert('Por favor complete todos los campos obligatorios del deportista.');
      return;
    }

    if (this.isEditing) {
      const index = this.deportistas.findIndex(d => d.id === this.deportistaForm.id);
      if (index !== -1) {
        this.deportistas[index] = {
          ...this.deportistas[index],
          nombre: this.deportistaForm.nombre.trim(),
          rut: this.deportistaForm.rut.trim(),
          telefono: this.deportistaForm.telefono.trim() || undefined,
          fechaNacimiento: this.deportistaForm.fechaNacimiento,
          email: this.deportistaForm.email.trim()
        };
        alert('Datos del deportista actualizados con éxito.');
      }
    } else {
      const nuevo: Deportista = {
        id: `DEP-0${this.deportistas.length + 1}`,
        nombre: this.deportistaForm.nombre.trim(),
        rut: this.deportistaForm.rut.trim(),
        telefono: this.deportistaForm.telefono.trim() || undefined,
        fechaNacimiento: this.deportistaForm.fechaNacimiento,
        email: this.deportistaForm.email.trim()
      };
      this.deportistas.unshift(nuevo);
      alert('Deportista registrado con éxito.');
    }

    this.nominasView = 'list';
  }

  deleteDeportista(dep: Deportista): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al deportista "${dep.nombre}"?`)) {
      this.deportistas = this.deportistas.filter(d => d.id !== dep.id);
      alert('Deportista eliminado exitosamente.');
    }
  }

  cancelForm(): void {
    this.nominasView = 'list';
  }

  exportRamasReport(): void {
    alert('Generando y exportando reporte consolidado de Nóminas y Programas Deportivos (Ramas UCN) en formato Excel/CSV...');
  }

  updateFiltradoYPagina(): void {
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      this.reservasFiltradas = this.reservasTotales.filter(r => 
        r.cancha.toLowerCase().includes(query) || 
        r.usuario.toLowerCase().includes(query) ||
        r.rut.toLowerCase().includes(query)
      );
    } else {
      this.reservasFiltradas = [...this.reservasTotales];
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.reservasPaginadas = this.reservasFiltradas.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateFiltradoYPagina();
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.updateFiltradoYPagina();
  }

  onTimeTabChange(tab: string): void {
    this.activeTimeTab = tab;
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  contactUser(reserva: Reserva): void {
    const phoneNumber = '56912345678';
    const message = `Hola ${reserva.usuario}, nos contactamos de Deportes UCN para recordarte tu reserva de ${reserva.cancha} a las ${reserva.hora}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    reserva.contactado = true;
    window.open(whatsappUrl, '_blank');
  }

  addNewReservation(): void {
    alert('Función "+ Nueva Reserva" iniciada. Cargando formulario de reserva...');
  }

  onSupportClick(): void {
    window.open('https://wa.me/56912345678?text=Hola,%20necesito%20soporte%20con%20el%20sistema%20de%20Deportes%20UCN.', '_blank');
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
