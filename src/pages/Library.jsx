
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByKeyword, setSearchByKeyword] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);
      setBooks(parsedBooks);
      setFilteredBooks(parsedBooks);
    }
  }, []);

  useEffect(() => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchByKeyword) {
      filtered = filtered.filter(book =>
        book.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchByKeyword.toLowerCase())
        )
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, searchByKeyword, books]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Biblioteca</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por palabra clave..."
            value={searchByKeyword}
            onChange={(e) => setSearchByKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <a href={book.link} target="_blank" rel="noopener noreferrer">
                <CardContent className="p-0">
                  <img 
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {book.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </a>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Library;
