import React, { useState } from 'react';
import { useRole, UserRole } from '../contexts/RoleContext';

const RoleSwitcher: React.FC = () => {
  const { currentUser, userRole, switchUserForDemo } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const roles: Array<{ value: UserRole; label: string; icon: string; color: string }> = [
    { value: 'customer', label: 'Zákazník', icon: '👤', color: 'bg-blue-100 text-blue-800' },
    { value: 'restaurant_owner', label: 'Majiteľ reštaurácie', icon: '🏪', color: 'bg-green-100 text-green-800' },
    { value: 'restaurant_employee', label: 'Zamestnanec', icon: '👨‍🍳', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', icon: '👨‍💼', color: 'bg-red-100 text-red-800' }
  ];

  const currentRole = roles.find(role => role.value === userRole);

  const handleRoleSwitch = (newRole: UserRole) => {
    switchUserForDemo(newRole);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current User Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <span className="text-lg">{currentRole?.icon}</span>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${currentRole?.color}`}>
            {currentRole?.label}
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide px-3 py-2 border-b">
              Demo - Prepnúť rolu
            </div>
            {roles.map(role => (
              <button
                key={role.value}
                onClick={() => handleRoleSwitch(role.value)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  userRole === role.value ? 'bg-foxi-orange-light text-foxi-orange' : ''
                }`}
              >
                <span className="text-lg">{role.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">{role.label}</div>
                  <div className="text-xs text-gray-500">
                    {role.value === 'customer' && 'Objednáva jedlo z reštaurácií'}
                    {role.value === 'restaurant_owner' && 'Vlastní a spravuje reštauráciu'}
                    {role.value === 'restaurant_employee' && 'Pracuje v reštaurácii'}
                    {role.value === 'admin' && 'Správca platformy'}
                  </div>
                </div>
                {userRole === role.value && (
                  <span className="text-foxi-orange">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RoleSwitcher;
