import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Upload, FileText } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const [item, setItem] = useState<ItemDetailProps | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
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
      setUploadedFiles(prev => [...prev, ...newFiles]);
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
      const newFiles = Array.from(droppedFiles);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
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
          <div className="item-info-section">
            <h2 className="section-title">{item?.section || 'Sección'}</h2>
            <div className="item-description">
              <h3>Estrategia</h3>
              <p>
                El análisis de Humor Social es un reporte que analiza los sentimientos 
                de la audiencia en un territorio determinado, con el propósito de 
                entender algunos valores de relevancia socio-cultural.
              </p>
              
              <div className="item-meta">
                <div className="meta-item">
                  <span className="meta-label">Responsable:</span>
                  <span className="meta-value">Estudios</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Fecha de entrega:</span>
                  <span className="meta-value">XXX</span>
                </div>
              </div>
              
              <p className="item-note">Este item debe ser modificado (periodicidad)</p>
              
              <button className="download-template-button">
                <Download size={16} />
                <span>Descargar plantilla</span>
              </button>
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
                <h3>Archivos subidos</h3>
                <div className="files-list">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        <FileText size={20} />
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ItemDetailPage;