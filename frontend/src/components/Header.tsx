
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOutIcon, UserIcon } from 'lucide-react';
import {Link} from 'react-router-dom';
const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  return (
    <header className="w-full py-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" to="/">
            NoteConnect
          </Link>
          <div className="h-6 w-px bg-border mx-4" />
          <span className="text-sm text-muted-foreground">Votre vault de notes</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <Link className="flex items-center gap-2 text-sm text-muted-foreground" to="/profile">
              <UserIcon size={14} />
              <span>{user.username}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOutIcon size={16} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
