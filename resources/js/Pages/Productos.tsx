import { useState } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Search, Plus, Minus, Edit, Trash2, FolderPlus, X } from "lucide-react";
import { useToast } from "@/Hooks/use-toast";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

interface Product {
  id: number;
  barcode: string;
  description: string;
  category: string; // Campo agregado
  purchasePrice: number;
  salePrice: number;
  existence: number;
  minStock: number; // Usaremos minStock para el stock mínimo
}

export default function Productos() {
  const { toast } = useToast();
  
  // Datos de ejemplo
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      barcode: "1",
      description: "Pan Blanco Bimbo",
      category: "Panadería",
      purchasePrice: 15.00,
      salePrice: 20.00,
      existence: 20,
      minStock: 5,
    },
  ]);
  
  // Estados para diálogos
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Estados de búsqueda y selección
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
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
    category: "",
    purchasePrice: "",
    salePrice: "",
    existence: "", // Stock actual
    minStock: "",  // Stock mínimo
  });

  // Estado para EDITAR producto
  const [editingProduct, setEditingProduct] = useState({
    id: 0,
    barcode: "",
    description: "",
    category: "",
    purchasePrice: "",
    salePrice: "",
    existence: "",
    minStock: "",
  });

  // --- Lógica para Agregar ---
  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
  };

  const handleSaveProduct = () => {
    // Validación básica
    if (!newProduct.description || !newProduct.salePrice) {
        toast({ title: "Error", description: "Completa los campos obligatorios", variant: "destructive" });
        return;
    }

    const productToAdd: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        barcode: newProduct.barcode || "S/C",
        description: newProduct.description,
        category: newProduct.category || "General",
        purchasePrice: parseFloat(newProduct.purchasePrice) || 0,
        salePrice: parseFloat(newProduct.salePrice) || 0,
        existence: parseInt(newProduct.existence) || 0,
        minStock: parseInt(newProduct.minStock) || 0,
    };

    setProducts([...products, productToAdd]);
    setIsAddDialogOpen(false);
    setNewProduct({
      barcode: "",
      description: "",
      category: "",
      purchasePrice: "",
      salePrice: "",
      existence: "",
      minStock: "",
    });
    toast({ title: "Producto creado", description: "Se ha registrado correctamente" });
  };

  // --- Lógica para Editar ---
  const handleEditClick = (product: Product) => {
    setEditingProduct({
        id: product.id,
        barcode: product.barcode,
        description: product.description,
        category: product.category,
        purchasePrice: product.purchasePrice.toString(),
        salePrice: product.salePrice.toString(),
        existence: product.existence.toString(),
        minStock: product.minStock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    setProducts(products.map(p => 
        p.id === editingProduct.id ? {
            ...p,
            barcode: editingProduct.barcode,
            description: editingProduct.description,
            category: editingProduct.category,
            purchasePrice: Number(editingProduct.purchasePrice),
            salePrice: Number(editingProduct.salePrice),
            existence: Number(editingProduct.existence),
            minStock: Number(editingProduct.minStock),
        } : p
    ));
    setIsEditDialogOpen(false);
    toast({ title: "Producto actualizado", description: "Los cambios se guardaron correctamente" });
  };

  // --- Lógica de Stock (+/-) ---
  const handleIncreaseExistence = (productId: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, existence: p.existence + 1 } : p
    ));
    toast({ title: "Existencia aumentada" });
  };

  const handleDecreaseExistence = (productId: number) => {
    setProducts(products.map(p => 
      p.id === productId && p.existence > 0 ? { ...p, existence: p.existence - 1 } : p
    ));
    toast({ title: "Existencia reducida" });
  };

  // --- Lógica de Eliminación ---
  const handleDeleteProduct = (productId: number) => {
    setSelectedProductId(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (selectedProductId) {
      setProducts(products.filter(p => p.id !== selectedProductId));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido removido del inventario",
      });
      setIsDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  // --- Lógica de Categorías ---
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName("");
      toast({ title: "Categoría agregada" });
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
                    <TableHead>Categoría</TableHead>
                    <TableHead>P. compra</TableHead>
                    <TableHead>P. venta</TableHead>
                    <TableHead>Utilidad</TableHead>
                    <TableHead>Existencia</TableHead>
                    <TableHead>Stock Minimo</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.barcode}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>$ {product.purchasePrice.toFixed(2)}</TableCell>
                      <TableCell>$ {product.salePrice.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                         $ {(product.salePrice - product.purchasePrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={product.existence <= product.minStock ? "text-red-500 font-bold" : ""}>
                            {product.existence}
                        </span>
                      </TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* Botón MENOS */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDecreaseExistence(product.id)}
                          >
                            <Minus className="w-4 h-4 text-warning" />
                          </Button>
                          
                          {/* Botón MÁS */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleIncreaseExistence(product.id)}
                          >
                            <Plus className="w-4 h-4 text-info" />
                          </Button>

                          {/* Botón EDITAR */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4 text-warning" />
                          </Button>

                          {/* Botón ELIMINAR */}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
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
                  <Label htmlFor="stock">Existencia *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.existence}
                    onChange={(e) => setNewProduct({ ...newProduct, existence: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">Stock mínimo *</Label>
                  <Input
                    id="min-stock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
              <Label htmlFor="edit-stock">Existencia *</Label>
              <Input
                id="edit-stock"
                type="number"
                value={editingProduct.existence}
                onChange={(e) => setEditingProduct({ ...editingProduct, existence: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-min-stock">Stock mínimo *</Label>
              <Input
                id="edit-min-stock"
                type="number"
                value={editingProduct.minStock}
                onChange={(e) => setEditingProduct({ ...editingProduct, minStock: e.target.value })}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría</Label>
              <select
                id="edit-category"
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
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

        {/* --- DIALOGO 4: CONFIRMAR ELIMINACIÓN --- */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El producto será eliminado permanentemente del inventario.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
                CANCELAR
              </Button>
              <Button
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={confirmDeleteProduct}
              >
                ELIMINAR
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </MainLayout> 
  );
}