// src/components/Admin/AdminSettings.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Store, 
  Mail, 
  CreditCard, 
  Truck, 
  Bell, 
  Shield,
  Palette,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const dispatch = useDispatch();
  // Aquí obtendrías la configuración actual desde Redux
  const [activeTab, setActiveTab] = useState('general');

  // Estados para cada sección de configuración
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'Vintacci',
    storeEmail: 'info@vintacci.com',
    phoneNumber: '+54 11 1234-5678',
    address: 'Calle Principal 123',
    currency: 'ARS',
    language: 'es'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    senderName: 'Vintacci',
    senderEmail: 'noreply@vintacci.com'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    mercadoPagoEnabled: true,
    mercadoPagoApiKey: '',
    mercadoPagoAccessToken: '',
    cashOnDelivery: true,
    bankTransfer: true
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 10000,
    defaultShippingCost: 500,
    localPickupEnabled: true,
    shippingZones: [
      { name: 'CABA', cost: 500 },
      { name: 'GBA', cost: 800 },
      { name: 'Interior', cost: 1200 }
    ]
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    shippingUpdate: true,
    abandonedCart: true,
    stockAlerts: true,
    newsletterEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    logoUrl: '/logo.png',
    favicon: '/favicon.ico'
  });

  // Manejadores para cada tipo de configuración
  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    // Aquí implementarías la lógica para guardar en backend/redux
    toast.success('Configuración guardada exitosamente');
  };

  // Componente para cada sección de configuración
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configuración General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={generalSettings.storeName}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email de la Tienda
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={generalSettings.storeEmail}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={generalSettings.phoneNumber}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Moneda
                </label>
                <select
                  name="currency"
                  value={generalSettings.currency}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option value="ARS">Peso Argentino (ARS)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Idioma
                </label>
                <select
                  name="language"
                  value={generalSettings.language}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configuración de Pagos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">MercadoPago</h4>
                  <p className="text-sm text-gray-600">Configura los pagos con MercadoPago</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={paymentSettings.mercadoPagoEnabled}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      mercadoPagoEnabled: e.target.checked
                    }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {paymentSettings.mercadoPagoEnabled && (
                <div className="ml-4 space-y-4">
                  <input
                    type="text"
                    placeholder="API Key"
                    value={paymentSettings.mercadoPagoApiKey}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      mercadoPagoApiKey: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Access Token"
                    value={paymentSettings.mercadoPagoAccessToken}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      mercadoPagoAccessToken: e.target.value
                    }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
              {/* Otros métodos de pago... */}
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configuración de Envíos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Envío Gratis a partir de
                </label>
                <input
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings(prev => ({
                    ...prev,
                    freeShippingThreshold: e.target.value
                  }))}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Zonas de Envío</h4>
                {shippingSettings.shippingZones.map((zone, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <input
                      type="text"
                      value={zone.name}
                      className="flex-1 p-2 border rounded-md"
                      readOnly
                    />
                    <input
                      type="number"
                      value={zone.cost}
                      className="w-32 p-2 border rounded-md"
                      onChange={(e) => {
                        const newZones = [...shippingSettings.shippingZones];
                        newZones[index].cost = e.target.value;
                        setShippingSettings(prev => ({
                          ...prev,
                          shippingZones: newZones
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // Otros casos para las demás pestañas...
      
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Pagos', icon: CreditCard },
    { id: 'shipping', label: 'Envíos', icon: Truck },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette }
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar de navegación */}
      <div className="w-64 bg-white rounded-lg shadow-sm p-4">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
        {renderTabContent()}
        
        {/* Botón guardar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="mr-2 h-5 w-5" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;