\import { NavBar } from '@/components/NavBar';
import { Outlet } from 'react-router-dom';
import { Home } from './Home';

function Layout() {
  return (
    <div className="app-container">
      <NavBar variant='home' />

      <main className="main-content">
            <Home />
        <Outlet />
      </main>
    </div>
