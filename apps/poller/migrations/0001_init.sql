-- 0001_init.sql
-- Initial schema for RWA Sentinel alert store (Cloudflare D1 / SQLite).
-- Apply: pnpm --filter @oclix/poller wrangler d1 migrations apply DB --env <staging|production>
--
-- Design notes:
-- - price_e18 is stored as TEXT (bigint decimal string) because SQLite has no uint256.
-- - evidence is a JSON blob matching the poller AlertPayload.evidence shape.
-- - onchain_status transitions: pending -> submitted -> confirmed|failed (updated by alert-writer).

CREATE TABLE IF NOT EXISTS alerts (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  asset             TEXT    NOT NULL,                       -- e.g. 'cbETH/USD'
  oracle_pair       TEXT    NOT NULL,                       -- e.g. 'chainlink_vs_pyth'
  deviation_bps     INTEGER NOT NULL,
  alert_type        INTEGER NOT NULL,                       -- 0 = price-cross-check, 1 = attestation-expiry
  block_timestamp   INTEGER NOT NULL,                       -- unix seconds from poller tick
  evidence          TEXT    NOT NULL,                       -- JSON
  tx_hash           TEXT,                                    -- AlertRegistry.logAlert() tx
  onchain_status    TEXT    NOT NULL DEFAULT 'pending',     -- pending|submitted|confirmed|failed
  delivery_summary  TEXT,                                    -- JSON summary of webhook/telegram fan-out
  created_at        INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_alerts_asset_ts     ON alerts (asset, block_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_onchain_st   ON alerts (onchain_status);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  webhook_url       TEXT,                                    -- set this XOR telegram_chat_id
  telegram_chat_id  TEXT,
  asset_filter      TEXT,                                    -- CSV of asset symbols; NULL = all
  secret            TEXT,                                    -- HMAC secret for webhook payloads
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        INTEGER NOT NULL DEFAULT (unixepoch()),
  last_delivered_at INTEGER,
  CHECK ((webhook_url IS NOT NULL) OR (telegram_chat_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions (active);

CREATE TABLE IF NOT EXISTS price_history (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asset         TEXT    NOT NULL,
  source        TEXT    NOT NULL,                            -- 'chainlink'|'pyth'|'redstone'
  price_e18     TEXT    NOT NULL,                            -- bigint decimal string
  updated_at    INTEGER NOT NULL,                            -- oracle-reported unix seconds
  recorded_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_price_history_asset_rec ON price_history (asset, recorded_at DESC);
