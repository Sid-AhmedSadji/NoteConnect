import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { CheckIcon } from 'lucide-react';
import { Check } from '@noteconnect/models';
import NoteApi from '@/api/NoteApi';
import CheckApi from '@/api/CheckApi';

type SuccessStatus = 'success' | 'moderate-link-fail' | 'moderate-chap-fail' | 'fail';

const statusColors: Record<SuccessStatus | 'null', string> = {
  success: 'bg-green-500',
  'moderate-link-fail': 'bg-yellow-500',
  'moderate-chap-fail': 'bg-orange-500',
  fail: 'bg-red-500',
  null: 'bg-gray-300',
};

const ChecksReview = () => {
  const { toast } = useToast();

  const [checks, setChecks] = useState<Check[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtres
  const [statusFilter, setStatusFilter] = useState<SuccessStatus | 'all'>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  useEffect(() => {
    const fetchChecks = async () => {
      setLoading(true);
      try {
        const response = await CheckApi.getChecks();
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

  const filteredChecks = checks.filter(check => {
    const statusMatch = statusFilter === 'all' || check.success === statusFilter || (statusFilter === 'null' && check.success === null);
    const domainMatch = domainFilter === 'all' || check.domain === domainFilter;
    return statusMatch && domainMatch;
  });

  const currentCheck = filteredChecks[selectedIndex];

  const handleValidate = async (status: SuccessStatus) => {
    if (!currentCheck) return;

    try {
      await CheckApi.validateCheck({ id: currentCheck._id, success: status });

      toast({ title: "Mis à jour", description: "Le check a été mis à jour" });

      // Mettre à jour localement le statut
      setChecks(prev =>
        prev.map(c => (c._id === currentCheck._id ? { ...c, success: status } : c))
      );
      // Passer au check suivant
      statusFilter === 'all' && setSelectedIndex(prev => (prev + 1 < filteredChecks.length ? prev + 1 : prev));
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de mettre à jour",
        variant: "destructive"
      });
    }
  };

  const domains = Array.from(new Set(checks.map(c => c.domain)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">Chargement...</div>
      </div>
    );
  }

  return (
<div className="flex flex-col h-screen bg-background text-foreground">
  <Header />

  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar gauche */}
    <div className="w-1/3 border-r border-muted flex flex-col overflow-y-auto">
      {/* Filtres */}
      <div className="p-4 space-y-2 border-b flex-shrink-0">
        <div>
          <label className="block text-sm font-medium  ">Status :</label>
          <select
            className="w-full mt-1 border rounded p-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as SuccessStatus | 'all')}
          >
            <option className='text-black' value="all">Tous</option>
            <option className='text-black' value="success">Success</option>
            <option className='text-black' value="moderate-link-fail">Link fail</option>
            <option className='text-black' value="moderate-chap-fail">Chap fail</option>
            <option className='text-black' value="fail">Fail</option>
            <option className='text-black' value="null">pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Domaine :</label>
          <select
            className="w-full mt-1 border rounded p-1"
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
          >
            <option className='text-black' value="all">Tous</option>
            {domains.map(d => (
              <option className='text-black' key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des checks */}
      <div className="flex-1 overflow-y-auto">
        {filteredChecks.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">Aucun check</div>
        )}

        {filteredChecks.map((check, i) => (
          <div
            key={check._id}
            onClick={() => setSelectedIndex(i)}
            className={`p-4 cursor-pointer border-b hover:bg-muted/10 flex items-center justify-between ${
              i === selectedIndex ? 'bg-muted/20 font-bold' : ''
            }`}
          >
            <div className="truncate">{check.name}</div>
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                statusColors[check.success ?? 'null']
              }`}
            ></span>
          </div>
        ))}
      </div>
    </div>

    {/* Détail du check */}
    <div className="flex-1 p-6 overflow-auto">
      {currentCheck ? (
        <Card className="shadow-lg w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Check {selectedIndex + 1} / {filteredChecks.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <div><b>URL :</b> <a href={currentCheck.url} target="_blank" rel="noopener noreferrer">{currentCheck.url}</a></div>
              <div><b>Domaine :</b> {currentCheck.domain}</div>
              <div><b>Chap :</b> {currentCheck.chapter}</div>
              <div><b>Méthode :</b> {currentCheck.method}</div>
              <div><b>Auto success :</b> {currentCheck.success ?? 'null'}</div>
              <div><b>Mort :</b> {currentCheck.isDead ? 'Oui' : 'Non'}</div>
              <div><b>Durée :</b> {currentCheck.durationMs} ms</div>
              <div><b>Créé le :</b> {new Date(currentCheck.createdAt).toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="gap-2" onClick={() => handleValidate('success')}>
                <CheckIcon className="h-4 w-4" /> Success
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleValidate('moderate-link-fail')}>
                Link fail
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleValidate('moderate-chap-fail')}>
                Chap fail
              </Button>
              <Button variant="destructive" className="gap-2" onClick={() => handleValidate('fail')}>
                Fail
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={async () => { await CheckApi.actualiseCheck( {id: currentCheck._id} ); }}
              className="mt-4 w-full"
            >
              Refresh this Check
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Plus de checks à valider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">Tu as terminé tous les checks disponibles.</div>
            <Button
              variant="outline"
              onClick={async () => { await NoteApi.pingNotes(); }}
              className="w-full"
            >
              Refresh Checks
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
</div>

  );
};

export default ChecksReview;
