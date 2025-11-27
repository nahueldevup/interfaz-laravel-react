import { useState, useEffect, useRef } from "react";
import { Header } from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Search, Trash2, Plus, Minus } from "lucide-react";
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
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";

interface CartItem {
  id: number;
  barcode: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export default function Vender() {
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      barcode: "1",
      description: "pan",
      quantity: 1,
      price: 20,
      total: 20,
    },
  ]);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [customerType, setCustomerType] = useState("display");

  // Auto-enfoque en búsqueda al cargar
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Auto-enfoque en monto al abrir checkout
  useEffect(() => {
    if (isCheckoutOpen) {
      setTimeout(() => amountInputRef.current?.focus(), 100);
      setAmountReceived(total.toString());
    }
  }, [isCheckoutOpen]);

  // Atajo F9 para abrir checkout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9" && cartItems.length > 0 && !isCheckoutOpen) {
        e.preventDefault();
        handleCheckout();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartItems.length, isCheckoutOpen]);

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);
  const payment = parseFloat(amountReceived) || 0;
  const change = payment - total;

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCancelSale = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancelSale = () => {
    setCartItems([]);
    setIsCancelDialogOpen(false);
    searchInputRef.current?.focus();
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              total: Math.max(1, item.quantity + delta) * item.price,
            }
          : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido removido del carrito",
    });
  };

  const completeSale = () => {
    // Aquí iría la lógica para guardar la venta en Laravel
    toast({
      title: "Venta completada",
      description: `Cambio: $${change.toFixed(2)}`,
    });
    setCartItems([]);
    setIsCheckoutOpen(false);
    setAmountReceived("");
    searchInputRef.current?.focus();
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && payment >= total) {
      completeSale();
    }
  };

  return (
    <MainLayout>
      <Head title="Vender" />
      <div className="flex-1 flex flex-col">
        <Header title="proyecto" subtitle="Vender" />
        
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Escanear código o escribir el nombre del producto y presionar Enter"
                  className="pl-10 text-base"
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Presiona <kbd className="px-2 py-1 text-xs font-semibold border rounded bg-muted">F9</kbd> para terminar venta rápidamente
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border mb-6">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Total de la venta: $ {total.toFixed(2)}
                </h2>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Código de barras</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.barcode}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>$ {item.price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">$ {item.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Action Buttons */}
            {cartItems.length > 0 && (
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCancelSale}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Cancelar venta
                </Button>
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  Terminar venta (F9)
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* Checkout Dialog */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Terminar venta al contado</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad recibida</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    ref={amountInputRef}
                    id="amount"
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    onKeyDown={handleAmountKeyDown}
                    className="pl-8 text-lg"
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Presiona <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded bg-muted">Enter</kbd> para completar la venta
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tipo de cliente</Label>
                <RadioGroup value={customerType} onValueChange={setCustomerType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="display" id="display" />
                    <Label htmlFor="display">Mostrador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="search" id="search" />
                    <Label htmlFor="search">Buscar o crear nuevo</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-semibold">$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pago:</span>
                  <span className="font-semibold">$ {payment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Cambio:</span>
                  <span>$ {change.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCheckoutOpen(false)}>
                CERRAR (Esc)
              </Button>
              <Button
                className="bg-success hover:bg-success/90"
                onClick={completeSale}
                disabled={payment < total}
              >
                TERMINAR VENTA (Enter)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar venta actual?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Realmente desea vaciar la lista de productos?
                <br />
                <strong>Esta acción no se puede revertir</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => setIsCancelDialogOpen(false)}>
                CERRAR
              </Button>
              <Button
                className="bg-success hover:bg-success/90"
                onClick={confirmCancelSale}
              >
                SÍ, VACIAR
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}