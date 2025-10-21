import { Construction } from 'lucide-react';

interface UnderConstructionProps {
  moduleName: string;
}

export default function UnderConstruction({ moduleName }: UnderConstructionProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Construction className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{moduleName}</h2>
        <p className="text-gray-600 text-lg">This module is under construction</p>
        <p className="text-gray-500 mt-2">Coming soon...</p>
      </div>
    </div>
  );
}
