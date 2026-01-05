QuantLab Collector API Documentation (v2)
This document provides a comprehensive overview of the status API endpoints available at http://157.180.87.223:9100. These endpoints are designed for observability and UI integration.

Base URL
http://157.180.87.223:9100

1. GET /status
Provides the high-level runtime state of the collector. Ideal for dashboard headers or main status indicators.

Response Example:

{
  "state": "READY",
  "since": "2026-01-01T13:27:26.386340+00:00",
  "metrics": {
    "queue_pct": 42.1,
    "gaps_15m": 21,
    "drops_15m": 0,
    "reconnects_15m": 0,
    "rss_mb": 246.5
  }
}
Fields:

state: Component state (READY, BUSY, ERROR, SYNCING).
since: ISO timestamp of when the current state was entered.
metrics.queue_pct: Current memory queue utilization (0-100%).
metrics.gaps_15m: Number of data gaps detected in the last 15 minutes.
metrics.drops_15m: Number of events dropped due to full queue in the last 15 minutes.
metrics.rss_mb: Resident Set Size memory usage in MB.
2. GET /health
Basic health check used for monitoring tools and keep-alive verification.

Response Example:

{
  "status": "ok",
  "uptime": 8074.65,
  "last_event_ts": 1767273760252.7,
  "last_write_ts": 1767273760308.0
}
Fields:

status
: Always "ok" if service is responsive.
uptime: Service uptime in seconds.
last_event_ts: Unix timestamp (ms) of the last received WebSocket event.
last_write_ts: Unix timestamp (ms) of the last successful file write.
3. GET /metrics
Detailed operational metrics. Useful for plotting charts and deep-dive technical dashboards.

Response Example (Partial):

{
  "queue_size": 118458,
  "queue_maxsize": 500000,
  "dropped_events_total": 0,
  "events_per_sec": {
    "bbo": 13.3,
    "trade": 3.7,
    "mark_price": 5.0,
    "funding": 1.0,
    "open_interest": 0.0
  },
  "writer": {
    "total_written": 9303,
    "files_written": 1883,
    "pending_events": 8,
    "active_buffers": 140
  }
}
Key Sections:

events_per_sec: Throughput breakdown by stream type.
writer: Internal writer state, showing pending events and active file buffers.
effective_data_loss_rate_pct: Calculated data loss based on sequence gaps.
4. GET /streams
Metadata about the currently active symbols and data streams.

Response Example:

{
  "symbols": ["BTCUSDT", "ETHUSDT", ...],
  "streams": {
    "binance": ["bbo", "trade", "mark_price", "funding"],
    "bybit": ["bbo", "trade", "mark_price", "funding", "open_interest"],
    "okx": ["bbo", "trade", "mark_price", "funding", "open_interest"]
  }
}
Fields:

symbols: List of symbols being collected from all exchanges.
streams
: Map of exchange to active stream types.
TIP

Use /status for high-frequency polling (e.g., every 5-10s) and /metrics for background analytics or detailed "Show More" sections.

