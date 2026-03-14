import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { getOrders } from '@/services';
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
import { ViewOrder } from '@/components/view-order';

export default function Orders() {
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<any>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const response = await getOrders();
        if (response.success) {
          const payload = decryptPayload(response.data);
          setOrders(payload);
        }
      } catch (error) {
        console.error("Error while fetching Orders", error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  return (
    loading ? <BeatLoader /> : (
      <>
        <Table>
          <TableCaption>A list of your Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>TimeStamp</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orders?.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.buyer?.name}</TableCell>
                  <TableCell>{order.price * order.quantity}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.createdAt?.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => {
                        setOpen(true)
                        setSelectedOrderId(order.id)
                      }}
                    >
                      View
                    </Button>
                    <Button className="mr-2" onClick={() => toast.warn("Edit Order")}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <ViewOrder open={open} onClose={setOpen} orderId={selectedOrderId} />
      </>
    )
  )
}
