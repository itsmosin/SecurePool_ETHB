# SecurePool - Neon EVM Insurance Protocol

A decentralized insurance platform built on **Neon EVM** that leverages Solana's composability libraries to provide cross-runtime insurance coverage with enhanced functionality.

## 🌉 Neon EVM Migration

This project has been **migrated from Metal API/Base Network to Neon EVM** to participate in the ETH Belgrade Hackathon challenge. The migration demonstrates:

- **Cross-runtime composability** using Neon EVM's libraries
- **SPL Token integration** for enhanced token operations
- **Solana system program** interactions via EVM
- **DeFi insurance protocol** with cross-chain functionality

## 🎯 Hackathon Challenge - Neon EVM Composability

**Challenge**: Build a DeFi dApp that uses Neon EVM's composability libraries to unlock functionality beyond the EVM.

**Our Solution**: A decentralized insurance protocol that:
- Creates SPL tokens on Solana via Solidity contracts
- Locks/unlocks collateral across EVM and Solana runtimes
- Demonstrates cross-chain policy management
- Uses system program calls for account creation

## 🏗️ Architecture

### Smart Contracts

1. **SecurePoolInsurance.sol** - Main insurance protocol
   - Policy creation and management
   - Premium calculations
   - Claim processing
   - Liquidity pool management

2. **NeonComposabilityInsurance.sol** - Advanced cross-runtime features
   - SPL Token creation and management
   - Cross-chain policy creation
   - Solana account interactions
   - System program composability

3. **MockERC20.sol** - Test token for development

### Frontend Stack

- **React + TypeScript + Vite**
- **Tailwind CSS + shadcn-ui** for modern UI
- **Ethers.js v5** for Web3 interactions
- **React Query** for state management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Git

### Setup

1. **Clone and install dependencies**:
```bash
git clone <your-repo>
cd securepool-neon-evm
npm install --legacy-peer-deps
```

2. **Configure environment**:
```bash
cp env.example .env
# Add your private key for deployment
```

3. **Add Neon DevNet to MetaMask**:
- **Network Name**: Neon EVM DevNet
- **RPC URL**: https://devnet.neonevm.org
- **Chain ID**: 245022926
- **Currency Symbol**: NEON
- **Block Explorer**: https://devnet.neonscan.org

4. **Get test NEON tokens**:
Visit [Neon Faucet](https://neonfaucet.org) to get test tokens.

### Development

```bash
# Compile smart contracts
npm run compile

# Deploy to Neon DevNet
npm run deploy:neon

# Start frontend development server
npm run dev
```

### Deployment

```bash
# Deploy contracts to Neon DevNet
npm run deploy:neon

# Verify contracts on NeonScan
npx hardhat verify <CONTRACT_ADDRESS> --network neondevnet
```

## 🔧 Neon EVM Integration

### Composability Libraries Used

1. **SPL Token Program**:
   - Create native Solana tokens from Solidity
   - Mint/burn operations across runtimes
   - Cross-chain token transfers

2. **System Program**:
   - Create Solana accounts from EVM
   - Transfer lamports between accounts
   - Cross-runtime account management

### Key Features

- **Cross-Chain Policies**: Insurance policies that span EVM and Solana
- **SPL Token Collateral**: Lock/unlock Solana tokens for insurance coverage
- **Cross-Runtime Claims**: Process claims across different execution environments
- **Hybrid Liquidity**: Combine EVM and Solana liquidity sources

## 🔍 Testing

### Manual Testing

1. **Connect Wallet**: Connect MetaMask to Neon DevNet
2. **Get Test Tokens**: Use faucet to get SPTEST tokens
3. **Purchase Policy**: Create an insurance policy
4. **Provide Liquidity**: Add tokens to liquidity pool
5. **Submit Claim**: Test the claim process

### Contract Verification

```bash
# Verify on NeonScan
npx hardhat verify <INSURANCE_ADDRESS> <TOKEN_ADDRESS> --network neondevnet
npx hardhat verify <TOKEN_ADDRESS> "SecurePool Test Token" "SPTEST" 1000000 --network neondevnet
```

## 🌟 Key Differentiators

1. **True Cross-Runtime**: Unlike bridges, directly execute Solana programs from EVM
2. **Native Composability**: Leverage Solana's speed with EVM's tooling
3. **Insurance Innovation**: Novel insurance products spanning multiple runtimes
4. **DeFi Integration**: Seamless integration with both ecosystems

## 🔗 Useful Links

- [Neon EVM Documentation](https://neonevm.org/docs)
- [Neon DevNet Explorer](https://devnet.neonscan.org)
- [Neon Faucet](https://neonfaucet.org)
- [Composability Examples](https://github.com/neonevm/neon-contracts/tree/dev/solidity-composability-libraries)

## 🏆 Hackathon Submission

This project demonstrates **advanced DeFi use case of Neon's composability libraries** by:

- ✅ Using SPL Token composability for cross-runtime token operations
- ✅ Implementing system program calls for account management
- ✅ Creating novel insurance mechanics spanning EVM and Solana
- ✅ Deploying functional contracts on Neon DevNet
- ✅ Building intuitive frontend demonstrating the functionality

**Original Project**: [ShieldFi](https://github.com/SohamGhugare/shieldfi) (Metal/Base)
**Migrated Version**: SecurePool on Neon EVM (this repository)

## 🛠️ Development Notes

### Future Enhancements

- Governance for claim approvals
- Oracle integration for risk assessment
- Multi-token support
- Advanced yield farming features
- Cross-chain arbitrage opportunities

## 📝 License

MIT License - see LICENSE file for details.

