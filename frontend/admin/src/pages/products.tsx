import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { getProducts } from '@/services';
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

export default function Products() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any>([]);

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

  return (
    loading ? <BeatLoader /> : (
      <Table>
        <TableCaption>A list of your Products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">S. No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Metrics</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            products?.map((product: any, index: number) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.niche}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.metrics}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    )
  )
}
