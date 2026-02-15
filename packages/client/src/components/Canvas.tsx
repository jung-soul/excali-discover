import React, { useEffect, useRef } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

interface Props {
  elements: any[];
  onElementsChange: (elements: any[]) => void;
}

export default function Canvas({ elements, onElementsChange }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const prevLenRef = useRef(0);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    
    if (elements.length > prevLenRef.current) {
      api.updateScene({ elements: [...elements] as any });
      api.scrollToContent(undefined as any, { fitToContent: true, animate: true } as any);
    }
    prevLenRef.current = elements.length;
  }, [elements]);

  return (
    <div className="w-full h-full">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => { apiRef.current = api; }}
        initialData={{
          appState: {
            theme: 'dark',
            viewBackgroundColor: '#0f172a',
            currentItemStrokeColor: '#e2e8f0',
            currentItemBackgroundColor: '#a5d8ff',
          },
        }}
        theme="dark"
      />
    </div>
  );
}
