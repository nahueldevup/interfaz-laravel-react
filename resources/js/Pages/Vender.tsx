import { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Header } from "@/Components/Header";
import { useToast } from "@/Hooks/use-toast"; 
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  DollarSign, 
  X, 
  User, 
  CreditCard, 
  Banknote,
  Phone,
  Save,
  UserPlus
} from "lucide-react";

// --- Interfaces para TypeScript ---
interface Product {
  id: number;
  barcode: string;
  description: string;
  salePrice: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
  price: number; 
}

interface Customer {
    name: string;
    phone?: string;
}

// --- Componentes Auxiliares ---

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="group relative flex flex-col items-center p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="w-14 h-14 mb-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm">
        {product.description.charAt(0).toUpperCase()}
      </div>
      <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2 mb-1 leading-tight">
        {product.description}
      </p>
      <p className="text-lg font-bold text-blue-600">${product.salePrice.toFixed(2)}</p>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-600 rounded-full p-1 shadow-md">
            <Plus className="w-4 h-4 text-white" />
        </div>
      </div>
    </button>
  );
}

function CartItemRow({ 
  item, 
  onIncrease, 
  onDecrease, 
  onRemove 
}: { 
  item: CartItem; 
  onIncrease: (id: number) => void; 
  onDecrease: (id: number) => void; 
  onRemove: (id: number) => void; 
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate text-sm">{item.description}</p>
        <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:border-red-500 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        
        <span className="w-8 text-center font-bold text-sm tabular-nums">{item.quantity}</span>
        
        <button
          onClick={() => onIncrease(item.id)}
          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:border-green-500 hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex flex-col items-end gap-1 min-w-[60px]">
        <p className="font-bold text-sm text-gray-800">${item.total.toFixed(2)}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PaymentMethodButton({ 
  icon: Icon, 
  label, 
  isSelected, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
          : "border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-600"
      }`}
    >
      <Icon className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

// --- Componente Principal ---

export default function Vender() {
  const { toast } = useToast();
  
  // Productos de ejemplo
  const [allProducts] = useState<Product[]>([
    { id: 1, barcode: "1", description: "Pan Blanco", salePrice: 20, stock: 50 },
    { id: 2, barcode: "2", description: "Leche Entera 1L", salePrice: 45, stock: 30 },
    { id: 3, barcode: "3", description: "Huevos 12 pzs", salePrice: 60, stock: 25 },
    { id: 4, barcode: "4", description: "Azúcar 1kg", salePrice: 35, stock: 40 },
    { id: 5, barcode: "5", description: "Arroz 1kg", salePrice: 25, stock: 35 },
    { id: 6, barcode: "6", description: "Frijol 1kg", salePrice: 30, stock: 20 },
    { id: 7, barcode: "7", description: "Aceite 1L", salePrice: 55, stock: 15 },
    { id: 8, barcode: "8", description: "Pasta 500g", salePrice: 18, stock: 45 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([
     { id: 1, barcode: "1", description: "Pan Blanco", quantity: 1, price: 20, total: 20, salePrice: 20, stock: 50 }
  ]);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Estados para clientes
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [customerSearch, setCustomerSearch] = useState(""); // Nuevo estado para búsqueda de clientes

  // Filtrar productos
  const filteredProducts = allProducts.filter((product) =>
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  // Totales
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal;
  const payment = parseFloat(amountReceived) || 0;
  const change = payment - total;

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // F9 para cobrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9" && cartItems.length > 0 && !showCheckout) {
        e.preventDefault();
        setShowCheckout(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartItems.length, showCheckout]);


  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          price: product.salePrice,
          total: product.salePrice,
        },
      ]);
    }
    
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return {
                ...item,
                quantity: newQuantity,
                total: newQuantity * item.price
            }
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    toast({
        description: "Producto eliminado del carrito",
        duration: 1500,
    });
  };

  const clearCart = () => {
    if (confirm("¿Realmente desea vaciar el carrito?")) {
      setCartItems([]);
      setSearchQuery("");
      setShowCheckout(false);
      setAmountReceived("");
      searchInputRef.current?.focus();
    }
  };

  const handleCreateCustomer = () => {
      if(!newCustomerName.trim()) {
          toast({ title: "Error", description: "El nombre del cliente es obligatorio", variant: "destructive" });
          return;
      }
      
      const newCustomer = { name: newCustomerName, phone: newCustomerPhone };
      setSelectedCustomer(newCustomer);
      setIsCreatingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setCustomerSearch(""); // Limpiar búsqueda
      
      toast({ 
          title: "Cliente Agregado", 
          description: `${newCustomer.name} ha sido seleccionado.`,
          className: "bg-blue-500 text-white border-none"
      });
  };

  const handleRemoveCustomer = () => {
      setSelectedCustomer(null);
      setCustomerSearch("");
  };

  const completeSale = () => {
    if (paymentMethod === "cash" && payment < total) {
      toast({
        title: "Error",
        description: "El monto recibido es insuficiente",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Venta Exitosa!",
      description: `Cliente: ${selectedCustomer ? selectedCustomer.name : 'Mostrador'} - Cambio: $${change.toFixed(2)}`,
      className: "bg-green-500 text-white border-none",
    });

    setCartItems([]);
    setShowCheckout(false);
    setAmountReceived("");
    setPaymentMethod("cash");
    setSelectedCustomer(null);
    setCustomerSearch("");
    searchInputRef.current?.focus();
  };

  return (
    <MainLayout>
      <Head title="Vender" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title="Punto de Venta" subtitle="Nueva Venta" />

        <div className="flex-1 flex overflow-hidden">
          {/* Panel Izquierdo - Catálogo */}
          <div className="flex-1 flex flex-col bg-gray-50/50 border-r border-gray-200">
            {/* Buscador */}
            <div className="p-4 bg-white border-b border-gray-100 shadow-sm z-10">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Escanear código o buscar producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {/* Grid Productos */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 opacity-60">
                  <Search className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">No se encontraron productos</p>
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho - Carrito */}
          <div className="w-[380px] lg:w-[450px] bg-white flex flex-col shadow-xl z-20 rounded-t-xl overflow-hidden">
            {/* Header Carrito */}
            <div className="p-4 bg-blue-600 text-white shadow-md" >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h2 className="font-bold text-lg">Carrito de Venta</h2>
                </div>
                <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  {cartItems.length} items
                </span>
              </div>
            </div>

            {/* Lista Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="font-medium text-gray-500">El carrito está vacío</p>
                  <p className="text-sm text-gray-400 mt-1">Escanea o selecciona productos</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onIncrease={() => updateQuantity(item.id, 1)}
                    onDecrease={() => updateQuantity(item.id, -1)}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* Footer Totales */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-bold text-gray-800">Total a Pagar</span>
                    <span className="text-3xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={clearCart}
                        className="px-4 py-3 border border-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => setShowCheckout(true)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Cobrar</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-normal">F9</span>
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Checkout */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Header Modal */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Procesar Pago</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Métodos de Pago */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <PaymentMethodButton
                      icon={Banknote}
                      label="Efectivo"
                      isSelected={paymentMethod === "cash"}
                      onClick={() => setPaymentMethod("cash")}
                    />
                    <PaymentMethodButton
                      icon={CreditCard}
                      label="Tarjeta"
                      isSelected={paymentMethod === "card"}
                      onClick={() => setPaymentMethod("card")}
                    />
                    <PaymentMethodButton
                      icon={DollarSign}
                      label="Mixto"
                      isSelected={paymentMethod === "mixed"}
                      onClick={() => setPaymentMethod("mixed")}
                    />
                  </div>
                </div>

                {/* Cliente */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Cliente (Opcional)
                  </label>
                  
                  {isCreatingCustomer ? (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold text-blue-700 flex items-center gap-2 text-sm">
                                  <UserPlus className="w-4 h-4" /> Nuevo Cliente
                              </h4>
                              <button onClick={() => setIsCreatingCustomer(false)} className="text-gray-400 hover:text-red-500">
                                  <X className="w-4 h-4" />
                              </button>
                          </div>
                          <div className="space-y-3">
                              <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input 
                                      autoFocus
                                      type="text" 
                                      placeholder="Nombre completo"
                                      value={newCustomerName}
                                      onChange={e => setNewCustomerName(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>
                              <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input 
                                      type="tel" 
                                      placeholder="Número de celular"
                                      value={newCustomerPhone}
                                      onChange={e => setNewCustomerPhone(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>
                              <button 
                                  onClick={handleCreateCustomer}
                                  className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                              >
                                  <Save className="w-4 h-4" /> Guardar Cliente
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="flex gap-2">
                          <div className="relative group flex-1">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                              <input
                              type="text"
                              placeholder="Buscar cliente..."
                              value={selectedCustomer ? selectedCustomer.name : customerSearch}
                              readOnly={!!selectedCustomer}
                              onChange={(e) => setCustomerSearch(e.target.value)}
                              className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                              />
                              {selectedCustomer && (
                                  <button 
                                      onClick={handleRemoveCustomer}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-500"
                                      title="Quitar cliente"
                                  >
                                      <X className="w-4 h-4" />
                                  </button>
                              )}
                          </div>
                          {!selectedCustomer && (
                              <button 
                                  onClick={() => setIsCreatingCustomer(true)}
                                  className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                                  title="Agregar Nuevo Cliente"
                              >
                                  <Plus className="w-5 h-5" />
                              </button>
                          )}
                      </div>
                  )}
                </div>

                {/* Calculadora de Cambio */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-700">Total a Pagar:</span>
                    <span className="font-bold text-gray-900 text-xl">${total.toFixed(2)}</span>
                  </div>
                  
                  {paymentMethod === "cash" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Monto Recibido</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && completeSale()}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-xl font-bold"
                            autoFocus
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-blue-200/50">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Cambio:</span>
                          <span className={`text-2xl font-bold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                            ${change.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Botón Final */}
                <button
                  onClick={completeSale}
                  disabled={paymentMethod === "cash" && payment < total}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  Confirmar Venta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}