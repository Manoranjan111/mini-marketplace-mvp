import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDashboardData } from '@/services';
import { decryptPayload } from '@/lib/utils';
import BeatLoader from 'react-spinners/BeatLoader';
import { useNavigate } from 'react-router-dom';
import AddAdmin from '@/components/add-admin';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>({
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0,
    totalBuyers: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getDashboardData();
        if (response.success) {
          const payload = decryptPayload(response.data);
          setDashboardData(payload);
        }
      } catch (error) {
        console.error("Error while fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  return (
    loading ? (<BeatLoader />) : (
      <>
        <Button className='cursor-pointer' onClick={() => setIsModalOpen(true)}> + Add Admin</Button>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card onClick={() => navigate('/product')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalProducts}
              </div>
            </CardContent>
          </Card>
          <Card onClick={() => navigate('/order')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalOrders}
              </div>
            </CardContent>
          </Card>
          <Card onClick={() => navigate('/seller')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalSellers}
              </div>
            </CardContent>
          </Card>
          <Card onClick={() => navigate('/buyer')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Buyers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalBuyers}
              </div>
            </CardContent>
          </Card>
        </div>
        <AddAdmin isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  )
}
