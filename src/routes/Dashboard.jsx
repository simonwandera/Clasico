import {useQuery} from "@tanstack/react-query";
import API_BASE_URL from "../Config.js";

export default function Dashboard() {

    const {data, isPending, error} = useQuery({
        queryKey: ['kpis'],
        queryFn: getKpis
    })

    const {data: recentActivities} = useQuery({
        queryKey: ['recent'],
        queryFn: getRecentActivities
    });

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="mx-auto px-6 py-4">
            {/* Header */}

            <div className="mb-8">
                <h1 className="text-5xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Overview of key business metrics and activities</p>
            </div>

            {/* KPI Cards */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Key Performance Indicators (KPIs)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title="Total Sales" value={data?.totalSales}/>
                    <KpiCard title="Customer Count" value={data?.customerCount}/>
                    <KpiCard title="Order Volume" value={data?.orderVolume}/>
                    <KpiCard title="Top-Selling Products" value={data?.mostSoldProduct}/>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Sales Trends */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Sales Trends</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="text-gray-600">Sales Over Time</p>
                            <p className="text-2xl font-bold">$250,000</p>
                        </div>
                        <div className="text-green-600">Last 12 Months +15%</div>
                    </div>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                        {/* Placeholder for chart */}
                        <p className="text-gray-400">Sales chart will appear here</p>
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(month => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Recent Activities */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
                <div className="space-y-3 pl-5">
                    {recentActivities?.map((activity, index) => (
                        <ActivityItem
                            key={`activity-${index}`}
                            title={activity.title}
                            description={activity.description}
                        />
                    ))}
                </div>
            </section>

            <div className="border-t border-gray-200 my-6"></div>
            {/* Quick Actions */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create New Order
                    </button>
                    <button className="bg-gray-200 text-white px-4 py-2 rounded hover:bg-gray-300">
                        Add New Customer
                    </button>
                    {/*<Button></Button>*/}

                </div>
            </section>
        </div>
    );
}

// Helper components
function KpiCard({title, value}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}

function ActivityItem({title, description}) {
    return (
        <span className="relative">
            <div className="absolute -left-5 top-2 h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="font-medium">{title}</p>
            <p className="text-gray-600 text-sm pb-5">{description}</p>
        </span>
    );
}

const getKpis = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
    return await response.json();
}

const getRecentActivities = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/recentActivities`);
    return await response.json();
}