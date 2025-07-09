'use client'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useScreenSize from '@/app/lib/hooks';
import { useEffect, useState } from 'react';

interface MetricData {
    [metricType: string]: Array<{ timestamp: string; value: number}>
}
interface MalaGraphProps {
    data: MetricData
}
interface Margin {
    top: number,
    right: number,
    left: number,
    bottom: number,
}

export function MalaGraph({ data }: MalaGraphProps) { 
    const screenSize = useScreenSize()
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [margins, setMargins] = useState<Margin>({
        top: 20,
        right: 40,
        left: 10,
        bottom: 40
    })
    
    const metricTypes = Object.keys(data)
    const [selectedMetricType, setSelectedMetricType] = useState<string>('')
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

    useEffect(() => {
        if (screenSize.width < 600) {
          setIsMobile(true)
          setMargins({
            top: 10,
            right: 10,
            left:  10,
            bottom: 50
          })
        } else {
          setIsMobile(false)
          setMargins({
            top: 20,
            right: 40,
            left: 10,
            bottom: 40
          })
        }
    }, [screenSize.width])

    // Reset selected metric type when data changes (new location)
    useEffect(() => {
        if (metricTypes.length > 0) {
            setSelectedMetricType(metricTypes[0]);
        }
    }, [data]); // Only depend on data, not metricTypes (to refer to the current data, not to change the type each time)

    const selectedData = selectedMetricType && data[selectedMetricType] ? data[selectedMetricType] : [];
    
    // Transform data for the selected metric type with error handling
    const chartData = Array.isArray(selectedData) 
        ? selectedData.map(point => ({
            timestamp: point.timestamp,
            value: point.value
        }))
        : [];

    return (
        <>
        {/* Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-2">
            {metricTypes.map((metricType) => (
                <button
                    key={metricType}
                    onClick={() => setSelectedMetricType(metricType)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedMetricType === metricType
                            ? 'bg-lime-800 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                    {metricType}
                </button>
            ))}
        </div>

        {/* Selected Graph */}
        {selectedMetricType && chartData.length > 0 && (
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={chartData}
                        margin={margins}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="timestamp" 
                            hide={isMobile}
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis
                            hide={isMobile}
                            domain={[
                                (dataMin: number) => {
                                    const min = Math.floor(dataMin * 0.95);
                                    return min < 0 ? 0 : min;
                                },
                                (dataMax: number) => Math.ceil(dataMax * 1.05)
                            ]}
                            tickCount={6}
                        />
                        <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={colors[metricTypes.indexOf(selectedMetricType) % colors.length]} 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )}
       
        </>
    )
}