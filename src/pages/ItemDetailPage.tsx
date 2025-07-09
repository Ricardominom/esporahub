import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Upload, FileText, Download, Trash2, Eye, Edit2, CheckSquare, Square } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import MenuBackground from '../components/MenuBackground';
import LogoutDialog from '../components/LogoutDialog';
import '../styles/item-detail.css';

interface ItemDetailProps {
  id: string;
  concept: string;
  section: string;
}

const ItemDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const [item, setItem] = useState<ItemDetailProps | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, id: string}[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
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
    
    // Get item details from location state
    const state = location.state as { item?: ItemDetailProps };
    if (state?.item) {
      setItem(state.item);
    }
  }, [location]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      const filesWithIds = newFiles.map(file => ({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      setUploadedFiles(prev => [...prev, ...filesWithIds]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).map(file => ({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(fileObj => fileObj.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`item-detail-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      
      <div className="item-detail-header">
        <div className="item-detail-breadcrumb-container">
          <span className="item-detail-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="item-detail-breadcrumb-link"
          >
            Menú
          </button>
          <span className="item-detail-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/workhub')}
            className="item-detail-breadcrumb-link"
          >
            WorkHub
          </button>
          <span className="item-detail-breadcrumb-separator">/</span>
          <span className="item-detail-breadcrumb-link current-page">
            {item?.id || 'Detalle de Item'}
          </span>
        </div>
        
        <h1 className="item-detail-title">
          {item ? `${item.id} - ${item.concept}` : 'Detalle de Item'}
        </h1>
      </div>

      <div className={`item-detail-content ${isVisible ? 'visible' : ''}`}>
        <div className="item-detail-layout">
          {/* Left side - Item information */}
          <div className="item-info-section" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="title-container" style={{ textAlign: 'left', paddingLeft: '0', marginLeft: '0' }}>
              <h2 className="section-title" style={{ textAlign: 'left', paddingLeft: '0', marginLeft: '0' }}>{item?.section || 'Sección'}</h2>
            </div>
            <div className="item-description" style={{ flex: 1 }}>
              <p>
                El análisis de Humor Social es un reporte que analiza los sentimientos 
                de la audiencia en un territorio determinado, con el propósito de 
                entender algunos valores de relevancia socio-cultural.
              </p>
              
              <div className="item-meta">
                <div className="meta-item">
                  <span className="meta-label">Responsable:</span>
                  <span className="meta-value">Departamento de Estudios</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Fecha de entrega:</span>
                  <span className="meta-value">20 de Julio</span>
                </div>
              </div>
              
              <p className="item-note">Este item debe ser modificado (periodicidad)</p>
              
              <div className="item-actions">
                <button className="download-template-button" style={{ marginTop: 0 }}>
                  <Download size={16} />
                  <span>Descargar plantilla</span>
                </button>
                
                <button 
                  className={`complete-item-button ${isCompleted ? 'completed' : ''}`} 
                  onClick={() => setIsCompleted(!isCompleted)}
                  style={{ marginTop: 0 }}
                >
                  {isCompleted ? <CheckSquare size={16} /> : <Square size={16} />}
                  <span className={isCompleted ? 'completed-text' : ''}>{isCompleted ? 'Completado' : 'Marcar como completado'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right side - Drag & Drop area */}
          <div className="item-upload-section">
            <div 
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <h3>DRAG AND DROP</h3>
              <p>Arrastra archivos aquí o haz clic para seleccionar</p>
              <div className="upload-formats">
                <span>Formatos aceptados: PDF, DOCX, XLSX, JPG, PNG</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h3>Archivos subidos ({uploadedFiles.length})</h3>
                <div className="files-list">
                  {uploadedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="file-item">
                      <div className="file-icon">
                        <FileText size={16} />
                      </div>
                      <div className="file-info">
                        <div className="file-name">{fileObj.file.name}</div>
                        <div className="file-size">{formatFileSize(fileObj.file.size)}</div>
                      </div>
                      <div className="file-actions">
                        <button 
                          className="file-delete-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(fileObj.id);
                          }}
                          title="Eliminar archivo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
};

export default ItemDetailPage;