import IdeaManagement from "@/components/IdeaManagement";

const IdeasBoard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Ideas Board</h1>
        <p className="text-muted-foreground mt-2">
          Capture and manage innovative ideas for your projects
        </p>
      </div>
      <IdeaManagement />
    </div>
  );
};

export default IdeasBoard;
