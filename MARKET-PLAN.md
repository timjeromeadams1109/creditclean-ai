# CreditClean AI — Headless Market Plan

**Goal:** $10,000/month net profit at $29/month per user
**Required:** 362 paying subscribers
**Timeline:** 12 months to target

---

## 1. Unit Economics

| Line Item | Amount |
|-----------|--------|
| Monthly price | $29 |
| Stripe fee (2.9% + $0.30) | -$1.14 |
| **Net per user** | **$27.86** |

### Fixed Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Supabase Pro | $25 | Postgres + Auth |
| Vercel Pro | $20 | Next.js hosting |
| Resend | $20 | Transactional email |
| Domain/DNS | ~$2 | Cloudflare |
| **Total fixed** | **$67** | |

### Breakeven & Targets

| Users | Gross | Stripe Fees | Fixed | **Net Profit** |
|-------|-------|-------------|-------|----------------|
| 50 | $1,450 | $57 | $67 | **$1,326** |
| 100 | $2,900 | $114 | $67 | **$2,719** |
| 200 | $5,800 | $228 | $67 | **$5,505** |
| 362 | $10,498 | $413 | $67 | **$10,018** |
| 500 | $14,500 | $570 | $67 | **$13,863** |

**Breakeven: 3 users** ($87 revenue vs $67 fixed costs)

### Why Margins Are So Good
- **Zero AI/LLM costs** — all letter generation is rule-based templates
- **Zero per-user compute costs** — PDFs generated in-memory with open-source library
- **No human labor** — fully self-serve, headless
- **Stripe is the only variable cost** at 2.9% + $0.30

### Scale Triggers (When Costs Increase)

| Milestone | Action | New Cost |
|-----------|--------|----------|
| 500 users | Supabase may need compute addon | +$25/m |
| 1,000 users | Vercel Pro bandwidth limits | +$20/m |
| 2,000+ users | Consider dedicated Supabase | +$100/m |
| 5,000+ users | Move to self-hosted Postgres | Saves $100+/m |

Even at 2,000 users ($58k/m revenue), total costs would be ~$230/m. **Margins stay above 99%.**

---

## 2. Pricing Architecture

### Tier Structure

| Feature | Free | Pro ($29/m) | Premium ($79/m) |
|---------|------|-------------|-----------------|
| Credit items tracked | 5 | 50 | 200 |
| Dispute letters/month | 1 | 30 | 100 |
| Forensic reports/month | 1 | 10 | 30 |
| PDF downloads/month | 3 | 100 | 500 |
| Max escalation round | 1 | 5 | 5 |
| Attorney package | No | Yes | Yes |
| Priority support | No | No | Yes |

### Why $29, Not $27
- Under the $30 psychological barrier
- $29 is the most common SaaS price point for individual tools
- Competitors charge $79-$149/m but do the work for you
- $29 for self-help tooling with attorney-grade templates is a strong value prop
- Only 362 users to hit $10k vs 389 at $27

### Annual Plan Option
- $249/year ($20.75/m effective) — 28% discount
- Locks in revenue, reduces churn
- Offer after 30 days of paid usage

---

## 3. Abuse Protection (IMPLEMENTED)

### Rate Limiting (per user, per minute)
- **Auth endpoints:** 5/min (brute-force protection)
- **Letter generation:** 10/min
- **PDF downloads:** 10/min
- **Read endpoints:** 30/min

### Usage Quotas (per tier, per month)
- Free: 1 letter, 1 report, 3 PDFs, 5 items
- Pro: 30 letters, 10 reports, 100 PDFs, 50 items
- Premium: 100 letters, 30 reports, 500 PDFs, 200 items

### Account Abuse Prevention
- Signup rate-limited by IP (5/min) — prevents mass account creation
- All generation endpoints check subscription tier before executing
- 403 response with clear upgrade messaging when limits hit
- Free tier intentionally restrictive to demonstrate value, not deliver full service

### What's NOT Built Yet (Recommended Before Launch)
- [ ] **Account sharing detection** — flag if same account used from 5+ IPs in 24h
- [ ] **Disposable email blocking** — reject known temp email domains on signup
- [ ] **Stripe customer portal** — let users self-manage billing (reduces support)
- [ ] **Webhook handlers** — upgrade/downgrade tier on Stripe subscription events
- [ ] **Grace period** — 3-day CROA cancellation window enforcement

---

## 4. Acquisition Strategy (Headless = No Sales Team)

### Channel Mix (Target: 362 users in 12 months)

#### Month 1-3: Foundation (Target: 30 users)

**SEO Content (Free, Slow Burn)**
- 20 blog posts targeting long-tail keywords:
  - "how to dispute [item type] on credit report"
  - "FCRA 611 dispute letter template"
  - "credit bureau violation types"
  - "how to remove [collections/late payments/inquiries]"
- Each post ends with free-tier CTA
- **Cost: $0** (write yourself or delegate to Three agent)

**Reddit/Forums (Free, Immediate)**
- r/CRedit (180k members), r/personalfinance (19M members)
- Provide genuine help, link to free tool when relevant
- Don't spam — build reputation as "the credit dispute person"
- **Cost: $0, Time: 30 min/day**

**YouTube Shorts / TikTok (Free, High Leverage)**
- 60-second videos: "I found 3 violations on my credit report in 30 seconds"
- Screen recordings of the forensic analyzer in action
- Before/after score screenshots (with permission from beta users)
- **Cost: $0, Time: 2 videos/week**

#### Month 3-6: Growth (Target: 100 users)

**Google Ads — Long-Tail Only**
- Keywords: "credit dispute letter generator", "FCRA violation checker"
- Budget: $300/month, target CPA < $30 (1 month payback)
- Landing page: free forensic analysis → upgrade to generate letters
- **Cost: $300/m**

**Affiliate Program**
- Credit repair YouTubers/bloggers get 30% recurring commission
- $8.70/user/month to affiliates — still $19.16 net per user
- Use Rewardful or FirstPromoter ($49/m)
- **Cost: $49/m + commissions**

**Free Tool as Lead Magnet**
- Free tier IS the lead magnet — 1 letter/month, 1 forensic report
- Upgrade prompt when they hit limits (already built)
- **Cost: $0**

#### Month 6-12: Scale (Target: 362 users)

**SEO Compounds**
- Blog posts start ranking, organic traffic grows
- Target featured snippets for "dispute letter template" queries
- **Cost: $0 (already invested)**

**Email Drip for Free Users**
- Day 1: Welcome + how to run first forensic analysis
- Day 3: "Your free report found X violations — here's what Pro unlocks"
- Day 7: Case study — "How [name] removed 4 negative items in 60 days"
- Day 14: "Your free letter expires in 2 days"
- **Cost: $0 (Resend already configured)**

**Partnerships**
- Credit counseling nonprofits — offer free accounts for their clients
- Real estate agents — clean credit = qualified buyers
- Car dealerships — clean credit = approved loans
- **Cost: $0, just relationship building**

### Conversion Funnel

```
Organic Traffic → Free Account → Forensic Report → Hit Limit → Upgrade
     100%            30%              60%              80%         15%
```

**Math:** To get 362 paying users at 15% free→paid conversion:
- Need ~2,414 free accounts
- At 30% visitor→signup: need ~8,047 monthly visitors
- SEO + Reddit + YouTube + $300/m ads can get there in 6-9 months

---

## 5. Retention & Churn Prevention

Credit repair has natural churn — users leave when their credit is clean. Plan for it.

### Expected Churn
- Average credit repair journey: 3-6 months
- Expected monthly churn: 8-12%
- **Lifetime value at $29/m:** $145-$217 (5-7.5 months average)

### Churn Mitigation
1. **Score tracking** — keep users engaged even after disputes resolve
2. **Ongoing monitoring** — "new negative item detected" alerts
3. **Educational content** — credit building tips, not just repair
4. **Annual plan** — $249/year locks in 12 months
5. **Attorney package** — high-value feature that takes time to build

### To Sustain 362 Users with 10% Churn
- Lose ~36 users/month
- Need ~36 new paying users/month to maintain
- At 15% conversion: need ~240 new free signups/month
- Very achievable with SEO + content + small ad spend

---

## 6. Monthly P&L at Target (362 Users)

| Line | Amount |
|------|--------|
| **Revenue** | |
| 362 users × $29 | $10,498 |
| **Expenses** | |
| Stripe (2.9% + $0.30) | -$413 |
| Supabase Pro | -$25 |
| Vercel Pro | -$20 |
| Resend | -$20 |
| Domain/DNS | -$2 |
| Google Ads | -$300 |
| Affiliate platform | -$49 |
| Affiliate commissions (est. 20% of users) | -$631 |
| **Total expenses** | **-$1,460** |
| **Net profit** | **$9,038** |

To clear a clean **$10,000/m** accounting for marketing spend and affiliate commissions, you need **~400 users** at $29/m.

---

## 7. Launch Checklist

### Before Launch
- [ ] Wire Stripe checkout with CROA disclosure (modal built, needs Stripe products)
- [ ] Create Stripe products: Pro ($29/m), Premium ($79/m), Annual ($249/y)
- [ ] Implement webhook handlers (upgrade/downgrade tier on subscription events)
- [ ] Configure Resend templates (welcome, upgrade prompts, cancellation confirmation)
- [ ] Set up Stripe customer portal for self-service billing
- [ ] Block disposable email domains on signup
- [ ] Deploy to production domain
- [ ] Submit sitemap to Google Search Console

### Week 1
- [ ] Write 5 SEO blog posts (target easiest long-tail keywords first)
- [ ] Create 3 Reddit accounts (age them before posting)
- [ ] Record 2 YouTube Shorts showing the forensic analyzer
- [ ] Set up Google Ads campaign ($10/day)
- [ ] Announce on Product Hunt (schedule for Tuesday 12:01 AM PT)

### Month 1
- [ ] 10 total blog posts published
- [ ] Daily Reddit engagement (genuine help, not spam)
- [ ] 8 YouTube Shorts published
- [ ] First 10 free users → monitor conversion
- [ ] Set up email drip sequence in Resend
- [ ] First paying customer 🎯

---

## 8. Key Metrics to Track

| Metric | Target | How |
|--------|--------|-----|
| Free signups/month | 240+ | Supabase query |
| Free → Paid conversion | 15%+ | Stripe vs signups |
| Monthly churn | <10% | Stripe cancellations |
| LTV | >$145 | Revenue / churned users |
| CAC (paid channels) | <$30 | Ad spend / conversions |
| MRR | $10,498 | Stripe dashboard |
| Net profit | $10,000+ | MRR - all costs |

---

*Generated 2026-03-13 for Tim Adams / CreditClean AI*
