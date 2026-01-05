'use client';

import { useEffect, useState } from 'react';
import {
    fetchCollectorNow,
    fetchCollectorDaySummary,
    fetchCollectorDayWindows,
    fetchCollectorUploaderNow,
    CollectorNow,
    CollectorDaySummary,
    CollectorWindow,
    CollectorUploaderNow
} from '@/lib/api-client';

import { SystemNowHeader } from '@/components/collector/SystemNowHeader';
import { ExchangeLiveness } from '@/components/collector/ExchangeLiveness';
import { DailyTrustSummary } from '@/components/collector/DailyTrustSummary';
import { RecommendedUsage } from '@/components/collector/RecommendedUsage';
import { WindowTimeline } from '@/components/collector/WindowTimeline';
import { UploaderStatus } from '@/components/collector/UploaderStatus';
import { CloudOff, RefreshCw } from 'lucide-react';

export default function CollectorPage() {
    const [nowData, setNowData] = useState<CollectorNow | null>(null);
    const [summaryData, setSummaryData] = useState<CollectorDaySummary | null>(null);
    const [windowsData, setWindowsData] = useState<CollectorWindow[] | null>(null);
    const [uploaderData, setUploaderData] = useState<CollectorUploaderNow | null>(null);

    // Date Navigation State
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    });


    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // STRICT UTC DATE HANDLING
    const getUtcTodayString = () => {
        const d = new Date();
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const loadLiveData = async () => {
        const controller = new AbortController();
        try {
            console.log('FETCHING LIVE: START');
            const nowRaw = await fetchCollectorNow(controller.signal);
            const uploaderRaw = await fetchCollectorUploaderNow(controller.signal).catch(() => null);

            setNowData(nowRaw);
            setUploaderData(uploaderRaw);
            setLastUpdated(new Date());
            setError(null);
        } catch (err: any) {
            console.error('LIVE FETCH ERROR:', err);
            setError(err.message || 'Connection Failed');
        }
    };

    const loadDayData = async (targetDate: string) => {
        const controller = new AbortController();
        try {
            console.log('FETCHING DAY DATA:', targetDate);
            const summaryPromise = fetchCollectorDaySummary(targetDate, controller.signal)
                .catch(e => {
                    console.warn('Summary fetch failed:', e.message);
                    return null;
                });

            const windowsPromise = fetchCollectorDayWindows(targetDate, controller.signal)
                .catch(e => {
                    console.warn('Windows fetch failed:', e.message);
                    return null;
                });

            const [summary, windows] = await Promise.all([summaryPromise, windowsPromise]);

            setSummaryData(summary);
            setWindowsData(windows);
        } catch (err: any) {
            console.error('DAY DATA FETCH ERROR:', err);
        }
    };

    // 1. Live Data Polling (Always)
    useEffect(() => {
        loadLiveData();
        const interval = setInterval(loadLiveData, 3000);
        return () => clearInterval(interval);
    }, []);

    // 2. Day Data Fetching (When date changes or every 15s if it's today)
    useEffect(() => {
        loadDayData(selectedDate);
        setLoading(false);

        if (selectedDate === getUtcTodayString()) {
            const interval = setInterval(() => loadDayData(selectedDate), 15000);
            return () => clearInterval(interval);
        }
    }, [selectedDate]);

    if (error && !nowData) {
        return (
            <main className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 font-sans pb-32">
                <div className="max-w-7xl mx-auto space-y-8">


                    <div className="flex flex-col items-center justify-center h-96 text-red-500">
                        <CloudOff className="w-16 h-16 mb-4" />
                        <h1 className="text-2xl font-bold">SYSTEM OFFLINE</h1>
                        <p className="opacity-60 mb-8">Collector API Unreachable</p>
                        <button onClick={() => { setLoading(true); loadLiveData(); loadDayData(selectedDate); }} className="flex items-center gap-2 px-4 py-2 bg-red-900/30 rounded border border-red-500/30 hover:bg-red-900/50">
                            <RefreshCw className="w-4 h-4" /> Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 font-sans pb-32">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* 1. Top Bar - System Now */}
                <SystemNowHeader data={nowData} lastUpdated={lastUpdated} />

                {/* 2. Exchange Liveness */}
                <section>
                    <h2 className="text-xs uppercase font-bold opacity-40 mb-3 tracking-widest pl-1">Live Exchange Status</h2>
                    <ExchangeLiveness data={nowData} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 3. Daily Trust Summary */}
                    <div className="lg:col-span-2">
                        <DailyTrustSummary
                            data={summaryData}
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            isToday={selectedDate === getUtcTodayString()}
                        />
                    </div>

                    {/* 4. Right Column: Recommended Usage + Uploader Status */}
                    <div className="space-y-8">
                        <UploaderStatus data={uploaderData} />
                        <RecommendedUsage data={summaryData} />
                    </div>
                </div>

                {/* 5. Window Timeline */}
                <section>
                    <h2 className="text-xs uppercase font-bold opacity-40 mb-3 tracking-widest pl-1">Daily Audit Log</h2>
                    <WindowTimeline data={windowsData} />
                </section>

            </div>
        </main>
    );
}
