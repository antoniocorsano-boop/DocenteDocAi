import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Configure OTLP exporter to send traces to AI Toolkit
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // AI Toolkit OTLP endpoint
});

// For debugging, also use console exporter
const consoleExporter = new ConsoleSpanExporter();

// Initialize the provider with span processors
const provider = new WebTracerProvider({
  spanProcessors: [
    new BatchSpanProcessor(traceExporter),
    new SimpleSpanProcessor(consoleExporter),
  ],
});

// Register the provider
provider.register();

// Note: Auto-instrumentations for web may not cover all, especially custom AI calls
// For Google GenAI, you may need manual instrumentation


