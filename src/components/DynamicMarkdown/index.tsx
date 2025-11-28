import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DynamicMarkdownProps {
  filePath: string;
  projectName: string;
}

export default function DynamicMarkdown({ filePath, projectName }: DynamicMarkdownProps): JSX.Element {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/docs/${projectName}/github/${filePath}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Archivo no encontrado: ${filePath}`);
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filePath, projectName]);

  if (loading) {
    return <div>📄 Cargando contenido desde GitHub...</div>;
  }

  if (error) {
    return (
      <div className="alert alert--warning">
        <p>⚠️ {error}</p>
        <p>Ejecuta <code>npm run sync {projectName}</code> para sincronizar el contenido desde GitHub.</p>
      </div>
    );
  }

  return <Markdown>{content}</Markdown>;
}
