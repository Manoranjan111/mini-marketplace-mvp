import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { getBuyers } from '@/services';
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

export default function Buyer() {
  const [loading, setLoading] = useState<boolean>(true);
  const [buyers, setBuyers] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBuyers();
        if (response.success) {
          const payload = decryptPayload(response.data);
          setBuyers(payload);
        }
      } catch (error) {
        console.error("Error while fetching buyers", error);
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            buyers?.map((buyer: any, index: number) => (
              <TableRow key={buyer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{buyer.name}</TableCell>
                <TableCell>{buyer.email}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    )
  )
}
