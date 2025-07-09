import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, CheckSquare, Clock, AlertCircle, CheckCircle, FileText, ArrowUp, Layers, Briefcase, Users, Clock4, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import { storage } from '../utils/storage';
import InputModal from '../components/InputModal';
import SelectAccountModalForWorkHub from '../components/SelectAccountModalForWorkHub';
import AccountBadge from '../components/AccountBadge';
import '../styles/workhub.css';

// Datos hardcodeados para el usuario capturista
const CAPTURISTA_TASKS: TaskAssignment[] = [
  {
    itemId: 'A-106',
    userId: '3', // ID del capturista
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
];

// Datos hardcodeados para proyectos del capturista
const CAPTURISTA_PROJECTS: ProjectItem[] = [
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
];

// Datos de campos para los proyectos del capturista
const CAPTURISTA_FIELD_VALUES: { [key: string]: string } = {
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
};

interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId?: string;
  completed?: boolean;
  code?: string;
}

interface ProjectItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed?: boolean;
}

const WorkHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'tareas' | 'proyecto'>('tareas');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{ id: number, name: string } | null>(() => {
    // Intentar cargar la cuenta seleccionada desde localStorage
    const savedAccount = storage.getItem<{ id: number, name: string }>('selectedWorkHubAccount');
    return savedAccount || { id: 1, name: 'Juan Pérez - Alcalde' };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: (ProjectItem | TaskAssignment)[] }>({});
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>(CAPTURISTA_FIELD_VALUES);
  const [modalState, setModalState] = useState({
    isOpen: false,
    fieldName: '',
    fieldType: 'text' as 'text' | 'number' | 'select',
    initialValue: '',
    selectOptions: [] as { value: string; label: string }[],
    onSave: (value: string) => { }
  });
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );
  // Ref for horizontal scroll indicator
  const horizontalScrollIndicatorRef = React.useRef<HTMLDivElement>(null);
  // Ref for scroll content to set proper width
  const scrollContentRef = React.useRef<HTMLDivElement>(null);
  
  // Ref for project table container
  const projectTableContainerRef = React.useRef<HTMLDivElement>(null);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsVisible(true);

    // Verificar si el usuario es capturista y cargar datos hardcodeados
    if (user && user.id === '3') { // ID del capturista
      // Cargar tareas hardcodeadas para el capturista
      setTaskAssignments(CAPTURISTA_TASKS);
      
      // Cargar proyectos hardcodeados para el capturista
      setProjectItems(CAPTURISTA_PROJECTS);
      
      // Guardar en localStorage para persistencia
      storage.setItem('capturistaTasks', CAPTURISTA_TASKS);
      storage.setItem('capturistaProjects', CAPTURISTA_PROJECTS);
      storage.setItem('capturistaFieldValues', CAPTURISTA_FIELD_VALUES);
    } else {
      // Para otros usuarios, cargar desde localStorage
      const loadData = () => {
        // Cargar tareas
        try {
          // Cargar las asignaciones de tareas desde localStorage pero filtrar las dummy
          let savedAssignments = storage.getItem<TaskAssignment[]>('taskAssignments') || [];

          // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
          savedAssignments = savedAssignments.filter(task =>
            task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
          );

          // Filtrar solo las tareas asignadas al usuario actual
          if (user) {
            const userTasks = savedAssignments.filter(task => task.userId === user.id);
            setTaskAssignments(userTasks);
          }
        } catch (error) {
          console.error('Error loading task assignments:', error);
          setTaskAssignments([]);
        }

        // Cargar ítems del proyecto si hay una cuenta seleccionada
        if (selectedAccount) {
          loadProjectItems();
        }
      };

      // Cargar datos inicialmente
      loadData();
    }
  }, [user, selectedAccount]);

  // Sync scroll between table and scroll indicator
  useEffect(() => {
    const projectTable = projectTableContainerRef.current;
    const scrollIndicator = horizontalScrollIndicatorRef.current; 
    const scrollContent = scrollContentRef.current;
    
    // Set the scroll content width to match the table width
    if (activeTab === 'proyecto' && projectTable && scrollContentRef.current) {
      // Get the actual scrollWidth of the table
      const tableWidth = projectTable.scrollWidth;
      scrollContentRef.current.style.minWidth = `${tableWidth}px`;
    }
    
    if (activeTab === 'proyecto' && projectTable && scrollIndicator && scrollContent) {
      // Set initial scroll content width to match table width
      const updateScrollContentWidth = () => {
        const tableWidth = projectTable.scrollWidth;
        scrollContent.style.minWidth = `${tableWidth}px`;
      };
      
      // Initial width update
      updateScrollContentWidth();
      
      // Update width on window resize
      window.addEventListener('resize', updateScrollContentWidth);
      
      // Smooth scroll synchronization from table to indicator
      const handleTableScroll = (e: Event) => {
        if (scrollIndicator) {
          scrollIndicator.scrollLeft = projectTable.scrollLeft;
        }
      };
      
      // Smooth scroll synchronization from indicator to table
      const handleIndicatorScroll = (e: Event) => {
        if (projectTable) {
          projectTable.scrollLeft = scrollIndicator.scrollLeft;
        }
      };
      
      // Add event listeners
      projectTable.addEventListener('scroll', handleTableScroll);
      scrollIndicator.addEventListener('scroll', handleIndicatorScroll);
      
      // Add wheel event for horizontal scrolling
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault(); 
          
          // Enhanced smooth scrolling with better physics and acceleration
          const scrollAmount = e.deltaY * 2.0; // Further increased scroll speed for better fluidity
          const currentScroll = projectTable.scrollLeft;
          const maxScroll = projectTable.scrollWidth - projectTable.clientWidth;
          const targetScroll = Math.max(0, Math.min(currentScroll + scrollAmount, maxScroll));
          
          // Use smooth animation with requestAnimationFrame for better performance
          const startTime = performance.now();
          const duration = 200; // ms - even shorter duration for more responsive feel
          
          const animateScroll = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic function for natural deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const newPosition = currentScroll + (targetScroll - currentScroll) * easeOut;
            projectTable.scrollLeft = newPosition;
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
          
          requestAnimationFrame(animateScroll);
        }
      };
      
      projectTable.addEventListener('wheel', handleWheel, { passive: false });
      
      // Cleanup
      return () => {
        projectTable.removeEventListener('scroll', handleTableScroll);
        scrollIndicator.removeEventListener('scroll', handleIndicatorScroll);
        projectTable.removeEventListener('wheel', handleWheel); 
        window.removeEventListener('resize', updateScrollContentWidth);
      }
    }
  }, [activeTab]);

  // Combine project items and task assignments for the project tab
  useEffect(() => {
    // Create a combined list of project items and task assignments
    let combined: (ProjectItem | TaskAssignment)[] = [];

    // Si es el usuario capturista, usar los datos hardcodeados
    if (user && user.id === '3') {
      combined = [...CAPTURISTA_PROJECTS];
    } else {
      // Solo agregar items si hay una cuenta seleccionada
      if (selectedAccount) {
        // Agregar los items del proyecto filtrados por la cuenta seleccionada
        combined.push(...projectItems);

        // Add task assignments that aren't already in project items
        taskAssignments.forEach(task => {
          // Check if this task is already in project items
          const existingItem = projectItems.find(item => item.id === task.itemId);

          // If not found and it's a valid task with an itemId, add it
          if (!existingItem && task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))) {
            combined.push({
              id: task.itemId,
              concept: task.concept || "Tarea sin nombre",
              section: task.section || "Sin sección",
              sectionId: task.sectionId || "",
              completed: task.completed || false,
              isTaskAssignment: true
            });
          }
        });
      }
    }

    // Group items by section
    const grouped: { [key: string]: (ProjectItem | TaskAssignment)[] } = {};

    combined.forEach(item => {
      const sectionId = item.sectionId || 'unknown';
      const sectionName = getSectionNameFromId(sectionId);

      if (!grouped[sectionName]) {
        grouped[sectionName] = [];
      }

      grouped[sectionName].push(item);
    });

    // Define the order of sections
    const order = [
      'Set Up Estrategia Digital',
      'Estudios Antropológicos',
      'Otros Estudios',
      'Set Up Acompañamiento Digital',
      'Set Up Gerencia Digital',
      'Set Up Producción',
      'Set up Difusión'
    ];

    setGroupedItems(grouped);
    setSectionOrder(order);
  }, [projectItems, taskAssignments, selectedAccount]);

  // Cargar datos guardados del capturista al iniciar
  useEffect(() => {
    if (user && user.id === '3') {
      // Intentar cargar datos guardados del capturista
      const savedTasks = storage.getItem<TaskAssignment[]>('capturistaTasks');
      const savedProjects = storage.getItem<ProjectItem[]>('capturistaProjects');
      const savedFieldValues = storage.getItem<{[key: string]: string}>('capturistaFieldValues');
      
      // Si hay datos guardados, usarlos en lugar de los hardcodeados
      if (savedTasks && savedTasks.length > 0) {
        setTaskAssignments(savedTasks);
      } else {
        setTaskAssignments(CAPTURISTA_TASKS);
      }
      
      if (savedProjects && savedProjects.length > 0) {
        setProjectItems(savedProjects);
      } else {
        setProjectItems(CAPTURISTA_PROJECTS);
      }
      
      if (savedFieldValues && Object.keys(savedFieldValues).length > 0) {
        setFieldValues(savedFieldValues);
      } else {
        setFieldValues(CAPTURISTA_FIELD_VALUES);
      }
    }
  }, [user]);

  // Guardar cambios en los datos del capturista
  useEffect(() => {
    if (user && user.id === '3') {
      storage.setItem('capturistaTasks', taskAssignments);
      storage.setItem('capturistaProjects', projectItems);
      storage.setItem('capturistaFieldValues', fieldValues);
    }
  }, [taskAssignments, projectItems, fieldValues, user]);

  // Función para cargar los ítems del proyecto desde localStorage
  const loadProjectItems = () => {
    try {
      if (!selectedAccount || !selectedAccount.id) {
        setProjectItems([]);
        return;
      }

      // Cargar los ítems seleccionados y los datos del formulario para la cuenta actual
      const selectedItems = storage.getItem<{ [key: string]: boolean }>('selectedItems') || {};
      const formData = storage.getItem<{ [key: string]: any[] }>('formData') || {};
      const completedItems = storage.getItem<{ [key: string]: boolean }>('completedItems') || {};

      // Crear un identificador para la cuenta actual
      const accountKey = `account-${selectedAccount.id}`;

      // Filtrar los ítems que pertenecen a la cuenta seleccionada usando el accountKey
      const items: ProjectItem[] = [];

      // Procesar cada sección
      Object.entries(formData).forEach(([sectionId, data]: [string, any[]]) => {
        data.forEach((item) => {
          // Solo incluir items reales (que comiencen con A- o B-) y que estén seleccionados
          const itemKey = `${accountKey}-${item.id}`;
          if (selectedItems[item.id] && (item.id.startsWith('A-') || item.id.startsWith('B-'))) {
            items.push({
              id: item.id,
              concept: item.concept,
              section: getSectionName(sectionId),
              sectionId: sectionId,
              completed: completedItems[item.id] || false
            });
          }
        });
      });

      // Actualizar el estado con los ítems filtrados
      setProjectItems(items);
      console.log(`Loaded ${items.length} items for account ${selectedAccount.name}`);
    } catch (error) {
      console.error('Error loading project items:', error);
      setProjectItems([]);
    }
  };

  // Función para obtener el nombre de la sección
  const getSectionName = (sectionId: string): string => {
    const sectionMapping: { [key: string]: string } = {
      'estrategia': 'Set Up Estrategia Digital',
      'antropologicos': 'Estudios Antropológicos',
      'otros-estudios': 'Otros Estudios',
      'acompanamiento': 'Set Up Acompañamiento Digital',
      'gerencia': 'Set Up Gerencia Digital',
      'produccion': 'Set Up Producción',
      'difusion': 'Set up Difusión'
    };

    return sectionMapping[sectionId] || sectionId;
  };

  // Función para obtener las tareas según la categoría seleccionada
  const getFilteredTasks = () => {
    if (!taskAssignments.length) return [];
    
    // Si es el usuario capturista, usar los datos hardcodeados
    if (user && user.id === '3') {
      // Filtrar según la categoría seleccionada
      return filterTasksByCategory(CAPTURISTA_TASKS);
    }

    // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
    const realTasks = taskAssignments.filter(task =>
      task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
    );

    if (!realTasks.length) return [];

    return filterTasksByCategory(realTasks);
  };

  // Función auxiliar para filtrar tareas por categoría
  const filterTasksByCategory = (tasks: TaskAssignment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    return tasks.filter(task => {
      // Si la categoría es "all", mostrar todas las tareas reales
      if (selectedCategory === 'all') return true;

      if (!task.dueDate) return selectedCategory === 'no-date';

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (selectedCategory) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week':
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    });
  };

  const filteredTasks = getFilteredTasks();

  // Función para obtener el conteo de tareas por categoría
  const getTaskCountForCategory = (categoryId: string) => {
    if (!taskAssignments.length) return 0;
    
    // Si es el usuario capturista, usar los datos hardcodeados
    if (user && user.id === '3') {
      // Filtrar según la categoría
      return countTasksByCategory(CAPTURISTA_TASKS, categoryId);
    }

    // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
    const realTasks = taskAssignments.filter(task =>
      task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
    );

    if (!realTasks.length) return 0;

    return countTasksByCategory(realTasks, categoryId);
  };

  // Función auxiliar para contar tareas por categoría
  const countTasksByCategory = (tasks: TaskAssignment[], categoryId: string) => {
    // Si la categoría es "all", mostrar el total de tareas
    if (categoryId === 'all') return tasks.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    return tasks.filter(task => {
      if (!task.dueDate || !task.itemId || !(task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))) return false;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (categoryId) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week':
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    }).length;
  };

  const timeCategories = [
    { id: 'all', label: 'Todas', icon: <Calendar size={16} /> },
    { id: 'past', label: 'Días anteriores', icon: <Clock size={16} /> },
    { id: 'today', label: 'Hoy', icon: <Calendar size={16} /> },
    { id: 'this-week', label: 'Esta semana', icon: <Calendar size={16} /> },
    { id: 'next-week', label: 'Siguiente semana', icon: <Calendar size={16} /> },
    { id: 'later', label: 'Después', icon: <Calendar size={16} /> },
    { id: 'no-date', label: 'Sin fecha', icon: <Calendar size={16} /> }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Función para abrir el modal
  const openModal = (
    itemId: string,
    fieldName: string,
    fieldType: 'text' | 'number' | 'select' = 'text',
    selectOptions: { value: string; label: string }[] = []
  ) => {
    const fieldKey = `${itemId}-${fieldName}`;
    const currentValue = fieldValues[fieldKey] || '';

    setModalState({
      isOpen: true,
      fieldName,
      fieldType,
      initialValue: currentValue,
      selectOptions,
      onSave: (value: string) => {
        const updatedValues = {
          ...fieldValues,
          [fieldKey]: value
        };
        setFieldValues(updatedValues);

        // Guardar en localStorage
        storage.setItem('fieldValues', updatedValues);
      }
    });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // Función para obtener el valor de un campo
  const getFieldValue = (itemId: string, fieldName: string) => {
    const fieldKey = `${itemId}-${fieldName}`;
    return fieldValues[fieldKey] || '';
  };

  {/* Mapeo de secciones con sus títulos correctos */ }
  const sectionMapping = {
    'estrategia': 'Set Up Estrategia Digital',
    'antropologicos': 'Estudios Antropológicos',
    'otros-estudios': 'Otros Estudios',
    'acompanamiento': 'Set Up Acompañamiento Digital',
    'gerencia': 'Set Up Gerencia Digital',
    'produccion': 'Set Up Producción',
    'difusion': 'Set up Difusión'
  };

  // Función para obtener el nombre de la sección a partir del sectionId
  const getSectionNameFromId = (sectionId: string): string => {
    return sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId;
  };

  // Función para manejar la selección de cuenta
  const handleSelectAccount = (accountId: number, accountName: string) => {
    setSelectedAccount({ id: accountId, name: accountName });
    setIsLoading(true);

    // Simular carga de datos
    setTimeout(() => {
      // Guardar la cuenta seleccionada en localStorage
      storage.setItem('selectedWorkHubAccount', { id: accountId, name: accountName });

      // Recargar los datos del proyecto para esta cuenta
      loadProjectItems();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`workhub-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />

      <div className="workhub-header">
        <div className="workhub-breadcrumb-container">
          <span className="workhub-breadcrumb-separator">/</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="workhub-breadcrumb-link"
          >
            Menú
          </button>
        </div>

        <h1 className="workhub-title">
          Mi workhub {selectedAccount && activeTab === 'proyecto' && <AccountBadge accountName={selectedAccount.name} />}
        </h1>

        <div className="header-right">
          {activeTab === 'proyecto' && <button
            className="account-select-button"
            onClick={() => setShowAccountModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              ...(isDarkMode ? {
                background: 'rgba(147, 112, 219, 0.15)',
                border: '1px solid rgba(147, 112, 219, 0.3)',
                color: 'rgba(255, 255, 255, 0.9)'
              } : {
                background: 'rgba(1, 113, 226, 0.1)',
                border: '1px solid rgba(1, 113, 226, 0.3)',
                color: '#0171E2'
              })
            }}
          >
            <Users size={16} style={{ flexShrink: 0 }} />
            <span>Seleccionar cuenta</span>
          </button>}
        </div>
      </div>

      <div className={`workhub-content ${isVisible ? 'visible' : ''}`}>
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'tareas' ? 'active' : ''}`}
            onClick={() => setActiveTab('tareas')}
          >
            <span>TAREAS</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'proyecto' ? 'active' : ''}`}
            onClick={() => setActiveTab('proyecto')}
          >
            <span>PROYECTO</span>
          </button>
        </div>

        {/* Time Categories - Solo mostrar cuando el tab activo es 'tareas' */}
        {activeTab === 'tareas' && (
          <div className="time-categories">
            {timeCategories.map(category => (
              <button
                key={category.id}
                className={`time-category ${selectedCategory === category.id ? 'active' : ''} ${getTaskCountForCategory(category.id) === 0 ? 'empty' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-count">{getTaskCountForCategory(category.id)}</div>
                <div className="category-label">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
                {selectedCategory === category.id && (
                  <div className="selected-indicator">
                    <CheckCircle size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Task Cards Grid - 20% más grande */}
        {activeTab === 'tareas' ? (
          <div className="task-cards-container">
            <div className="task-cards-grid">
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.itemId} className="task-card">
                    <div className="task-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="task-card-section">{task.section || "Sin sección"}</div>
                      <div className="task-card-date">
                        <Calendar size={14} />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Sin fecha'}</span>
                      </div>
                    </div>
                    <div className="task-card-content">
                      <h3 className="task-card-title">{task.concept || task.itemId || "Tarea sin nombre"}</h3>
                      <div className="task-card-footer">
                        <div className="task-card-code">{task.itemId || task.code || "Sin código"}</div>
                        {task.completed && (
                          <div className="task-completed-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={16} />
                            <span>Completada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-tasks-message">
                  <AlertCircle size={48} />
                  <h3>No tienes tareas asignadas</h3>
                  <p>No se encontraron tareas en esta categoría</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="project-table-container">
            {/* Horizontal scroll indicator */}
            <div 
              ref={horizontalScrollIndicatorRef}
              className="horizontal-scroll-indicator"
              style={{
                cursor: 'grab'
              }} 
              onMouseDown={() => {
                if (horizontalScrollIndicatorRef.current) {
                  horizontalScrollIndicatorRef.current.style.cursor = 'grabbing';
                }
              }}
              onMouseUp={() => {
                if (horizontalScrollIndicatorRef.current) {
                  horizontalScrollIndicatorRef.current.style.cursor = 'grab';
                }
              }}
            >
              <div 
                ref={scrollContentRef}
                className="scroll-content" 
                style={{ 
                  height: '1px', 
                  minWidth: '2500px', // Same width as the table
                  background: 'transparent' 
                }}
              />
            </div>
            
            {isLoading ? (
              <div className="project-loading-state">
                <div className="loading-spinner"></div>
                <p>Cargando datos de la cuenta...</p>
              </div>
            ) : (
              <div 
                className="project-table-wrapper" 
                ref={projectTableContainerRef} 
                style={{ 
                  padding: '0',
                  overscrollBehaviorX: 'none',
                  willChange: 'scroll-position',
                  WebkitOverflowScrolling: 'touch', 
                  cursor: 'grab',
                  msOverflowStyle: 'none'
                }}
                onMouseDown={() => {
                  if (projectTableContainerRef.current) {
                    projectTableContainerRef.current.style.cursor = 'grabbing';
                  }
                }}
                onMouseUp={() => {
                  if (projectTableContainerRef.current) {
                    projectTableContainerRef.current.style.cursor = 'grab';
                  }
                }}
              >
                <table 
                  className="project-table" 
                  style={{ 
                    tableLayout: 'fixed', 
                    marginLeft: '0', 
                    borderSpacing: '0',
                    willChange: 'transform'
                  }}
                >
                  <thead>
                    <tr style={{ willChange: 'transform' }}>
                      <th style={{ width: '180px', minWidth: '180px' }}>Item</th>
                      <th style={{ width: '80px', minWidth: '80px' }}>Subele...</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Fase</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Línea estratégica</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Microcampaña</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Estatus</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Gerente</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Colaboradores</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Nombre del colaborador</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Perfil de colaborador</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Solicitud y entrega</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Semana en curso</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Tipo de item</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Cantidad V...</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Cantidad Pr...</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Cantidad A...</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Fecha de finalización</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Repositorio de co...</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Repositorio firma...</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Enlace de repositorio</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Desarrollo creativo</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Fecha testeo</th>
                      <th style={{ width: '120px', minWidth: '120px' }}>Estatus testeo</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Entrega al cliente</th>
                      <th style={{ width: '150px', minWidth: '150px' }}>Nombre del archivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccount && Object.keys(groupedItems).length > 0 ? (
                      sectionOrder.map(sectionName => {
                        const items = groupedItems[sectionName] || [];
                        if (items.length === 0) return null; // No mostrar secciones vacías

                        return (
                          <React.Fragment key={sectionName}>
                            <tr className="section-header">
                              <td colSpan={26} className="section-title">
                                {sectionName}
                              </td>
                            </tr>
                            {items.map((item) => (
                              <tr key={item.id} className={item.completed ? "completed-item" : ""}>
                                <td className="item-code-cell" style={{ width: '180px', minWidth: '180px' }}>
                                  <div 
                                    className="item-code" 
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() => navigate('/item-detail', { 
                                      state: { 
                                        item: {
                                          id: item.id,
                                          concept: item.concept,
                                          section: item.section
                                        }
                                      }
                                    })}
                                  >{item.id}</div>
                                  <div 
                                    className="item-concept-cell" 
                                    style={{ cursor: 'pointer', marginTop: '4px' }}
                                    onClick={() => navigate('/item-detail', { 
                                      state: { 
                                        item: {
                                          id: item.id,
                                          concept: item.concept,
                                          section: item.section
                                        }
                                      }
                                    })}
                                  >{item.concept}</div>
                                </td>
                                <td>
                                  <button className="project-action-btn upload-btn">
                                    <ArrowUp size={16} style={{ color: item.completed ? '#22c55e' : undefined }} />
                                  </button>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'fase')}
                                    placeholder="Fase"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Fase')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'linea_estrategica')}
                                    placeholder="Línea estratégica"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Línea estratégica')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'microcampana')}
                                    placeholder="Microcampaña"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Microcampaña')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={item.completed ? 'Completado' : getFieldValue(item.id, 'estatus')}
                                    placeholder="Estatus"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Estatus')}
                                    style={{ color: item.completed ? '#22c55e' : undefined, fontWeight: item.completed ? 'bold' : undefined }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'gerente')}
                                    placeholder="Gerente"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Gerente')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'colaboradores')}
                                    placeholder="Colaboradores"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Colaboradores')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'nombre_colaborador')}
                                    placeholder="Nombre del colaborador"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Nombre del colaborador')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'perfil_colaborador')}
                                    placeholder="Perfil de colaborador"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Perfil de colaborador')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'solicitud_entrega')}
                                    placeholder="Solicitud y entrega"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Solicitud y entrega')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'semana_curso')}
                                    placeholder="Semana en curso"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Semana en curso')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'tipo_item')}
                                    placeholder="Tipo de item"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Tipo de item')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'cantidad_v')}
                                    placeholder="Cantidad V..."
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad V...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'cantidad_pr')}
                                    placeholder="Cantidad Pr..."
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad Pr...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'cantidad_a')}
                                    placeholder="Cantidad A..."
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad A...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'fecha_finalizacion')}
                                    onChange={(e) => {
                                      const updatedValues = {
                                        ...fieldValues,
                                        [`${item.id}-fecha_finalizacion`]: e.target.value
                                      };
                                      setFieldValues(updatedValues);
                                      storage.setItem('fieldValues', updatedValues);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'repositorio_co')}
                                    placeholder="Repositorio de co..."
                                    readOnly
                                    onClick={() => openModal(item.id, 'Repositorio de co...')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'repositorio_firma')}
                                    placeholder="Repositorio firma..."
                                    readOnly
                                    onClick={() => openModal(item.id, 'Repositorio firma...')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'enlace_repositorio')}
                                    placeholder="Enlace de repositorio"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Enlace de repositorio')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'desarrollo_creativo')}
                                    placeholder="Desarrollo creativo"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Desarrollo creativo')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'fecha_testeo')}
                                    onChange={(e) => {
                                      const updatedValues = {
                                        ...fieldValues,
                                        [`${item.id}-fecha_testeo`]: e.target.value
                                      };
                                      setFieldValues(updatedValues);
                                      storage.setItem('fieldValues', updatedValues);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={item.completed ? 'Aprobado' : getFieldValue(item.id, 'estatus_testeo')}
                                    placeholder="Estatus testeo"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Estatus testeo')}
                                    style={{ color: item.completed ? '#22c55e' : undefined, fontWeight: item.completed ? 'bold' : undefined }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={item.completed ? 'Entregado' : getFieldValue(item.id, 'entrega_cliente')}
                                    placeholder="Entrega al cliente"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Entrega al cliente')}
                                    style={{ color: item.completed ? '#22c55e' : undefined, fontWeight: item.completed ? 'bold' : undefined }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="project-input"
                                    value={getFieldValue(item.id, 'nombre_archivo')}
                                    placeholder="Nombre del archivo"
                                    readOnly
                                    onClick={() => openModal(item.id, 'Nombre del archivo')}
                                  />
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr style={{ height: '300px' }}>
                        <td colSpan={26} className="empty-project-message" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', height: '300px' }}>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>



      {/* Modals */}
      <InputModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        fieldName={modalState.fieldName}
        fieldType={modalState.fieldType}
        initialValue={modalState.initialValue}
        selectOptions={modalState.selectOptions}
        onSave={modalState.onSave}
      />

      <SelectAccountModalForWorkHub
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSelectAccount={handleSelectAccount}
      />

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => {
          useAuthStore.getState().logout();
          navigate('/login');
        }}
      />
    </div>
  );
};

export default WorkHubPage;