# 🚀 Hướng Dẫn Deploy Contract Lên Sepolia Testnet

## Bước 1: Chuẩn Bị Môi Trường

### 1.1. Tạo File .env

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

### 1.2. Cấu Hình Wallet

Bạn có 2 cách để cấu hình wallet:

**Cách 1: Sử dụng MNEMONIC (Khuyến nghị)**
```env
MNEMONIC="your twelve word mnemonic phrase here"
```

**Cách 2: Sử dụng PRIVATE_KEY**
```env
PRIVATE_KEY="0xYourPrivateKeyHere"
```

⚠️ **LƯU Ý BẢO MẬT:**
- KHÔNG bao giờ commit file `.env` lên Git
- Chỉ sử dụng wallet testnet, KHÔNG dùng wallet chính
- Bảo vệ mnemonic/private key cẩn thận

### 1.3. Lấy Sepolia ETH

Bạn cần Sepolia ETH để deploy (khoảng 0.01-0.1 ETH đủ để deploy):

1. Truy cập các faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://faucet.quicknode.com/ethereum/sepolia

2. Nhập địa chỉ wallet của bạn (địa chỉ đầu tiên từ mnemonic)

3. Chờ nhận Sepolia ETH (thường mất vài phút)

### 1.4. Cấu Hình RPC Provider

**Option 1: Sử dụng Infura (Khuyến nghị)**

1. Đăng ký tài khoản tại: https://infura.io/
2. Tạo project mới
3. Chọn network: Sepolia
4. Copy API Key và thêm vào `.env`:

```env
INFURA_API_KEY="your_infura_api_key_here"
```

**Option 2: Sử dụng Alchemy**

1. Đăng ký tại: https://www.alchemy.com/
2. Tạo app cho Sepolia network
3. Copy HTTP URL và thêm vào `.env`:

```env
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
```

**Option 3: Sử dụng Public RPC (Không khuyến nghị cho production)**

```env
SEPOLIA_RPC_URL="https://rpc.sepolia.org"
```

### 1.5. Cấu Hình Etherscan API (Optional)

Để verify contract sau khi deploy:

1. Đăng ký tại: https://etherscan.io/
2. Vào My API Key: https://etherscan.io/myapikey
3. Tạo API key mới
4. Thêm vào `.env`:

```env
ETHERSCAN_API_KEY="your_etherscan_api_key_here"
```

## Bước 2: Cài Đặt Dependencies

Đảm bảo đã cài đặt Node.js (>=20) và npm (>=7.0.0):

```bash
# Kiểm tra version
node --version
npm --version

# Cài đặt dependencies
npm install
```

## Bước 3: Compile Smart Contracts

Trước khi deploy, cần compile contracts:

```bash
npm run compile
```

Lệnh này sẽ:
- Compile tất cả Solidity contracts
- Generate TypeScript types (TypeChain)
- Tạo artifacts trong thư mục `artifacts/`

Nếu có lỗi, kiểm tra:
- Solidity version trong `hardhat.config.ts`
- Import paths trong contracts
- Cài đặt đầy đủ dependencies

## Bước 4: Deploy Lên Sepolia

### 4.1. Kiểm Tra Wallet Balance

Trước khi deploy, kiểm tra số dư Sepolia ETH:

```bash
# Kiểm tra số dư của tài khoản deploy
npx hardhat accounts --network sepolia
```

Hoặc kiểm tra trên Etherscan:
- Vào https://sepolia.etherscan.io/
- Search địa chỉ wallet của bạn

### 4.2. Deploy Contracts

Chạy lệnh deploy:

```bash
npm run deploy:sepolia
```

Lệnh này sẽ:
1. Deploy contract `FHECounter` (contract mẫu)
2. Deploy contract `RWAPokemonCards` (contract chính)
3. In ra địa chỉ của cả 2 contracts

**Output mẫu:**
```
deploying "FHECounter" (tx: 0x...)
deployed FHECounter to 0x...
FHECounter contract: 0x...

deploying "RWAPokemonCards" (tx: 0x...)
deployed RWAPokemonCards to 0x...
RWAPokemonCards contract: 0x...
```

⚠️ **QUAN TRỌNG:** 
- **SAVE contract address** (đặc biệt là `RWAPokemonCards`)
- Bạn sẽ cần địa chỉ này để cấu hình frontend

### 4.3. Verify Contract Trên Etherscan (Optional)

Nếu đã cấu hình `ETHERSCAN_API_KEY`, bạn có thể verify contract:

```bash
npm run verify:sepolia
```

Hoặc verify từng contract:

```bash
# Verify RWAPokemonCards
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# Verify FHECounter
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Bước 5: Cấu Hình Frontend

Sau khi deploy thành công, cập nhật địa chỉ contract trong frontend:

1. Mở file `home/src/config/contracts.ts`

2. Cập nhật `CONTRACT_ADDRESS`:

```typescript
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress' as `0x${string}`;
```

3. Đảm bảo ABI đã được cập nhật (thường đã có sẵn)

## Bước 6: Kiểm Tra Deployment

### 6.1. Kiểm Tra Trên Etherscan

1. Vào https://sepolia.etherscan.io/
2. Search contract address
3. Kiểm tra:
   - Contract đã được deploy
   - Transaction hash
   - Contract code (nếu đã verify)

### 6.2. Test Contract (Optional)

Có thể test contract bằng Hardhat:

```bash
npm run test:sepolia
```

⚠️ **Lưu ý:** Test trên Sepolia cần contract đã được deploy trước.

## Troubleshooting

### Lỗi: "insufficient funds"

**Nguyên nhân:** Không đủ Sepolia ETH

**Giải pháp:**
1. Kiểm tra balance: `npx hardhat accounts --network sepolia`
2. Lấy thêm Sepolia ETH từ faucet

### Lỗi: "nonce too high" hoặc "replacement transaction underpriced"

**Nguyên nhân:** Có transaction đang pending

**Giải pháp:**
1. Đợi transaction cũ được confirm
2. Hoặc reset nonce bằng cách tăng gas price

### Lỗi: "Network error" hoặc "connection refused"

**Nguyên nhân:** RPC URL không đúng hoặc không khả dụng

**Giải pháp:**
1. Kiểm tra `INFURA_API_KEY` hoặc `SEPOLIA_RPC_URL` trong `.env`
2. Thử dùng RPC provider khác
3. Kiểm tra internet connection

### Lỗi: "invalid mnemonic" hoặc "invalid private key"

**Nguyên nhân:** Format mnemonic/private key không đúng

**Giải pháp:**
- Mnemonic: phải có đúng 12 từ, cách nhau bằng khoảng trắng
- Private key: phải bắt đầu bằng `0x`, đủ 66 ký tự

### Lỗi khi compile

**Nguyên nhân:** Thiếu dependencies hoặc version không tương thích

**Giải pháp:**
```bash
# Xóa cache và reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run compile
```

## Checklist Deploy Thành Công

- [ ] File `.env` đã được tạo và cấu hình đúng
- [ ] Wallet có đủ Sepolia ETH (>0.01 ETH)
- [ ] Contracts đã compile thành công (`npm run compile`)
- [ ] Deploy thành công (`npm run deploy:sepolia`)
- [ ] Contract address đã được save
- [ ] Contract đã được verify trên Etherscan (optional)
- [ ] Frontend đã được cập nhật với contract address mới

## Thông Tin Liên Quan

- **Sepolia Explorer:** https://sepolia.etherscan.io/
- **Zama fhEVM Docs:** https://docs.zama.ai/fhevm
- **Hardhat Docs:** https://hardhat.org/docs
- **Infura Dashboard:** https://infura.io/dashboard

## Lưu Ý Quan Trọng

1. **Testnet Only:** Contract này deploy lên Sepolia testnet, KHÔNG phải mainnet
2. **Backup:** Luôn backup mnemonic/private key ở nơi an toàn
3. **Security:** Không share file `.env` với ai
4. **Gas Fees:** Deploy contract tốn gas, đảm bảo có đủ ETH

---

**Chúc bạn deploy thành công! 🎉**

