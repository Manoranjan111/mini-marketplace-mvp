import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { deleteProduct, getProducts } from '@/services';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BeatLoader from 'react-spinners/BeatLoader';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import AddProduct from '@/components/add-product';

export default function Products() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await getProducts();
        if (response.success) {
          const payload = decryptPayload(response.data);
          setProducts(payload);
        }
      } catch (error) {
        console.error("Error while fetching products", error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((product: any) => product.id !== productId));
      }
    } catch (error) {
      console.error("Error while deleting product", error);
      toast.error("Error while deleting product");
    }
  }
  return (
    loading ? <BeatLoader /> : (
      <>
        <Button onClick={() => setIsModalOpen(true)}> + Add New Product</Button>
        <Table>
          <TableCaption>A list of your Products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Title</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Metrics</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              products?.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.niche}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.metrics}</TableCell>
                  <TableCell className="text-right">
                    <Button className="mr-2" onClick={() => toast.warn("Edit Product")}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <AddProduct isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  )
}
