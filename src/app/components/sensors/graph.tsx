'use client'
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import useScreenSize from '@/app/lib/hooks';
import { useEffect, useState } from 'react';
interface MalaData {
    [malaName: string]: Array<{ timestamp: string; value: number }>;
}

interface SensorGraphProps {
    data: MalaData;
}

export function SensorGraph({
    data
}: SensorGraphProps) {
    const screenSize = useScreenSize()
    const [isMobile, setIsMobile] = useState<boolean>(true)
    const malaNames = Object.keys(data);
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
    
    const combinedData: Record<string, string | number | null>[] = [];
    
    // Get all unique timestamps
    const allTimestamps = new Set<string>();
    malaNames.forEach(malaName => {
        data[malaName].forEach(point => {
            allTimestamps.add(point.timestamp);
        });
    });
    
    // Create combined dataset
    const sortedTimestamps = Array.from(allTimestamps).sort();
    sortedTimestamps.forEach(timestamp => {
        const dataPoint: Record<string, string | number | null> = { timestamp };
        malaNames.forEach(malaName => {
            const point = data[malaName].find(p => p.timestamp === timestamp);
            dataPoint[malaName] = point ? point.value : null;
        });
        combinedData.push(dataPoint);
    });

    useEffect(() => {
      if (screenSize.width < 600) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }, [screenSize.width])

    return (
        <>
        <div className="w-full h-64"> {/* Adjust h-64 or h-72 as needed */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={combinedData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 1,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
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
              <Legend />
              {malaNames.map((malaName, index) => (
                <Line 
                  key={malaName}
                  type="monotone" 
                  dataKey={malaName} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
      </div>
        </>
    )
}