import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { decryptPayload } from "@/lib/utils"
import { getOrderDetails } from "@/services"
import { useEffect, useState } from "react"
import BeatLoader from "react-spinners/BeatLoader"

export function ViewOrder({
  open,
  onClose,
  orderId,
}: {
  open: boolean
  onClose: (open: boolean) => void
  orderId: string
}) {
  const [loading, setLoading] = useState<boolean>(true)
  const [orderDetails, setOrderDetails] = useState<any>({})

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      try {
        const response = await getOrderDetails(orderId);

        if (response.success) {
          const payload = decryptPayload(response.data);
          setOrderDetails(payload);
        }
      } catch (error) {
        console.error("Error while fetching Orders", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, orderId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>View Order Details</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        {
          loading ? (
            <div className="flex justify-center py-6">
              <BeatLoader />
            </div>
          ) : (
            <div className="space-y-4">

              <DialogDescription>
                Order ID: <span className="font-medium">{orderDetails.id}</span>
              </DialogDescription>

              <FieldGroup>

                <Field>
                  <Label>Buyer Name</Label>
                  <div className="text-sm">{orderDetails?.buyer?.name}</div>
                </Field>

                <Field>
                  <Label>Buyer Email</Label>
                  <div className="text-sm">{orderDetails?.buyer?.email}</div>
                </Field>

                <Field>
                  <Label>Product</Label>
                  <div className="text-sm">{orderDetails?.product?.title}</div>
                </Field>

                <Field>
                  <Label>Price</Label>
                  <div className="text-sm">₹{orderDetails?.price}</div>
                </Field>

                <Field>
                  <Label>Quantity</Label>
                  <div className="text-sm">{orderDetails?.quantity}</div>
                </Field>

                <Field>
                  <Label>Status</Label>
                  <div
                    className={`text-xs px-2 py-1 rounded w-fit ${orderDetails.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {orderDetails.status}
                  </div>
                </Field>

                <Field>
                  <Label>Created At</Label>
                  <div className="text-sm">
                    {new Date(orderDetails?.createdAt).toLocaleString()}
                  </div>
                </Field>

              </FieldGroup>
            </div>
          )
        }
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
