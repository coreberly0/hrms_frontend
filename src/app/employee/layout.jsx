// employee/layout.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/employee/dashboard' },
    { name: 'Attendance', href: '/employee/attendance' },
    { name: 'Payroll', href: '/employee/payroll' },
    { name: 'Leave', href: '/employee/leave' },
    { name: 'Complaints', href: '/employee/complaints' },
    { name: 'Profile', href: '/employee/profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          backgroundColor: '#1C225B',
          color: '#edeef9',
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ marginBottom: '40px', fontSize: '22px' }}>Employee Portal</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {menuItems.map((item) => (
              <li key={item.name} style={{ marginBottom: '15px' }}>
                <Link
  href={item.href}
  style={{
    color: pathname === item.href ? '#edeef9' : '#b6bae4',
    backgroundColor: pathname === item.href ? '#394392' : 'transparent',
    textDecoration: 'none',
    display: 'block',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s',
  }}
  onMouseEnter={(e) => {
    if (pathname !== item.href) e.currentTarget.style.backgroundColor = '#2c326d';
  }}
  onMouseLeave={(e) => {
    if (pathname !== item.href) e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  {item.name}
</Link>

              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#edeef9' }}>
        {children}
      </main>
    </div>
  );
}
