import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart2, 
  MessageSquare,
  Settings, 
  Star, 
  History,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminNavbar = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Profile', icon: Users, path: '/profile' },
    { title: 'Order', icon: ShoppingCart, path: '/order' },
    { title: 'Product', icon: Package, path: '/product' },
    { title: 'Sales Report', icon: BarChart2, path: '/sales' },
    { title: 'Message', icon: MessageSquare, path: '/messages' },
    { title: 'Settings', icon: Settings, path: '/settings' },
    { title: 'Favourite', icon: Star, path: '/favourites' },
    { title: 'History', icon: History, path: '/history' }
  ];

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        />
      )}

      {/* Navbar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-gray-900 text-gray-300 p-4 z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:w-64
        ${isMobileMenuOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}
      `}>
        <div className="mb-8 mt-14 lg:mt-0">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full">
            Dashboard
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors
                ${activePage === item.title ? 'bg-gray-800 text-white' : ''}`}
              onClick={() => {
                setActivePage(item.title);
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-red-400 w-full mt-8">
            <LogOut className="w-5 h-5" />
            <span>Signout</span>
          </button>
        </nav>
      </div>

      {/* Main content spacer for larger screens */}
      <div className="hidden lg:block w-64" >
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
        <h1 className='text-lg'>Hello</h1>
      </div>
    </>
  );
};

export default AdminNavbar;