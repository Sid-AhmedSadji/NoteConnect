
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { User, Settings, AlertCircleIcon } from 'lucide-react';
import Header from '@/components/Header';
import {User as MyUser} from 'models'
import { set } from 'date-fns';

const Profile = () => {
  const { authState, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  
  const [formData, setFormData] = React.useState({
    username: authState.user?.username || '',
    password: authState.user?.password || '',
    confirmPassword: authState.user?.password || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!MyUser.checkPassword(formData.password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.');
      return;
    }

    try {
      await updateProfile(formData);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally{
      setError(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
          {error && (
              <div className="bg-destructive/20 text-destructive-foreground p-3 rounded-md mb-4 flex items-center gap-2">
                <AlertCircleIcon size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="username">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="password">
                  password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder='********'
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  confirmer le mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  placeholder='********'
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button type="submit" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Mettre à jour le profil
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  Se déconnecter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
