'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Konva Stage to completely prevent SSR / window issues
const DynamicStageCanvas = dynamic(() => import('./StageCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '1200px',
        height: '800px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      Initializing 3D Canvas Engine...
    </div>
  ),
});

export default function CanvasContainer(props) {
  return <DynamicStageCanvas {...props} />;
}
