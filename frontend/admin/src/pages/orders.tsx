import { useEffect, useState } from 'react'
import { decryptPayload } from '@/lib/utils';
import { changeOrderStatus, getOrders } from '@/services';
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
import { BsThreeDotsVertical } from "react-icons/bs";
import { ViewOrder } from '@/components/view-order';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      const response = await changeOrderStatus(orderId, status);
      if (response.success) {
        toast.success("Order status updated successfully");
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error("Error while updating order status", error);
      toast.error("Error while updating order status");
    }
  }

  const isDisabled = (currentStatus: string, btnStatus: string) => {
    if (currentStatus === "COMPLETED") return true;

    if (currentStatus === "REJECTED") return true;

    if (currentStatus === "APPROVED" && btnStatus === "PENDING") return true;

    if (currentStatus === btnStatus) return true;

    return false;
  };

  return (
    loading ? <BeatLoader /> : (
      <>
        <Table>
          <TableCaption>A list of your Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">S. No</TableHead>
              <TableHead >Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>TimeStamp</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orders?.map((order: any, index: number) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.buyer?.name}</TableCell>
                  <TableCell>{order.price * order.quantity}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.createdAt?.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline">
                          <BsThreeDotsVertical fontSize={20} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-50 flex flex-col gap-2">
                        <Button
                          onClick={() => {
                            setSelectedOrderId(order.id)
                            setOpen(true)
                          }}
                        >
                          View
                        </Button>

                        <Button
                          disabled={isDisabled(order.status, "PENDING")}
                          className={`bg-yellow-500 text-white ${isDisabled(order.status, "PENDING") ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                            }`}
                          onClick={() => handleOrderStatusChange(order.id, "PENDING")}
                        >
                          PENDING
                        </Button>

                        <Button
                          disabled={isDisabled(order.status, "APPROVED")}
                          className={`bg-green-500 text-white ${isDisabled(order.status, "APPROVED") ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                            }`}
                          onClick={() => handleOrderStatusChange(order.id, "APPROVED")}
                        >
                          APPROVED
                        </Button>

                        <Button
                          disabled={isDisabled(order.status, "REJECTED")}
                          variant="destructive"
                          className={`${isDisabled(order.status, "REJECTED") ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                            }`}
                          onClick={() => handleOrderStatusChange(order.id, "REJECTED")}
                        >
                          REJECTED
                        </Button>

                        <Button
                          disabled={isDisabled(order.status, "COMPLETED")}
                          className={`bg-green-700 text-white ${isDisabled(order.status, "COMPLETED") ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                            }`}
                          onClick={() => handleOrderStatusChange(order.id, "COMPLETED")}
                        >
                          COMPLETED
                        </Button>

                      </PopoverContent>
                    </Popover>
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
