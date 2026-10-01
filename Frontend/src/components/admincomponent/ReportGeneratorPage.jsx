import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ReportGeneratorPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    
    const [selectedReport, setSelectedReport] = useState('userActivitySummary');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0,10);
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0,10));
    const [chartData, setChartData] = useState(null);

    // Ensure the report options match your backend endpoints
    const reportOptions = [
        { value: 'userActivitySummary', label: 'User Activity Summary', endpoint: '/api/admin/reports/users' },
        { value: 'recruiterActivity', label: 'Recruiter Job Posting Activity', endpoint: '/api/admin/reports/recruiter-activity' },
        { value: 'companyMetrics', label: 'Company Metrics & Visualizations', endpoint: '/api/admin/reports/company-metrics' },
        // Add more reports as you implement them in admin.controller.js
    ];

    /**
     * Helper function to convert JSON data to CSV format and trigger download.
     * @param {Array<Object>} data - The array of objects returned from the API.
     * @param {string} filename - The name of the file to download.
     */
    const downloadCsv = (data, filename) => {
        if (!data || data.length === 0) return;

        // Get headers from the first object keys
        const headers = Object.keys(data[0]);
        
        // Format the CSV content
        const csvRows = [];
        csvRows.push(headers.join(',')); // Add headers row

        for (const row of data) {
            const values = headers.map(header => {
                // Handle potential commas within data by wrapping in quotes
                const escaped = ('' + row[header]).replace(/"/g, '\\"'); 
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        
        // Trigger the download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.click();
        
        URL.revokeObjectURL(url);
    };


    const handleGenerateReport = async () => {
        const report = reportOptions.find(opt => opt.value === selectedReport);
        if (!report) return;

        setLoading(true);
        setStatusMessage(`Generating report: ${report.label}...`);

        try {
            // Include credentials (cookie) so backend can authorize admin requests
            const params = { startDate, endDate };
            const response = await axios.get(report.endpoint, { withCredentials: true, params });

            if (response.data.success && response.data.data) {
                const reportData = response.data.data;
                if (selectedReport === 'companyMetrics') {
                    // Store chart data in state to render visualizations
                    setChartData(reportData);
                    setStatusMessage(`✅ Company metrics loaded.`);
                } else {
                    // Use the download handler for CSV-style tabular reports
                    downloadCsv(reportData, `${report.value}_report`);
                    setStatusMessage(`✅ Report '${report.label}' successfully downloaded.`);
                }
            } else {
                setStatusMessage(`❌ Error: Report generation failed or returned no data.`);
            }

        } catch (error) {
            // Log detailed response for easier debugging
            console.error('Report generation error:', error?.response?.status, error?.response?.data || error.message || error);
            // Check for 403/401 errors for better feedback
            if (error.response?.status === 403 || error.response?.status === 401) {
                setStatusMessage('❌ Error: Access denied. Token may be expired.');
            } else if (error.response?.data?.message) {
                setStatusMessage(`❌ Error: ${error.response.data.message}`);
            } else {
                setStatusMessage('❌ Error: Could not connect to the report server.');
            }
        } finally {
            setLoading(false);
        }
    };


    // Quick check to ensure the user is an Admin (redundant due to ProtectedRoute, but safe)
    if (!user || user.role !== 'Administrator') {
        navigate('/');
        return null;
    }

    return (
        <>
            <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                    Site Analytics and Report Generator
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <p className="text-gray-600 mb-6">
                        Select the type of data report you wish to generate and download. Reports are exported as CSV files.
                    </p>

                    {/* Date Range */}
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full rounded-md border-gray-300 p-2" />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full rounded-md border-gray-300 p-2" />
                        </div>
                    </div>

                    {/* Report Selector */}
                    <div className="mb-6">
                        <label htmlFor="report-select" className="block text-lg font-medium text-gray-700 mb-2">
                            Choose Report Type
                        </label>
                        <select
                            id="report-select"
                            value={selectedReport}
                            onChange={(e) => { setSelectedReport(e.target.value); setChartData(null); }}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            disabled={loading}
                        >
                            {reportOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                    >
                        {loading ? 'Generating...' : `Generate & Download ${reportOptions.find(opt => opt.value === selectedReport)?.label}`}
                    </button>
                    
                    {/* Status Message */}
                    {statusMessage && (
                        <p className={`mt-4 p-3 rounded-md text-sm ${statusMessage.startsWith('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {statusMessage}
                        </p>
                    )}

                    {/* Charts for Company Metrics */}
                    {chartData && selectedReport === 'companyMetrics' && (
                        <div className="mt-6 bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Company Metrics ({startDate} → {endDate})</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">Jobs per Company</h3>
                                    <BarChart data={chartData.companies.map(c => ({ label: c.companyName || 'Unknown', value: c.jobCount }))} />
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Applications per Company</h3>
                                    <BarChart data={chartData.companies.map(c => ({ label: c.companyName || 'Unknown', value: c.applicationCount }))} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <h3 className="font-medium mb-2">Site Activity (per day)</h3>
                                    <LineChart series={chartData.series} showYAxisLabels={true} />
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Summary ({startDate} → {endDate})</h4>
                                    <p className="text-sm text-gray-600 mb-2">Totals over selected period:</p>
                                    <ul className="space-y-2">
                                        <li><strong>{chartData.series.reduce((s, r) => s + (r.users || 0), 0)}</strong> users registered</li>
                                        <li><strong>{chartData.series.reduce((s, r) => s + (r.jobs || 0), 0)}</strong> jobs posted</li>
                                        <li><strong>{chartData.series.reduce((s, r) => s + (r.applications || 0), 0)}</strong> applications</li>
                                    </ul>
                                    <p className="mt-3 text-xs text-gray-500">This summary shows the aggregate activity across the selected date range to help you spot trends at a glance.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};



// Simple SVG BarChart component
const BarChart = ({ data = [], height = 200 }) => {
    if (!data || data.length === 0) return <p className="text-sm text-gray-500">No data available</p>;
    const max = Math.max(...data.map(d => d.value || 0), 1);
    const barWidth = Math.max(24, Math.floor(600 / data.length));
    return (
        <div className="overflow-auto">
            <svg width={Math.max(600, data.length * barWidth)} height={height} className="w-full">
                {data.map((d, i) => {
                    const h = (d.value / max) * (height - 40);
                    const x = i * barWidth + 20;
                    const y = height - h - 20;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width={barWidth - 8} height={h} fill="#4f46e5" rx="4" />
                            <text x={x + (barWidth - 8) / 2} y={height - 4} textAnchor="middle" fontSize="10" fill="#111">{d.label}</text>
                            <text x={x + (barWidth - 8) / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#111">{d.value}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Simple SVG LineChart for timeseries
const LineChart = ({ series = [], width = '100%', height = 220, showYAxisLabels = false }) => {
    if (!series || series.length === 0) return <p className="text-sm text-gray-500">No timeline data</p>;
    const labels = series.map(s => s.date);
    const jobs = series.map(s => s.jobs || 0);
    const apps = series.map(s => s.applications || 0);
    const max = Math.max(...jobs.concat(apps), 1);
    const w = 700; const h = height;
    const pad = 40;
    const xStep = (w - pad * 2) / Math.max(1, labels.length - 1);
    const point = (arr, i) => ({ x: pad + i * xStep, y: h - pad - (arr[i] / max) * (h - pad * 2) });

    const jobsPoints = jobs.map((v, i) => point(jobs, i));
    const appsPoints = apps.map((v, i) => point(apps, i));

    const linePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Y-axis ticks (5 ticks)
    const ticks = [0,0.25,0.5,0.75,1];

    const formatNumber = (n) => n.toLocaleString();

    return (
        <div className="overflow-auto">
            <svg width={Math.max(w, labels.length * 60)} height={h}>
                {/* grid lines and optional Y labels */}
                {ticks.map((t,i) => {
                    const y = pad + (h - pad*2)*t;
                    const value = Math.round((1 - t) * max);
                    return (
                        <g key={i}>
                            <line x1={pad} x2={Math.max(w, labels.length * 60) - pad} y1={y} y2={y} stroke="#e5e7eb" />
                            {showYAxisLabels && <text x={12} y={y+4} fontSize="10" fill="#6b7280">{formatNumber(value)}</text>}
                        </g>
                    );
                })}

                {/* jobs line */}
                <path d={linePath(jobsPoints)} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {/* apps line */}
                <path d={linePath(appsPoints)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {/* points */}
                {jobsPoints.map((p,i) => <circle key={`j${i}`} cx={p.x} cy={p.y} r={3} fill="#10b981" />)}
                {appsPoints.map((p,i) => <circle key={`a${i}`} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />)}
                {/* x labels */}
                {labels.map((lbl, i) => {
                    const x = pad + i * xStep;
                    return <text key={i} x={x} y={h - 6} fontSize="9" textAnchor="middle" fill="#374151">{lbl}</text>;
                })}
                {/* legend */}
                <rect x={Math.max(w, labels.length * 60) - pad - 160} y={6} width={160} height={36} rx={6} fill="#ffffff" stroke="#e5e7eb" />
                <g>
                    <circle cx={Math.max(w, labels.length * 60) - pad - 140} cy={20} r={5} fill="#10b981" />
                    <text x={Math.max(w, labels.length * 60) - pad - 128} y={24} fontSize={11} fill="#111">Jobs</text>
                    <circle cx={Math.max(w, labels.length * 60) - pad - 80} cy={20} r={5} fill="#3b82f6" />
                    <text x={Math.max(w, labels.length * 60) - pad - 68} y={24} fontSize={11} fill="#111">Applications</text>
                </g>
            </svg>
        </div>
    );
};

export default ReportGeneratorPage;