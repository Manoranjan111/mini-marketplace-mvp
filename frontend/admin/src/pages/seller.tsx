import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { getSellers } from '@/services';
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
import AddSeller from '@/components/add-seller';
import { Button } from '@/components/ui/button';

export default function Seller() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sellers, setSellers] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await getSellers();
        if (response.success) {
          const payload = decryptPayload(response.data);
          setSellers(payload);
        }
      } catch (error) {
        console.error("Error while fetching sellers", error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  return (
    loading ? <BeatLoader /> : (
      <>
        <Button className='cursor-pointer' onClick={() => setIsModalOpen(true)}> + Add Seller</Button>
        <Table>
          <TableCaption>A list of your Products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">S. No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              sellers?.map((seller: any, index: number) => (
                <TableRow key={seller.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <AddSeller isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  )
}
