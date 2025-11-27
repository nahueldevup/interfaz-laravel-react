import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Search, Plus, Minus, Edit, Trash2, FolderPlus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

interface Product {
  id: number;
  barcode: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  unit: string;
  existence: number;
  stock: number;
}

export default function Productos() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      barcode: "1",
      description: "pan",
      purchasePrice: 20,
      salePrice: 20,
      unit: "$ 0.00",
      existence: 20,
      stock: 20,
    },
  ]);
  
  // Estados para diálogos
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // <--- NUEVO
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Estados de búsqueda y categorías
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<string[]>([
    "Bebidas",
    "Panadería",
    "Lácteos",
    "Carnes",
    "Frutas y Verduras",
  ]);

  // Estado para NUEVO producto
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    description: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    existence: "",
  });

  // Estado para EDITAR producto (Inicializado vacío)
  const [editingProduct, setEditingProduct] = useState({
    id: 0,
    barcode: "",
    description: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    existence: "",
  });

  // --- Lógica para Agregar ---
  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
  };

  const handleSaveProduct = () => {
    // Aquí iría router.post('/productos', newProduct)
    console.log("Guardando nuevo:", newProduct);
    setIsAddDialogOpen(false);
    setNewProduct({
      barcode: "",
      description: "",
      purchasePrice: "",
      salePrice: "",
      stock: "",
      existence: "",
    });
  };

  // --- Lógica para Editar (NUEVA) ---
  const handleEditClick = (product: Product) => {
    // Cargamos los datos del producto seleccionado en el estado de edición
    setEditingProduct({
        id: product.id,
        barcode: product.barcode,
        description: product.description,
        purchasePrice: product.purchasePrice.toString(),
        salePrice: product.salePrice.toString(),
        stock: product.stock.toString(),
        existence: product.existence.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    // Aquí iría router.put(`/productos/${editingProduct.id}`, editingProduct)
    console.log("Actualizando producto:", editingProduct);
    setIsEditDialogOpen(false);
  };

  // --- Lógica de Categorías ---
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName("");
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <MainLayout>
      <Head title="Productos" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Inventario" />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {/* Barra de búsqueda y botón categorías */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar un producto por su descripción o código de barras"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setIsCategoryDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FolderPlus className="w-5 h-5" />
                Categorías
              </Button>
            </div>

            {/* Tabla de Productos */}
            <div className="bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <span>←</span>
                  </Button>
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded">1</span>
                  <Button variant="ghost" size="sm">
                    <span>→</span>
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Código de barras</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>P. compra</TableHead>
                    <TableHead>P. venta</TableHead>
                    <TableHead>Utilidad</TableHead>
                    <TableHead>Existencia</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.barcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>$ {product.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>$ {product.salePrice.toFixed(2)}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>{product.existence}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Minus className="w-4 h-4 text-warning" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Plus className="w-4 h-4 text-info" />
                          </Button>
                          {/* BOTÓN EDITAR CON FUNCIONALIDAD AGREGADA */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4 text-warning" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="px-4 py-3 border-t border-border">
                <Button variant="link" className="text-primary">
                  Exportar o importar productos
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button */}
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg"
          onClick={handleAddProduct}
        >
          <Plus className="w-6 h-6" />
        </Button>

    {/* --- DIALOGO 1: AGREGAR PRODUCTO --- */}
<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Registrar producto</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barcode">Código de barras *</Label>
          <Input
            id="barcode"
            value={newProduct.barcode}
            onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
            placeholder="Código de barras"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Nombre del producto"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Descripción del producto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchase-price">Precio de compra *</Label>
          <Input
            id="purchase-price"
            type="number"
            step="0.01"
            value={newProduct.purchasePrice}
            onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sale-price">Precio de venta *</Label>
          <Input
            id="sale-price"
            type="number"
            step="0.01"
            value={newProduct.salePrice}
            onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="min-stock">Stock mínimo *</Label>
          <Input
            id="min-stock"
            type="number"
            value={newProduct.existence}
            onChange={(e) => setNewProduct({ ...newProduct, existence: e.target.value })}
            placeholder="5"
            defaultValue="5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sin categoría</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
        CERRAR
      </Button>
      <Button onClick={handleSaveProduct} className="bg-success hover:bg-success/90">
        GUARDAR
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* --- DIALOGO 2: EDITAR PRODUCTO --- */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Editar producto</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-barcode">Código de barras *</Label>
          <Input
            id="edit-barcode"
            value={editingProduct.barcode}
            onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
            placeholder="Código de barras"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nombre *</Label>
          <Input
            id="edit-name"
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            placeholder="Nombre del producto"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Descripción</Label>
        <Textarea
          id="edit-description"
          value={editingProduct.description}
          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
          placeholder="Descripción del producto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-purchase-price">Precio de compra *</Label>
          <Input
            id="edit-purchase-price"
            type="number"
            step="0.01"
            value={editingProduct.purchasePrice}
            onChange={(e) => setEditingProduct({ ...editingProduct, purchasePrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-sale-price">Precio de venta *</Label>
          <Input
            id="edit-sale-price"
            type="number"
            step="0.01"
            value={editingProduct.salePrice}
            onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-stock">Stock *</Label>
          <Input
            id="edit-stock"
            type="number"
            value={editingProduct.stock}
            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-min-stock">Stock mínimo *</Label>
          <Input
            id="edit-min-stock"
            type="number"
            value={editingProduct.existence}
            onChange={(e) => setEditingProduct({ ...editingProduct, existence: e.target.value })}
            placeholder="5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-category">Categoría</Label>
          <select
            id="edit-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sin categoría</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
        CERRAR
      </Button>
      <Button onClick={handleUpdateProduct} className="bg-success hover:bg-success/90">
        GUARDAR
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        

        {/* --- DIALOGO 3: CATEGORÍAS --- */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gestionar Categorías</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categoría..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Nueva categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="bg-success hover:bg-success/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    {categorySearch ? "No se encontraron categorías" : "No hay categorías"}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredCategories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
                      >
                        <span className="font-medium">{category}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCategoryDialogOpen(false)}>
                CERRAR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout> 
  );
}