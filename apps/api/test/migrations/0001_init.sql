-- Mirror of apps/poller/migrations/0001_init.sql for api test harness.
-- Keep in sync when poller migrations change.
-- TODO(모진영): after both PR #2 and PR #3 merge, extract to packages/migrations
-- or add a CI diff check to guard against drift. Tracking issue to be filed.

CREATE TABLE IF NOT EXISTS alerts (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  asset             TEXT    NOT NULL,
  oracle_pair       TEXT    NOT NULL,
  deviation_bps     INTEGER NOT NULL,
  alert_type        INTEGER NOT NULL,
  block_timestamp   INTEGER NOT NULL,
  evidence          TEXT    NOT NULL,
  tx_hash           TEXT,
  onchain_status    TEXT    NOT NULL DEFAULT 'pending',
  delivery_summary  TEXT,
  created_at        INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_alerts_asset_ts     ON alerts (asset, block_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_onchain_st   ON alerts (onchain_status);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  webhook_url       TEXT,
  telegram_chat_id  TEXT,
  asset_filter      TEXT,
  secret            TEXT,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        INTEGER NOT NULL DEFAULT (unixepoch()),
  last_delivered_at INTEGER,
  CHECK ((webhook_url IS NOT NULL) OR (telegram_chat_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions (active);

CREATE TABLE IF NOT EXISTS price_history (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  asset         TEXT    NOT NULL,
  source        TEXT    NOT NULL,
  price_e18     TEXT    NOT NULL,
  updated_at    INTEGER NOT NULL,
  recorded_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_price_history_asset_rec ON price_history (asset, recorded_at DESC);
