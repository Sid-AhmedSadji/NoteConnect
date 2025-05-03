import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 glass-card rounded-xl note-shadow">
        <FileQuestionIcon size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Cette page n'existe pas
        </p>
        <Button asChild>
          <Link to="/">
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
