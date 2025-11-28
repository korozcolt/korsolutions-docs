import React from 'react';
import styles from './styles.module.css';

interface Screenshot {
  filename: string;
  title: string;
  path: string;
}

interface ScreenshotGalleryProps {
  projectName: string;
  screenshots: Screenshot[];
}

export default function ScreenshotGallery({ projectName, screenshots }: ScreenshotGalleryProps): JSX.Element {
  if (screenshots.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>📸 No hay capturas disponibles todavía.</p>
        <p>Ejecuta <code>npm run capture {projectName}</code> para generar las capturas automáticamente.</p>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {screenshots.map((screenshot, idx) => (
        <div key={idx} className={styles.screenshotItem}>
          <h3>{screenshot.title}</h3>
          <img 
            src={screenshot.path}
            alt={screenshot.title}
            className={styles.screenshot}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              console.error(`Error cargando: ${screenshot.filename}`);
            }}
          />
          <p className={styles.filename}><code>{screenshot.filename}</code></p>
        </div>
      ))}
    </div>
  );
}

