import { Shield, Lock } from 'lucide-react';

export default function Logo() {
  return (
    <div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-4 text-indigo-700">
      {/* Outer Shield */}
      <Shield className="w-full h-full stroke-[1.5]" />
      {/* Inner Lock */}
      <Lock className="absolute w-6 h-6 stroke-2 mt-1" />
    </div>
  );
}