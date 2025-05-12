
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption, FilterOption } from '@/types';
import { SearchIcon, ArrowUpDownIcon, FilterIcon, RotateCcwIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNotes } from '@/contexts/NotesContext';

const SearchAndFilterBar: React.FC = () => {
  const {
    sortOption,
    filterOption,
    searchQuery,
    isLoading,
    setSortOption,
    setFilterOption,
    setSearchQuery,
    recalculateNotes,
  } = useNotes();

  return (
    <div className="w-full bg-secondary/30 rounded-lg p-3 mb-6 backdrop-blur-sm border border-border/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou lien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/20"
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div className="flex gap-2 flex-wrap md:flex-nowrap items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDownIcon size={16} className="text-muted-foreground" />
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-32 bg-background/50 border-border/20">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <FilterIcon size={16} className="text-muted-foreground" />
            <Select
              value={filterOption}
              onValueChange={(value) => setFilterOption(value as FilterOption)}
            >
              <SelectTrigger className="w-32 bg-background/50 border-border/20">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="liked">Favorites</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="dead">Archivées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-8 hidden md:block mx-2" />

          <Button 
            variant="secondary" 
            onClick={recalculateNotes} 
            disabled={isLoading}
            className="bg-accent/20 text-accent-foreground hover:bg-accent/30"
          >
            <RotateCcwIcon size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Recalculer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
