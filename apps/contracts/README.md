# @oclix/contracts

Foundry project containing The Sentinel's on-chain contracts.

## Contracts

- **`AlertRegistry.sol`** — append-only log of detected oracle deviations. One contract per network (Base Sepolia for dev, Base Mainnet for production).

## Quickstart

```bash
forge install
forge build
forge test -vvv
```

## Deploy

```bash
# Base Sepolia (dev)
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia --broadcast --verify

# Base Mainnet (production) — 권상현 only, after dev verification
forge script script/Deploy.s.sol \
  --rpc-url base_mainnet --broadcast --verify
```

## Env

```
BASE_SEPOLIA_RPC_URL=
BASE_MAINNET_RPC_URL=
BASESCAN_API_KEY=
DEPLOYER_PRIVATE_KEY=   # hot wallet for deploys — use .env.local or forge's keystore
```

Never commit `.env`. Pre-commit hook runs gitleaks.
