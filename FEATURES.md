# Gramin Saathi - Features Documentation

## Table of Contents
1. [Dashboard (Home)](#dashboard-home)
2. [Khata (Digital Ledger)](#khata-digital-ledger)
3. [Saathi AI (Assistant)](#saathi-ai-assistant)
4. [Mandi Prices](#mandi-prices)
5. [Yojana (Government Schemes)](#yojana-government-schemes)
6. [Seekho (Learn)](#seekho-learn)
7. [Mausam (Weather)](#mausam-weather)
8. [Calculator](#calculator)
9. [Translator](#translator)
10. [Community](#community)
11. [Profile & Settings](#profile--settings)
12. [Offline Features](#offline-features)
13. [Accessibility](#accessibility)

---

## Dashboard (Home)

### Overview
The main dashboard provides a quick overview of user's financial status and quick access to all features.

### Components
- **Profile Card**: User's name, village, state
- **Cash Health Meter**: Visual indicator of financial health
- **Balance Summary**: Total income, expenses, net balance
- **Quick Links**: 
  - Saathi AI
  - Mandi Rates
  - Government Schemes
- **Recent Transactions**: Last 5 income/expense entries
- **Charts**: Income vs Expense trend visualization

### Actions
- View all transactions
- Navigate to any feature
- Quick add transaction

---

## Khata (Digital Ledger)

### Purpose
Digital replacement for traditional paper ledger (बही-खाता). Track all income and expenses.

### Features

#### Add Income
- Amount input with ₹ symbol
- Description field
- Category selection (Crop Sale, Labor, Subsidy, Other)
- Date picker
- Voice input support

#### Add Expense  
- Amount input
- Description
- Category (Seeds, Fertilizer, Labor, Equipment, Other)
- Date picker
- Voice input

#### Transaction History
- Filter by type (Income/Expense/All)
- Filter by date range
- Search by description
- Pagination (10 per page)

#### Analytics
- Monthly totals
- Category-wise breakdown
- Trend visualization

### Offline Support
- All transactions saved locally
- Syncs to cloud when online
- Works completely offline

---

## Saathi AI (Assistant)

### Purpose
AI-powered assistant that can answer questions about farming, schemes, finances, and general knowledge in Hindi or English.

### Capabilities
- Answer farming questions
- Explain government schemes
- Provide financial advice
- General knowledge assistance
- Conversational memory (remembers context)

### Input Methods
- Text input
- Voice input (Web Speech API)

### Output
- Text responses
- Voice output (Text-to-Speech)
- Can suggest actions (navigate to Mandi, Schemes, etc.)

### AI Backend
- Powered by Google Gemini AI
- Fallback responses when offline
- System prompt optimized for rural Indian context

---

## Mandi Prices

### Purpose
Live commodity prices from Agricultural Produce Market Committee (APMC) markets across India.

### Data Source
- data.gov.in API
- 30,000+ market entries
- Updated daily

### Features

#### Search
- **Fuzzy Search**: Partial text matching
- Search by:
  - Market name (e.g., "Shahpura")
  - District (e.g., "Jabalpur")
  - State (e.g., "Madhya Pradesh")
  - Commodity (e.g., "Wheat")

#### Filters
- State dropdown
- Commodity dropdown
- Price range (Min/Max)
- Clear all filters

#### Results Display
- Commodity name (Hindi translation)
- Market & District
- Modal price (₹/quintal)
- Arrival date
- State

#### Pagination
- 15 items per page
- API pagination for browsing (30,000+ records)
- Local pagination for search results

### Offline Support
- Recent prices cached in IndexedDB
- Serves cached data when offline

---

## Yojana (Government Schemes)

### Purpose
Discover and understand government schemes available for farmers and rural citizens.

### Schemes Covered

#### PM-KISAN (प्रधानमंत्री किसान सम्मान निधि)
- ₹6,000 per year
- Direct bank transfer
- Eligibility criteria
- Application process

#### PMFBY (प्रधानमंत्री फसल बीमा योजना)
- Crop insurance
- Premium rates
- Claim process

#### KCC (किसान क्रेडिट कार्ड)
- Agricultural loans
- Interest rates
- Application documents

#### Soil Health Card
- Free soil testing
- Fertilizer recommendations

### Features
- Scheme cards with key info
- Eligibility checker
- Required documents list
- Application links
- Benefits in Hindi & English

---

## Seekho (Learn)

### Purpose
Financial literacy and farming education through interactive lessons.

### Modules

1. **Budgeting Basics** (बजट की मूल बातें)
   - Creating a budget
   - Tracking expenses
   - Saving strategies

2. **Savings & Interest** (बचत और ब्याज)
   - Compound interest
   - Bank accounts
   - FD/RD options

3. **Loan Management** (ऋण प्रबंधन)
   - Understanding EMI
   - Comparing loans
   - Avoiding debt traps

4. **Digital Payments** (डिजिटल भुगतान)
   - UPI usage
   - Online banking safety
   - Fraud prevention

5. **Organic Farming** (जैविक खेती)
   - Composting
   - Natural pesticides
   - Certification

### Features
- Progress tracking
- Quizzes with scoring
- Lesson completion badges
- Continue where you left
- Offline access to lessons

---

## Mausam (Weather)

### Purpose
Weather forecasts with farming recommendations.

### Data Source
- OpenWeatherMap API
- 5-day forecasts
- Hourly updates

### Features

#### Current Weather
- Temperature (°C)
- Humidity (%)
- Wind speed
- Weather condition (Sunny, Cloudy, Rain, etc.)
- Weather icon

#### 5-Day Forecast
- Daily high/low temperatures
- Precipitation probability
- Weather conditions

#### Farming Recommendations
- Irrigation suggestions based on humidity
- Sowing/harvesting windows
- Storm warnings

#### Location
- Auto-detect location
- Manual city search
- Save favorite locations

---

## Calculator

### Purpose
Financial and agricultural calculators.

### Calculators Available

1. **Loan EMI Calculator**
   - Principal amount
   - Interest rate
   - Tenure
   - Monthly EMI result
   - Total interest

2. **Interest Calculator**
   - Simple interest
   - Compound interest
   - Annual/monthly calculation

3. **Crop Yield Calculator**
   - Land area
   - Expected yield per hectare
   - Market price
   - Revenue estimation

4. **Unit Converter**
   - Bigha ↔ Acre
   - Quintal ↔ Kg
   - Currency formatting

---

## Translator

### Purpose
Hindi to English and English to Hindi translation.

### Features
- Text input
- Voice input
- Instant translation
- Copy to clipboard
- Text-to-Speech output
- Common phrases saved

### Offline Support
- Basic translations work offline
- Complex translations need internet

---

## Community

### Purpose
Discussion forums and agricultural articles.

### Features

#### Forums
- Ask questions
- Share experiences
- Get advice from community
- Category-based discussions

#### Articles
- Farming tips
- Success stories
- Government announcements
- Seasonal guides

#### Interaction
- Like posts
- Comment
- Share

---

## Profile & Settings

### Profile Information
- Name
- Village
- District
- State
- Phone (optional)
- Profile photo

### Settings
- Language: Hindi / English
- Theme: Ocean / Light / Dark
- Font size adjustment
- Notification preferences

### Account
- Edit profile
- Change password
- Logout
- Delete account

---

## Offline Features

### What Works Offline

| Feature | Offline Capability |
|---------|-------------------|
| Dashboard | ✅ Full access (cached data) |
| Khata | ✅ Add transactions, view history |
| Saathi AI | ⚠️ Basic responses only |
| Mandi | ✅ Cached prices, search |
| Yojana | ✅ All scheme info |
| Seekho | ✅ All lessons |
| Weather | ⚠️ Last fetched data |
| Calculator | ✅ Full access |
| Translator | ⚠️ Basic translations |
| Community | ❌ Requires internet |

### Data Sync
- Automatic sync when online
- Pending changes indicator
- Manual sync option
- Conflict resolution (server wins)

---

## Accessibility

### Language Support
- Full Hindi & English support
- Dynamic text translation
- Hindi voice input/output

### Visual
- High contrast themes
- Large text option
- Clear icons with labels

### Input Methods
- Touch-friendly buttons
- Voice input for all text fields
- Minimal typing required

### Performance
- Fast load times
- Works on 2G/3G networks
- Low data usage
- Installable PWA (works like native app)
