'use client'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Metric } from '@/app/lib/types';
import { formatTime } from '@/app/lib/utils';


export function SensorGraph({
    name,
    data,
}: {
    name: string;
    data: Metric[];
}) {

    return (
        <>
        <h2>{name}</h2>
        <div className='w-60 h-60'>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        </>
    )
}