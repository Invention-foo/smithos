import React, { useState } from 'react';
import { X, File } from 'lucide-react';
import { securityRecords } from '@/data/security-records';
import type { SecurityRecord } from '@/types/security-records';
import { ModalWrapper } from '@/components/modal-wrapper';

interface DocumentsModalProps {
  onClose: () => void;
}

export function DocumentsModal({ onClose }: DocumentsModalProps) {
  const [selectedDocument, setSelectedDocument] = useState<SecurityRecord | null>(null);
  const [filter, setFilter] = useState<'ALL' | SecurityRecord['severity']>('ALL');

  const documents: SecurityRecord[] = securityRecords.records;

  const getSeverityColor = (severity: SecurityRecord['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-green-500';
    }
  };

  const filteredDocuments = documents.filter(doc => 
    filter === 'ALL' ? true : doc.severity === filter
  );

  return (
    <ModalWrapper onClose={onClose} className="bg-gray-900 border border-green-500 p-6 rounded-lg w-4/5 h-4/5 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl text-green-500 font-mono">[SECURITY_RECORDS]</h2>
          <div className="ml-4 flex gap-2">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setFilter(severity as SecurityRecord['severity'])}
                className={`px-2 py-1 rounded ${
                  filter === severity ? 'bg-green-800' : 'bg-gray-800'
                } text-xs font-mono`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 overflow-y-auto pr-4 border-r border-green-700">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`flex flex-col p-3 cursor-pointer border-l-4 ${
                selectedDocument?.id === doc.id ? 'bg-gray-800' : ''
              } hover:bg-gray-800 mb-2 ${
                `border-${getSeverityColor(doc.severity).split('-')[1]}`
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-center">
                <File className="mr-2 text-green-500" size={16} />
                <span className={`${getSeverityColor(doc.severity)} font-mono text-sm`}>
                  {doc.title}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono">
                {doc.timestamp} | {doc.status}
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 pl-4 overflow-y-auto">
          {selectedDocument ? (
            <div className="font-mono">
              <h3 className={`text-xl ${getSeverityColor(selectedDocument.severity)} mb-4`}>
                {selectedDocument.title}
              </h3>
              <pre className="text-green-300 whitespace-pre-wrap bg-black bg-opacity-50 p-4 rounded">
                {selectedDocument.content}
              </pre>
            </div>
          ) : (
            <div className="text-green-500 flex items-center justify-center h-full font-mono">
              <span className="animate-pulse">&gt; SELECT_RECORD_TO_VIEW_DETAILS</span>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

