'use client'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { useMobile } from '../../providers/MobileProvider';
import { LocationData } from '@/hooks/use-data';

interface MetricData {
    [metricType: string]: Array<{ timestamp: string; value: number}>
}
interface MalaGraphProps {
    location: LocationData
}
interface Margin {
    top: number,
    right: number,
    left: number,
    bottom: number,
}

export function MalaGraph({ location }: MalaGraphProps) { 
    const { isMobile } = useMobile();
    const [margins, setMargins] = useState<Margin>({
        top: 20,
        right: 40,
        left: 10,
        bottom: 40
    })
    
    const [selectedMetricType, setSelectedMetricType] = useState<string>('')
    const metricTypes = Object.keys(location.data)
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
    const fillColors = colors.map(color => color + '20'); // Adding 20% opacity

    useEffect(() => {
        if (isMobile) {
          setMargins({
            top: 10,
            right: 30,
            left:  10,
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
    }, [location.data]); // Only depend on data, not metricTypes (will rerender the set type)

    const selectedData = selectedMetricType && location.data[selectedMetricType] ? location.data[selectedMetricType] : [];
    
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
        <div className='bg-white rounded-md border-solid border-gray-300 border shadow-sm'>
            {/* Location Header */}
            <h3 className="p-4 text-xl font-semibold text-gray-900">
                {location.name}
            </h3>
            
            {/* Navigation Bar */}
            <div className="flex flex-wrap gap-2 mb-8 ml-4" style={{ pointerEvents: 'auto' }}>
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
                <div className="w-full h-full">
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
        </div>
       
        </>
    )
}