import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from 'react-toastify'
import { getProducts } from '@/services';
import { decryptPayload } from '@/lib/utils';
import BeatLoader from 'react-spinners/BeatLoader';
import { Input } from '@/components/ui/input';



const niches = ["All", "Fitness", "Finance", "Education", "Cake"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "₹0 - ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000+", min: 1000, max: Infinity },
];


export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("All");
  const [price, setPrice] = useState(priceRanges[0]);
  const [debouncedSearch, setDebouncedSearch] = useState("All");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        search: debouncedSearch,
        niche,
        minPrice: price.min,
        maxPrice: price.max,
      }
      );
      if (response.success) {
        const payload = decryptPayload(response.data);
        setProducts(payload);
      }
    } catch (error) {
      console.error("Error while fetching products", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, niche, price]);

  return (
    <>
      <div className="flex gap-3">
        {/* Niche Filter */}
        <div className=" items-center">
          <label htmlFor="niche" className="font-medium">Niche:</label>
          <select
            className="border p-2 rounded"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
          >
            {niches.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className=" items-center">
          <label htmlFor="price" className="font-medium">Price Range:</label>
          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setPrice(priceRanges[Number(e.target.value)])
            }
          >
            {priceRanges.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <Input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-75"
        />
      </div>
      <div className="mt-3 my-4 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-center">
        {
          loading ? (<BeatLoader />) : (

            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))

          )
        }
      </div>
    </>
  )
}

function ProductCard({ product }: { product: any }) {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart-item") || "[]")

    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart-item", JSON.stringify(cart))
    toast.success("Product added to cart")
  }
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <img
        src={product?.assets[0]?.assetUrl || "https://picsum.photos/200/30"}
        alt={product.title}
        className="h-48 w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.metrics}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-lg font-semibold">₹{product.price}</p>
      </CardContent>

      <CardFooter>
        <Button className="w-full cursor-pointer" onClick={handleAddToCart}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
