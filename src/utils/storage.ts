// Utilidades para manejo de localStorage con tipos seguros
export const storage = {
  // Obtener item del localStorage
  getItem: <T>(key: string, defaultValue?: T): T | null | undefined => {
    try {
      // Usar try-catch para manejar posibles errores de localStorage
      let item;
      try {
        item = localStorage.getItem(key);
      } catch (e) {
        console.error(`Error accessing localStorage for key "${key}":`, e);
        return defaultValue || null;
      }
      
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage item "${key}":`, error);
      return defaultValue || null;
    }
  },

  // Guardar item en localStorage
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  },

  // Eliminar item del localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  },

  // Limpiar todo el localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Verificar si una clave existe
  hasItem: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (e) {
      console.error(`Error checking localStorage for key "${key}":`, e);
      return false;
    }
  },

  // Guardar datos del acuerdo de colaboración
  saveAgreementData: (clientName: string, selectedItems: {[key: string]: boolean}, formData: any) => {
    try {
      // Preservar datos del capturista
      const capturistaTasks = storage.getItem<any[]>('capturistaTasks');
      const capturistaProjects = storage.getItem<any[]>('capturistaProjects');
      const capturistaFieldValues = storage.getItem<{[key: string]: string}>('capturistaFieldValues');
      
      storage.setItem('selectedItems', selectedItems);
      storage.setItem('formData', formData); 
      storage.setItem('clientName', clientName);
      
      // Restaurar datos del capturista
      if (capturistaTasks) storage.setItem('capturistaTasks', capturistaTasks);
      if (capturistaProjects) storage.setItem('capturistaProjects', capturistaProjects);
      if (capturistaFieldValues) storage.setItem('capturistaFieldValues', capturistaFieldValues);
    } catch (error) {
      console.error('Error saving agreement data:', error);
    }
  },

  // Cargar datos del acuerdo de colaboración
  loadAgreementData: () => {
    try {
      return {
        selectedItems: storage.getItem<{[key: string]: boolean}>('selectedItems'),
        formData: storage.getItem('formData'),
        clientName: storage.getItem<string>('clientName')
      };
    } catch (error) {
      console.error('Error loading agreement data:', error);
      return {
        selectedItems: null,
        formData: null,
        clientName: null
      };
    }
  },

  // Limpiar datos del acuerdo de colaboración
  clearAgreementData: () => {
    try {
      // Preservar datos del capturista
      const capturistaTasks = storage.getItem<any[]>('capturistaTasks');
      const capturistaProjects = storage.getItem<any[]>('capturistaProjects');
      const capturistaFieldValues = storage.getItem<{[key: string]: string}>('capturistaFieldValues');
      
      storage.removeItem('selectedItems');
      storage.removeItem('formData');
      storage.removeItem('clientName');
      
      // Restaurar datos del capturista
      if (capturistaTasks) storage.setItem('capturistaTasks', capturistaTasks);
      if (capturistaProjects) storage.setItem('capturistaProjects', capturistaProjects);
      if (capturistaFieldValues) storage.setItem('capturistaFieldValues', capturistaFieldValues);
    } catch (error) {
      console.error('Error clearing agreement data:', error);
    }
  },

  // Guardar asignaciones de tareas
  saveTaskAssignments: (assignments: any[]) => {
    try {
      // Preservar datos del capturista
      const capturistaTasks = storage.getItem<any[]>('capturistaTasks');
      
      if (!assignments) {
        assignments = [];
      }
      storage.setItem('taskAssignments', assignments);
      
      // Restaurar datos del capturista
      if (capturistaTasks) storage.setItem('capturistaTasks', capturistaTasks);
    } catch (error) {
      console.error('Error saving task assignments:', error);
    }
  },

  // Cargar asignaciones de tareas
  getTaskAssignments: () => {
    try {
      const assignments = storage.getItem<any[]>('taskAssignments') || [];
      return Array.isArray(assignments) ? assignments : [];
    } catch (error) {
      console.error('Error loading task assignments:', error);
      return [];
    }
  },

  // Guardar estado de completado de items
  saveCompletedItems: (completedItems: {[key: string]: boolean}) => {
    try {
      // Preservar datos del capturista
      const capturistaTasks = storage.getItem<any[]>('capturistaTasks');
      const capturistaProjects = storage.getItem<any[]>('capturistaProjects');
      
      storage.setItem('completedItems', completedItems || {});
      
      // Restaurar datos del capturista
      if (capturistaTasks) storage.setItem('capturistaTasks', capturistaTasks);
      if (capturistaProjects) storage.setItem('capturistaProjects', capturistaProjects);
    } catch (error) {
      console.error('Error saving completed items:', error);
    }
  },

  // Cargar estado de completado de items
  getCompletedItems: () => {
    try {
      const completedItems = storage.getItem<{[key: string]: boolean}>('completedItems');
      return completedItems || {};
    } catch (error) {
      console.error('Error loading completed items:', error);
      return {};
    }
  },

  // Guardar cuenta seleccionada en WorkHub
  saveSelectedWorkHubAccount: (account: {id: number, name: string}) => {
    try {
      storage.setItem('selectedWorkHubAccount', account);
    } catch (error) {
      console.error('Error saving selected WorkHub account:', error);
    }
  },

  // Cargar cuenta seleccionada en WorkHub
  getSelectedWorkHubAccount: () => {
    try {
      return storage.getItem<{id: number, name: string}>('selectedWorkHubAccount');
    } catch (error) {
      console.error('Error loading selected WorkHub account:', error);
      return null;
    }
  },

  // Obtener todas las claves
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  },
};

// Utilidades específicas para el token de autenticación
export const authStorage = {
  getToken: (): string | null => {
    return storage.getItem<string>('authToken');
  },

  setToken: (token: string): void => {
    storage.setItem('authToken', token);
  },

  removeToken: (): void => {
    storage.removeItem('authToken');
  },

  hasToken: (): boolean => {
    return storage.hasItem('authToken');
  },
};

// Utilidades para datos de usuario
export const userStorage = {
  getUser: () => {
    const user = storage.getItem('user');
    
    // Preservar datos del capturista
    if (user && user.id === '3') {
      const capturistaTasks = storage.getItem<any[]>('capturistaTasks');
      const capturistaProjects = storage.getItem<any[]>('capturistaProjects');
      const capturistaFieldValues = storage.getItem<{[key: string]: string}>('capturistaFieldValues');
      
      if (!capturistaTasks) {
        // Si no existen datos del capturista, inicializarlos
        storage.setItem('capturistaTasks', [
          {
            itemId: 'A-106',
            userId: '3',
            concept: 'Análisis del Humor Social',
            dueDate: '2025-07-20',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: false
          },
          {
            itemId: 'A-107',
            userId: '3',
            concept: 'Histograma del humor social',
            dueDate: '2025-07-25',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: true
          },
          {
            itemId: 'A-108',
            userId: '3',
            concept: 'Estudio de identificación y definición del perfil y sus adjetivos',
            dueDate: '2025-07-15',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: false
          },
          {
            itemId: 'A-128',
            userId: '3',
            concept: 'Social Listening Base',
            dueDate: '2025-07-10',
            section: 'Otros Estudios',
            sectionId: 'otros-estudios',
            completed: false
          },
          {
            itemId: 'A-129',
            userId: '3',
            concept: 'Investigación en Sitio (Paneles)',
            dueDate: '2025-08-05',
            section: 'Otros Estudios',
            sectionId: 'otros-estudios',
            completed: false
          }
        ]);
      }
      
      if (!capturistaProjects) {
        storage.setItem('capturistaProjects', [
          {
            id: 'A-106',
            concept: 'Análisis del Humor Social',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: false
          },
          {
            id: 'A-107',
            concept: 'Histograma del humor social',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: true
          },
          {
            id: 'A-108',
            concept: 'Estudio de identificación y definición del perfil y sus adjetivos',
            section: 'Estudios Antropológicos',
            sectionId: 'antropologicos',
            completed: false
          },
          {
            id: 'A-128',
            concept: 'Social Listening Base',
            section: 'Otros Estudios',
            sectionId: 'otros-estudios',
            completed: false
          },
          {
            id: 'A-129',
            concept: 'Investigación en Sitio (Paneles)',
            section: 'Otros Estudios',
            sectionId: 'otros-estudios',
            completed: false
          }
        ]);
      }
      
      if (!capturistaFieldValues) {
        storage.setItem('capturistaFieldValues', {
          'A-106-fase': 'Fase 1',
          'A-106-linea_estrategica': 'Investigación',
          'A-106-microcampana': 'Análisis Social',
          'A-106-estatus': 'En proceso',
          'A-106-gerente': 'Ana Martínez',
          'A-106-colaboradores': '3',
          'A-106-nombre_colaborador': 'Capturista',
          'A-106-perfil_colaborador': 'Analista de datos',
          'A-106-solicitud_entrega': '15/07/2025',
          'A-106-semana_curso': 'Semana 28',
          'A-106-tipo_item': 'Análisis',
          'A-106-cantidad_v': '1',
          'A-106-cantidad_pr': '2',
          'A-106-cantidad_a': '3',
          'A-106-fecha_finalizacion': '2025-07-20',
          'A-106-repositorio_co': 'Dropbox',
          'A-106-enlace_repositorio': 'https://dropbox.com/shared/123',
          
          'A-107-fase': 'Fase 1',
          'A-107-linea_estrategica': 'Investigación',
          'A-107-microcampana': 'Análisis Social',
          'A-107-estatus': 'Completado',
          'A-107-gerente': 'Ana Martínez',
          'A-107-colaboradores': '2',
          'A-107-nombre_colaborador': 'Capturista',
          'A-107-perfil_colaborador': 'Analista de datos',
          'A-107-solicitud_entrega': '10/07/2025',
          'A-107-semana_curso': 'Semana 27',
          'A-107-tipo_item': 'Análisis',
          'A-107-cantidad_v': '1',
          'A-107-cantidad_pr': '1',
          'A-107-cantidad_a': '1',
          'A-107-fecha_finalizacion': '2025-07-15',
          'A-107-repositorio_co': 'Dropbox',
          'A-107-enlace_repositorio': 'https://dropbox.com/shared/456',
          
          'A-108-fase': 'Fase 1',
          'A-108-linea_estrategica': 'Investigación',
          'A-108-microcampana': 'Perfiles',
          'A-108-estatus': 'En proceso',
          'A-108-gerente': 'Carlos Ruiz',
          'A-108-colaboradores': '4',
          'A-108-nombre_colaborador': 'Capturista',
          'A-108-perfil_colaborador': 'Analista de datos',
          
          'A-128-fase': 'Fase 2',
          'A-128-linea_estrategica': 'Digital',
          'A-128-microcampana': 'Redes Sociales',
          'A-128-estatus': 'Pendiente',
          'A-128-gerente': 'Laura Sánchez',
          
          'A-129-fase': 'Fase 2',
          'A-129-linea_estrategica': 'Investigación',
          'A-129-microcampana': 'Trabajo de Campo',
          'A-129-estatus': 'Programado'
        });
      }
    }
    
    return user;
  },

  setUser: (user: any): void => {
    storage.setItem('user', user);
  },

  removeUser: (): void => {
    storage.removeItem('user');
    // No eliminar los datos del capturista para mantenerlos persistentes
  },

  hasUser: (): boolean => {
    return storage.hasItem('user');
  },
};

// Utilidades para configuraciones de la aplicación
export const appStorage = {
  getTheme: (): 'light' | 'dark' | null => {
    return storage.getItem<'light' | 'dark'>('theme');
  },
  
  // Función para eliminar datos del capturista (solo cuando se solicite explícitamente)
  clearCapturistaData: (): void => {
    storage.removeItem('capturistaTasks');
    storage.removeItem('capturistaProjects');
    storage.removeItem('capturistaFieldValues');
    console.log('Datos del capturista eliminados');
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    storage.setItem('theme', theme);
  },

  getLanguage: (): string | null => {
    return storage.getItem<string>('language');
  },

  setLanguage: (language: string): void => {
    storage.setItem('language', language);
  },

  getLastVisitedPage: (): string | null => {
    return storage.getItem<string>('lastVisitedPage');
  },

  setLastVisitedPage: (page: string): void => {
    storage.setItem('lastVisitedPage', page);
  },
};