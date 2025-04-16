
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Book, Search, Plus, X } from "lucide-react";

const AdminLibrary = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    imageUrl: "",
    link: "",
    keywords: "",
  });

  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const handleSave = () => {
    if (!newBook.title || !newBook.imageUrl || !newBook.link || !newBook.keywords) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const updatedBooks = [...books, {
      id: Date.now(),
      ...newBook,
      keywords: newBook.keywords.split(',').map(k => k.trim().toLowerCase())
    }];

    setBooks(updatedBooks);
    localStorage.setItem("libraryBooks", JSON.stringify(updatedBooks));

    setNewBook({
      title: "",
      imageUrl: "",
      link: "",
      keywords: "",
    });

    toast({
      title: "Libro agregado",
      description: "El libro ha sido agregado correctamente",
    });
  };

  const handleDelete = (bookId) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
    localStorage.setItem("libraryBooks", JSON.stringify(updatedBooks));

    toast({
      title: "Libro eliminado",
      description: "El libro ha sido eliminado correctamente",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestión de Biblioteca</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-6 w-6" />
              Agregar Nuevo Libro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título del Libro</label>
                <Input
                  placeholder="Nombre del libro"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL de la Imagen</label>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={newBook.imageUrl}
                  onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enlace del Libro</label>
                <Input
                  placeholder="https://ejemplo.com/libro"
                  value={newBook.link}
                  onChange={(e) => setNewBook({ ...newBook, link: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Palabras Clave</label>
                <Input
                  placeholder="trading, forex, análisis (separadas por comas)"
                  value={newBook.keywords}
                  onChange={(e) => setNewBook({ ...newBook, keywords: e.target.value })}
                  className="bg-gray-800"
                />
                <p className="text-sm text-gray-400">
                  Separa las palabras clave con comas
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cargar Libro
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Libros Disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {books.map(book => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-400">
                      Keywords: {book.keywords.join(", ")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(book.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLibrary;
