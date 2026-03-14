import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Cookies from 'js-cookie';
import { placeOrder } from "@/services"
import BeatLoader from "react-spinners/BeatLoader"

export default function CartPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [isLoggedIn] = useState(() => {
    return !!Cookies.get('refresh_token');
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart-item") || "[]")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(storedCart)
  }, [])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleRemoveItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)

    setCart(updatedCart)
    localStorage.setItem("cart-item", JSON.stringify(updatedCart))
  }

  const updateQuantity = (id: any, type: string) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          if (type === "increase") {
            return { ...item, quantity: item.quantity + 1 }
          }

          if (type === "decrease") {
            if (item.quantity === 1) return null // remove item
            return { ...item, quantity: item.quantity - 1 }
          }
        }
        return item
      })
      .filter(Boolean)

    setCart(updatedCart)
    localStorage.setItem("cart-item", JSON.stringify(updatedCart))
  }

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to place an order")
      navigate("/login?redirectTo=/cart")
      return
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    try {
      setLoading(true)
      const res = await placeOrder({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      })
      if (!res.success) {
        toast.warning("Something went wrong")
        return
      }
      toast.success("Order placed successfully")
      setCart([])
      localStorage.setItem("cart-item", JSON.stringify([]))
    } catch (error: any) {
      toast.error(error.message || "Failed to place order")
    } finally {
      setLoading(false)
    }

    // TODO: Call API to place order

    toast.success("Order placed successfully")
  }

  return (
    <div className="container mx-auto py-10">
      {
        loading ? (
          <BeatLoader />
        ) : cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-bold">Your cart is empty</p>
            <Button className="mt-4 cursor-pointer" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT : CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>

              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex gap-4 p-4 items-center">

                    <img
                      src={item?.assets?.[0]?.assetUrl || "https://picsum.photos/200/30"}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex flex-col flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>

                      <p className="text-sm text-muted-foreground">
                        {item.metrics}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <span>₹{item.price}</span>

                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-2">

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, "decrease")}
                          >
                            -
                          </Button>

                          <span className="px-2">{item.quantity}</span>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, "increase")}
                          >
                            +
                          </Button>

                        </div>
                      </div>
                    </div>

                    {/* DELETE BUTTON */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Delete
                    </Button>

                  </CardContent>
                </Card>
              ))}
            </div>

            {/* RIGHT : ORDER SUMMARY */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <Button
                    className="w-full mt-4 cursor-pointer"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        )
      }

    </div>
  )
}