'use client'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMobile } from '../../providers/MobileProvider';
import { LocationData } from '@/lib/types';

interface MalaGraphProps {
    location: LocationData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export function MalaGraph({ location }: MalaGraphProps) { 
    const { isMobile } = useMobile();
    const [selectedMetricType, setSelectedMetricType] = useState<string>('');
    
    // Memoize derived values
    const metricTypes = useMemo(() => Object.keys(location.data), [location.data]);
    
    const margins = useMemo(() => ({
        top: isMobile ? 10 : 20,
        right: isMobile ? 30 : 40,
        left: 10,
        bottom: isMobile ? 50 : 40
    }), [isMobile]);

    // Color functions with stable references
    const getMetricColor = useCallback((metricType: string) => {
        const index = metricTypes.indexOf(metricType);
        return COLORS[index % COLORS.length];
    }, [metricTypes]);

    const getFillColor = useCallback((metricType: string) => {
        return getMetricColor(metricType) + '20';
    }, [getMetricColor]);

    // Dynamic Y-axis domain calculation
    // eslint-disable-next-line
    const calculateDynamicDomain = useCallback((data: any[]) => {
        if (!data.length) return ['auto', 'auto'];
        
        const values = data.map(d => d.value);
        const dataMin = Math.min(...values);
        const dataMax = Math.max(...values);
        const range = dataMax - dataMin;
        
        // Handle small ranges with tighter margins
        if (range < 1) {
            return [
                Number(Math.max(0, dataMin - range).toPrecision(2)),
                Number((dataMax + range).toPrecision(2))
            ];
        } else if (range < 10) {
            return [
                Number(Math.max(0, dataMin - range * 0.5).toPrecision(1)),
                Number((dataMax + range * 0.5).toPrecision(1))
            ];
        } else {
            return [
                Math.max(0, Math.floor(dataMin * 0.95)),
                Math.ceil(dataMax * 1.05)
            ];
        }
    }, []);

    // Memoized chart data transformation
    const chartData = useMemo(() => {
        const selectedData = selectedMetricType && location.data[selectedMetricType] 
            ? location.data[selectedMetricType] 
            : [];
        
        return Array.isArray(selectedData) 
            ? selectedData.map(point => ({
                timestamp: point.timestamp,
                value: point.value
            }))
            : [];
    }, [selectedMetricType, location.data]);

    // Reset selected metric when location changes
    useEffect(() => {
        if (metricTypes.length > 0) {
            setSelectedMetricType(metricTypes[0]);
        }
    }, [metricTypes]);

    const handleMetricChange = useCallback((metricType: string) => {
        setSelectedMetricType(metricType);
    }, []);

    return (
        <div className='bg-white rounded-md border border-gray-300 shadow-lg md:mb-0 mb-10'>

            {/* Header and Navigation */}
            <div className='items-center align-middle space-y-2 justify-between mx-10 mt-8 mb-4'>
                {/* Location Header */}
                <h3 className="text-xl font-semibold text-gray-900">
                    {location.siteName}
                </h3>
                
                {isMobile && (                    
                    <div className="flex flex-wrap gap-2 md:ml-20">
                        {metricTypes.map((metricType) => (
                            <button
                                key={metricType}
                                onClick={() => handleMetricChange(metricType)}
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
                )}
            </div>

            {/* Chart Container */}
            {selectedMetricType && chartData.length > 0 && (
                <div className="w-full h-full mb-4 md:mb-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={margins}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={(value) => new Date(value).toLocaleDateString().replace('/2025', '')}
                                angle={45}
                                tick={{ dy: 10 }}
                                textAnchor='start'                             
                            />
                            <YAxis
                                domain={calculateDynamicDomain(chartData)}
                                tickCount={10}
                            />
                            {!isMobile && (
                                <Tooltip 
                                    labelFormatter={(value) => new Date(value).toLocaleString()}
                                    formatter={(value: number) => [
                                        value.toFixed(2), 
                                        selectedMetricType
                                    ]}
                                />
                            )}
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={getMetricColor(selectedMetricType)} 
                                fillOpacity={1}
                                fill={getFillColor(selectedMetricType)}
                                dot={false}
                                activeDot={!isMobile ? { r: 4 } : false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
            {!isMobile && (
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    {metricTypes.map((metricType) => (
                        <button
                            key={metricType}
                            onClick={() => handleMetricChange(metricType)}
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
            )}
        </div>
    );
}