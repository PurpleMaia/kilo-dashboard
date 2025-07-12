'use client'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { useMobile } from '../../contexts/MobileContext';

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
    const { isMobile } = useMobile();
    const [margins, setMargins] = useState<Margin>({
        top: 20,
        right: 40,
        left: 10,
        bottom: 40
    })
    
    const [selectedMetricType, setSelectedMetricType] = useState<string>('')
    const metricTypes = Object.keys(data)
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
    const fillColors = colors.map(color => color + '20'); // Adding 20% opacity

    useEffect(() => {
        if (isMobile) {
          setMargins({
            top: 10,
            right: 10,
            left:  0,
            bottom: 50
          })
        } else {
          setMargins({
            top: 20,
            right: 40,
            left: 10,
            bottom: 40
          })
        }
    }, [isMobile]);

    // Reset selected metric type when data changes (new location)
    useEffect(() => {
        if (metricTypes.length > 0) {
            setSelectedMetricType(metricTypes[0]);
        }
    }, [data]); // Only depend on data, not metricTypes (will rerender the set type)

    const selectedData = selectedMetricType && data[selectedMetricType] ? data[selectedMetricType] : [];
    
    // Debug logging
    console.log('Current selectedMetricType:', selectedMetricType);
    console.log('Available metricTypes:', metricTypes);
    
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
        <div className="flex flex-wrap gap-2 mb-2" style={{ pointerEvents: 'auto' }}>
            {metricTypes.map((metricType) => (
                <button
                    key={metricType}
                    onClick={(e) => {
                        e.stopPropagation();                        
                        console.log('Setting selectedMetricType to:', metricType);
                        setSelectedMetricType(metricType);
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedMetricType === metricType
                            ? 'bg-lime-800 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                >
                    {metricType}
                </button>
            ))}
        </div>

        {/* Selected Graph */}
        {selectedMetricType && chartData.length > 0 && (
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
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
                            domain={[
                                (dataMin: number) => {
                                    const min = Math.floor(dataMin * 0.95);
                                    return min < 0 ? 0 : min;
                                },
                                (dataMax: number) => Math.ceil(dataMax * 1.05)
                            ]}
                            tickCount={6}
                        />
                        {!isMobile ? (
                            <Tooltip 
                                labelFormatter={(value) => new Date(value).toLocaleString()}
                            />
                        ) : (
                            <p></p>
                        )}
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={colors[metricTypes.indexOf(selectedMetricType) % colors.length]} 
                            fillOpacity={1}
                            fill={fillColors[metricTypes.indexOf(selectedMetricType) % fillColors.length]}                            
                            dot={false}
                            activeDot={!isMobile ? { r: 4 } : false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )}
       
        </>
    )
}