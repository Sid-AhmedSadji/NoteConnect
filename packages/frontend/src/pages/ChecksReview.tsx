import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { CheckIcon, XIcon } from 'lucide-react';
import { Check } from '@noteconnect/models';
import axiosInstance from '../api/axiosInstance'; // <-- ton axios config
import NoteApi from '../api/NoteApi';


type SuccessStatus = 'success' | 'moderate-link-fail' | 'moderate-chap-fail' | 'fail';

const ChecksReview = () => {
  const { toast } = useToast();

  const [checks, setChecks] = useState<Check[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChecks = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/checks/pending'); // <- axios
        setChecks(response.data);
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible de charger les checks",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChecks();
  }, [toast]);

  const currentCheck = checks[index];

  const nextCheck = () => {
    setIndex(prev => prev + 1);
  };

  const handleValidate = async (status: SuccessStatus) => {
    if (!currentCheck) return;

    try {
      await axiosInstance.post(`/checks/validate/${currentCheck._id}`, {
        success: status,
      });

      toast({
        title: "Mis à jour",
        description: "Le check a été mis à jour",
      });

      nextCheck();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!currentCheck) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="shadow-lg w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Plus de checks à valider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                Tu as terminé tous les checks disponibles.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="shadow-lg w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Check {index + 1} / {checks.length}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <div><b>URL :</b> <a href={currentCheck.url} target="_blank" rel="noopener noreferrer">{currentCheck.url}</a></div>
              <div><b>Domaine :</b> {currentCheck.domain}</div>
              <div><b>Chap : </b> {currentCheck.chapter}</div>
              <div><b>Méthode :</b> {currentCheck.method}</div>
              <div><b>Auto success :</b> {currentCheck.success ?? 'null'}</div>
              <div><b>Mort :</b> {currentCheck.isDead ? 'Oui' : 'Non'}</div>
              <div><b>Durée :</b> {currentCheck.durationMs} ms</div>
              <div><b>Créé le :</b> {new Date(currentCheck.createdAt).toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="gap-2" onClick={() => handleValidate('success')}>
                <CheckIcon className="h-4 w-4" />
                Success
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleValidate('moderate-link-fail')}
              >
                Link fail
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleValidate('moderate-chap-fail')}
              >
                Chap fail
              </Button>

              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => handleValidate('fail')}
              >
                Fail
              </Button>
            </div>

            <Button 
              variant="outline"
              onClick={ async () => { await NoteApi.pingNotes(); }}
              className="mt-4 w-full"
            >
               refresh Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChecksReview;
