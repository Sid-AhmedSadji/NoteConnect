import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  HeartIcon,
  Trash2Icon,
  LinkIcon,
  EditIcon,
  CheckIcon,
  XIcon,
  SkullIcon
} from 'lucide-react';
import { Note } from '@noteconnect/models';
import { formatDistanceToNow } from 'date-fns';
import { da, fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { link } from 'fs';

interface NoteCardProps {
  note: Note;
  UpdateNote: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, UpdateNote, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [linkValue, setLinkValue] = useState(note.link);
  const [nameValue, setNameValue] = useState(note.name);

  const handleSave = () => {
    const updatedNote = note.updateNote({ link: linkValue, name: nameValue });
    UpdateNote(updatedNote);
    setIsEditing(false);
};


  const handleCancel = () => {
    setLinkValue(note.link);
    setNameValue(note.name);
    setIsEditing(false);
  };

  const handleToggleLiked = () => {
    const updatedNote = new Note({ ...note, liked: !note.liked });
    UpdateNote(updatedNote);
  };

  const handleToggleIsDead = () => {
    const updatedNote = new Note({ ...note, isDead: !note.isDead });
    UpdateNote(updatedNote);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <Card className={`glass-card note-shadow transition-all duration-200 hover:shadow-lg ${note.isDead ? 'opacity-70' : 'opacity-100'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="h-8 text-sm"
              />
            ) : (
              <h3
                className="text-lg font-semibold text-foreground truncate block"
                title={note.name}
              >
                {note.name}
              </h3>
            )}
          </div>
          <div className="flex gap-1 ml-2">
          <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleLiked}
            >
              <HeartIcon
                size={18}
                className={`transition-colors ${
                  note.liked
                    ? 'fill-note-liked text-note-liked'
                    : 'fill-muted-foreground text-muted-foreground'
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleIsDead}
            >
              <SkullIcon
                size={18}
                color ={note.isDead ?  '#DBC223' : '#94A3B8'}

              />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2Icon size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(note._id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-2">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                className="flex-1 h-8 text-sm"
                onFocus={(e) => e.target.select()}
              />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}>
                <CheckIcon size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
                <XIcon size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <LinkIcon size={14} />
              <a
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary transition-colors max-w-[200px]"
                title={note.link}
              >
                {note.link}
              </a>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setIsEditing(true)}>
                <EditIcon size={14} />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Badge variant="outline" className="bg-accent/30 text-accent-foreground">
            Note: {note.note}/100
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(note.date)}
          </span>
        </div>

        {note.modificationCount > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {note.modificationCount} modification{note.modificationCount > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
