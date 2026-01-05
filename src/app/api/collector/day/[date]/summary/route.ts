import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ date: string }> }
) {
    try {
        const { date } = await params;
        const res = await fetch(`http://157.180.87.223:9100/collector/day/${date}/summary`, { cache: 'no-store' });
        if (!res.ok) return NextResponse.json({ error: 'Remote Error' }, { status: res.status });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Connection Failed' }, { status: 502 });
    }
}
