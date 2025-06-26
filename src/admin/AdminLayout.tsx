import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Mail, Megaphone, PlusSquare, Lightbulb } from 'lucide-react';

const AdminSidebar: React.FC = () => (
  <aside className="w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800">
    <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
    <nav className="flex flex-col space-y-2">
      <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Home className="w-5 h-5 mr-3" />
        Dashboard
      </Link>
      <h3 className="text-sm font-semibold mt-4 mb-2 px-2 text-gray-500">Submissions</h3>
      <Link to="/admin/submissions/contact" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Mail className="w-5 h-5 mr-3" />
        Contact
      </Link>
      <Link to="/admin/submissions/advertise" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Megaphone className="w-5 h-5 mr-3" />
        Advertise
      </Link>
      <Link to="/admin/submissions/tools" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <PlusSquare className="w-5 h-5 mr-3" />
        Tools
      </Link>
      <Link to="/admin/submissions/features" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <Lightbulb className="w-5 h-5 mr-3" />
        Features
      </Link>
    </nav>
  </aside>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 