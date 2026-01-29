/**
 * Charts Components
 * Componenti per visualizzare grafici delle metriche con Recharts
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PerformanceMetrics } from '../utils/metricsParser';

// ============================================================================
// TYPES
// ============================================================================

interface ChartProps {
  data: any[];
  className?: string;
  height?: number;
}

// ============================================================================
// PERFORMANCE TREND CHART
// ============================================================================

export const PerformanceTrendChart: React.FC<ChartProps> = ({
  data,
  className = '',
  height = 300
}) => {
  // Trasforma i dati per il grafico
  const chartData = data.map((metric: PerformanceMetrics) => ({
    time: new Date(metric.timestamp).toLocaleDateString(),
    fps: Math.round(metric.fps),
    memory: Math.round(metric.memoryUsage.percentage),
    bundleSize: Math.round(metric.bundleSize.total / 1024 / 1024 * 100) / 100, // MB
    aiResponseTime: Math.round(metric.aiMetrics.averageResponseTime)
  }));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--md-sys-color-outline-variant)"
          />
          <XAxis
            dataKey="time"
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <YAxis
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '8px',
              color: 'var(--md-sys-color-on-surface)'
            }}
          />
          <Line
            type="monotone"
            dataKey="fps"
            stroke="var(--md-sys-color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--md-sys-color-primary)', strokeWidth: 2, r: 4 }}
            name="FPS"
          />
          <Line
            type="monotone"
            dataKey="memory"
            stroke="var(--md-sys-color-secondary)"
            strokeWidth={2}
            dot={{ fill: 'var(--md-sys-color-secondary)', strokeWidth: 2, r: 4 }}
            name="Memory %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================================================
// MEMORY USAGE CHART
// ============================================================================

export const MemoryUsageChart: React.FC<ChartProps> = ({
  data,
  className = '',
  height = 250
}) => {
  const chartData = data.map((metric: PerformanceMetrics) => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    used: Math.round(metric.memoryUsage.used / 1024 / 1024), // MB
    percentage: metric.memoryUsage.percentage
  }));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--md-sys-color-outline-variant)"
          />
          <XAxis
            dataKey="time"
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <YAxis
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '8px',
              color: 'var(--md-sys-color-on-surface)'
            }}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="var(--md-sys-color-tertiary)"
            fill="var(--md-sys-color-tertiary-container)"
            fillOpacity={0.3}
            name="Memory Usage %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================================================
// AI ERRORS CHART
// ============================================================================

interface AIErrorsChartProps extends Omit<ChartProps, 'data'> {
  errorsByCategory: Record<string, number>;
}

export const AIErrorsChart: React.FC<AIErrorsChartProps> = ({
  errorsByCategory,
  className = '',
  height = 250
}) => {
  const chartData = Object.entries(errorsByCategory).map(([category, count]) => ({
    name: category,
    value: count,
    fill: getErrorColor(category)
  }));

  const COLORS = [
    'var(--md-sys-color-error)',
    'var(--md-sys-color-error-container)',
    'var(--md-sys-color-on-error-container)',
    'var(--md-sys-color-secondary)',
    'var(--md-sys-color-tertiary)'
  ];

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '8px',
              color: 'var(--md-sys-color-on-surface)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

function getErrorColor(category: string): string {
  const colors: Record<string, string> = {
    'Timeout': 'var(--md-sys-color-error)',
    'Quota Exceeded': 'var(--md-sys-color-error-container)',
    'Network Error': 'var(--md-sys-color-on-error-container)',
    'API Error': 'var(--md-sys-color-secondary)',
    'Rate Limit': 'var(--md-sys-color-tertiary)'
  };
  return colors[category] || 'var(--md-sys-color-outline-variant)';
}

// ============================================================================
// LAZY LOADING CHART
// ============================================================================

interface LazyLoadingChartProps extends Omit<ChartProps, 'data'> {
  loadTimes: Record<string, number>;
}

export const LazyLoadingChart: React.FC<LazyLoadingChartProps> = ({
  loadTimes,
  className = '',
  height = 250
}) => {
  const chartData = Object.entries(loadTimes).map(([component, time]) => ({
    component: component.length > 15 ? component.substring(0, 15) + '...' : component,
    time: Math.round(time),
    fullName: component
  }));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--md-sys-color-outline-variant)"
          />
          <XAxis
            type="number"
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <YAxis
            dataKey="component"
            type="category"
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '8px',
              color: 'var(--md-sys-color-on-surface)'
            }}
            formatter={(value, name, props) => [
              `${value}ms`,
              props.payload.fullName
            ]}
          />
          <Bar
            dataKey="time"
            fill="var(--md-sys-color-primary)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================================================
// BUNDLE SIZE TREND CHART
// ============================================================================

export const BundleSizeTrendChart: React.FC<ChartProps> = ({
  data,
  className = '',
  height = 250
}) => {
  const chartData = data.map((metric: PerformanceMetrics) => ({
    time: new Date(metric.timestamp).toLocaleDateString(),
    bundleSize: Math.round(metric.bundleSize.total / 1024 / 1024 * 100) / 100, // MB
    chunks: metric.bundleSize.chunks
  }));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--md-sys-color-outline-variant)"
          />
          <XAxis
            dataKey="time"
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <YAxis
            stroke="var(--md-sys-color-on-surface-variant)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '8px',
              color: 'var(--md-sys-color-on-surface)'
            }}
          />
          <Line
            type="monotone"
            dataKey="bundleSize"
            stroke="var(--md-sys-color-tertiary)"
            strokeWidth={2}
            dot={{ fill: 'var(--md-sys-color-tertiary)', strokeWidth: 2, r: 4 }}
            name="Bundle Size (MB)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};