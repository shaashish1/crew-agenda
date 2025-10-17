import { useState } from "react";
import { Plus, Trash2, Users, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskContext } from "@/contexts/TaskContext";
import { toast } from "sonner";

const Settings = () => {
  const { categories, owners, addCategory, deleteCategory, addOwner, deleteOwner } = useTaskContext();
  const [newCategory, setNewCategory] = useState("");
  const [newOwner, setNewOwner] = useState({ name: "", email: "" });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory);
      setNewCategory("");
      toast.success("Category added successfully");
    }
  };

  const handleAddOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOwner.name.trim()) {
      addOwner(newOwner);
      setNewOwner({ name: "", email: "" });
      toast.success("Owner added successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage categories and team members</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories" className="gap-2">
            <Tags className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="owners" className="gap-2">
            <Users className="w-4 h-4" />
            Owners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Category</CardTitle>
                <CardDescription>Create new task categories</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g., Bug Fix, Feature, Documentation"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
                <CardDescription>{categories.length} categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No categories yet
                    </p>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <span className="font-medium">{category.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            deleteCategory(category.id);
                            toast.success("Category deleted");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="owners">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Owner</CardTitle>
                <CardDescription>Add team members who can own tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddOwner} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Name *</Label>
                    <Input
                      id="owner-name"
                      value={newOwner.name}
                      onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email (optional)</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      value={newOwner.email}
                      onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Owner
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>{owners.length} owners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {owners.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No owners yet
                    </p>
                  ) : (
                    owners.map((owner) => (
                      <div
                        key={owner.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{owner.name}</p>
                          {owner.email && (
                            <p className="text-sm text-muted-foreground">{owner.email}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            deleteOwner(owner.id);
                            toast.success("Owner deleted");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
