import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const FourHandleNode = ({ data }) => {
  // To allow connections from any side to any side, we render
  // both a source and a target handle at each position.
  // They will overlap visually, but this provides full flexibility.
  return (
    <div style={{ padding: 10, border: '1px solid black', borderRadius: 5, background: 'white' }}>
      {/* Top Handles */}
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="target" position={Position.Top} id="top-target" />

      {/* Right Handles */}
      <Handle type="source" position={Position.Right} id="right-source" />
      <Handle type="target" position={Position.Right} id="right-target" />

      {/* Bottom Handles */}
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
      <Handle type="target" position={Position.Bottom} id="bottom-target" />

      {/* Left Handles */}
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="target" position={Position.Left} id="left-target" />

      <div className="custom-drag-handle" style={{ cursor: 'grab' }}>{data.label}</div>
    </div>
  );
};

export default memo(FourHandleNode);
