'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva';

export default function StageCanvas({
  stageRef,
  elements,
  selectedId,
  onSelect,
  onUpdateElement,
  onCommitChange,
  width = 1200,
  height = 800,
  backgroundColor = '#ffffff',
  zoom = 1,
}) {
  const trRef = useRef(null);
  const shapeRefs = useRef({});

  // Sync Transformer to selected shape
  useEffect(() => {
    if (!trRef.current) return;
    const selectedShape = selectedId ? shapeRefs.current[selectedId] : null;

    if (selectedShape) {
      trRef.current.nodes([selectedShape]);
      trRef.current.getLayer().batchDraw();
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, elements]);

  const handleStageClick = (e) => {
    // If clicked on empty stage area or stage background
    if (e.target === e.target.getStage() || e.target.name() === 'canvas-bg') {
      onSelect(null);
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={width * zoom}
      height={height * zoom}
      scaleX={zoom}
      scaleY={zoom}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      {/* Background layer */}
      <Layer>
        <Rect
          name="canvas-bg"
          x={0}
          y={0}
          width={width}
          height={height}
          fill={backgroundColor}
          listening={true}
        />
      </Layer>

      {/* Elements layer */}
      <Layer>
        {elements.map((el) => {
          if (el.isVisible === false) return null;

          const isSelected = el.id === selectedId;
          const isDraggable = !el.isLocked;

          if (el.type === 'rect') {
            return (
              <Rect
                key={el.id}
                ref={(node) => {
                  if (node) shapeRefs.current[el.id] = node;
                  else delete shapeRefs.current[el.id];
                }}
                id={el.id}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                rotation={el.rotation || 0}
                fill={el.fill}
                stroke={el.strokeWidth > 0 ? el.stroke : undefined}
                strokeWidth={el.strokeWidth || 0}
                opacity={el.opacity !== undefined ? el.opacity : 1}
                draggable={isDraggable}
                cornerRadius={el.cornerRadius || 0}
                onClick={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onDragEnd={(e) => {
                  onCommitChange(el.id, {
                    x: Math.round(e.target.x()),
                    y: Math.round(e.target.y()),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  // Reset scale to 1 and update width & height
                  node.scaleX(1);
                  node.scaleY(1);

                  onCommitChange(el.id, {
                    x: Math.round(node.x()),
                    y: Math.round(node.y()),
                    width: Math.max(5, Math.round(node.width() * scaleX)),
                    height: Math.max(5, Math.round(node.height() * scaleY)),
                    rotation: Math.round(node.rotation()) % 360,
                  });
                }}
              />
            );
          }

          if (el.type === 'circle') {
            return (
              <Circle
                key={el.id}
                ref={(node) => {
                  if (node) shapeRefs.current[el.id] = node;
                  else delete shapeRefs.current[el.id];
                }}
                id={el.id}
                x={el.x}
                y={el.y}
                radius={el.radius || 50}
                rotation={el.rotation || 0}
                fill={el.fill}
                stroke={el.strokeWidth > 0 ? el.stroke : undefined}
                strokeWidth={el.strokeWidth || 0}
                opacity={el.opacity !== undefined ? el.opacity : 1}
                draggable={isDraggable}
                onClick={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onDragEnd={(e) => {
                  onCommitChange(el.id, {
                    x: Math.round(e.target.x()),
                    y: Math.round(e.target.y()),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);

                  onCommitChange(el.id, {
                    x: Math.round(node.x()),
                    y: Math.round(node.y()),
                    radius: Math.max(5, Math.round(node.radius() * scaleX)),
                    rotation: Math.round(node.rotation()) % 360,
                  });
                }}
              />
            );
          }

          if (el.type === 'text') {
            return (
              <Text
                key={el.id}
                ref={(node) => {
                  if (node) shapeRefs.current[el.id] = node;
                  else delete shapeRefs.current[el.id];
                }}
                id={el.id}
                x={el.x}
                y={el.y}
                text={el.text || 'Double click or edit text'}
                fontSize={el.fontSize || 24}
                fontFamily={el.fontFamily || 'Plus Jakarta Sans'}
                fontStyle={`${el.fontStyle || 'normal'} ${el.fontWeight || 'normal'}`.trim()}
                align={el.align || 'left'}
                fill={el.fill || '#0f172a'}
                stroke={el.strokeWidth > 0 ? el.stroke : undefined}
                strokeWidth={el.strokeWidth || 0}
                opacity={el.opacity !== undefined ? el.opacity : 1}
                rotation={el.rotation || 0}
                draggable={isDraggable}
                onClick={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  onSelect(el.id);
                }}
                onDragEnd={(e) => {
                  onCommitChange(el.id, {
                    x: Math.round(e.target.x()),
                    y: Math.round(e.target.y()),
                  });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  node.scaleX(1);
                  node.scaleY(1);

                  onCommitChange(el.id, {
                    x: Math.round(node.x()),
                    y: Math.round(node.y()),
                    fontSize: Math.max(10, Math.round(node.fontSize() * scaleX)),
                    rotation: Math.round(node.rotation()) % 360,
                  });
                }}
              />
            );
          }

          return null;
        })}

        {/* Konva Transformer */}
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Prevent negative sizing
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
          anchorFill="#ffffff"
          anchorStroke="#6366f1"
          anchorStrokeWidth={2}
          anchorSize={10}
          anchorCornerRadius={3}
          borderStroke="#6366f1"
          borderStrokeWidth={1.5}
          borderDash={[4, 4]}
          rotateAnchorOffset={24}
          padding={4}
        />
      </Layer>
    </Stage>
  );
}
