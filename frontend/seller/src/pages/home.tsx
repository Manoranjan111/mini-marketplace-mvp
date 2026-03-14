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

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>({
    noOfProducts: 0,
    noOfSales: 0,
  });

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card onClick={() => navigate('/products')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.noOfProducts}
            </div>
          </CardContent>
        </Card>
        <Card onClick={() => navigate('/orders')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.noOfSales}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  )
}
