


import React from 'react';
import { AspectId, AspectProgress, PipelineStatus } from '../../types.ts';
import ProgressDisplayItem from './ProgressDisplayItem.tsx';

interface ProgressDisplayProps {
  title: string;
  description: string;
  aspects: AspectProgress[];
  onDownloadAspect: (aspect: AspectProgress) => void;
  onToggleAspect: (id: AspectId) => void;
  onSaveEdit: (id: AspectId, newOutput: string) => void;
  pipelineStatus: PipelineStatus;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ 
  title,
  description,
  aspects, 
  onDownloadAspect,
  onToggleAspect, 
  onSaveEdit, 
  pipelineStatus
}) => {
  
  if (!aspects || aspects.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 space-y-4 border border-gray-700/80 rounded-lg p-6 relative">
      <div>
        <h3 className="text-xl font-semibold text-indigo-300 mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        <div className="space-y-3">
          {aspects.map((aspect) => (
            <ProgressDisplayItem
                key={aspect.id}
                aspect={aspect}
                onDownload={() => onDownloadAspect(aspect)}
                onToggle={() => onToggleAspect(aspect.id)}
                onSaveEdit={onSaveEdit}
                pipelineStatus={pipelineStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;