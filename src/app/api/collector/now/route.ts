import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://157.180.87.223:9100/collector/now', { cache: 'no-store' });
        if (!res.ok) return NextResponse.json({ error: 'Remote Error' }, { status: res.status });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Connection Failed' }, { status: 502 });
    }
}
