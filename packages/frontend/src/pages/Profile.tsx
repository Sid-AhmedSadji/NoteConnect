import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { User, Settings, AlertCircleIcon } from 'lucide-react';
import Header from '@/components/Header';
import { User as MyUser } from '@noteconnect/models';

const Profile = () => {
  const { authState, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Initialisation du formulaire avec l'utilisateur
  useEffect(() => {
    if (authState.user) {
      setFormData({
        username: authState.user.username,
        password: '',
        confirmPassword: '',
      });
    }
  }, [authState.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePassword = (password: string) => {
    return MyUser.checkPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password && !validatePassword(formData.password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.');
      return;
    }

    try {
      await updateProfile({
        username: formData.username,
        password: formData.password || undefined, // ne pas envoyer password vide
      });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError('Impossible de mettre à jour le profil');
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
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
                  <label className="text-sm font-medium" htmlFor="username">Nom d'utilisateur</label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Votre nom d'utilisateur"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nouveau mot de passe (laisser vide si inchangé)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez le mot de passe"
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                  <Button type="submit" className="gap-2 flex-1">
                    <Settings className="h-4 w-4" />
                    Mettre à jour
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2 flex-1"
                  >
                    Se déconnecter
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
