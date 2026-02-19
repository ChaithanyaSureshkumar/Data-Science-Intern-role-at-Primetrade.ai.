# Trader Performance vs Market Sentiment Analysis

## 📌 Objective

This project analyzes how **Bitcoin market sentiment (Fear vs Greed)** influences:

* Trader profitability (**PnL, win rate**)
* Trading behavior (**frequency, leverage, long/short bias**)
* Trader performance segments (**high-leverage, frequent, consistent winners**)

The goal is to extract **actionable insights** that can inform smarter trading strategies.

---

## 📂 Project Structure

```
trader-sentiment-analysis/
│
├── data/
│   ├── sentiment.csv          # Bitcoin Fear/Greed dataset
│   └── traders.csv            # Hyperliquid historical trader data
│
├── notebook/
│   └── analysis.ipynb         # Main analysis notebook
│
├── outputs/
│   ├── charts/                # Generated visualizations
│   └── tables/                # Aggregated metric tables
│
├── README.md                  # Project documentation
└── requirements.txt           # Python dependencies
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone or Download the Project

```bash
git clone <your-repo-link>
cd trader-sentiment-analysis
```

Or download the ZIP and extract it locally.

---

### 2️⃣ Create a Virtual Environment (Recommended)

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ How to Run the Analysis

### Run Jupyter Notebook

```bash
cd notebook
jupyter notebook analysis.ipynb
```

Then:

1. Open **analysis.ipynb**
2. Click **Run All Cells**
3. View:

   * Data preparation results
   * Sentiment comparison charts
   * Trader segmentation insights
   * Predictive model output

---

## 🧹 Methodology

### Data Preparation

* Cleaned and standardized column names
* Converted timestamps to **daily dates**
* Merged trader data with **Fear/Greed sentiment**
* Checked **missing values and duplicates**

### Feature Engineering

* Daily **PnL per trader**
* **Win rate** calculation
* **Trade frequency** and **average trade size**
* **Long/Short ratio**
* Trader **segmentation features**

---

## 📊 Key Findings

1. **Profitability and win rate are higher during Greed** sentiment periods.
2. **High-leverage traders perform worse during Fear**, indicating elevated downside risk.
3. **Frequent and consistent traders show more stable performance** across sentiment regimes.

---

## 💡 Strategy Recommendations

* **Reduce leverage during Fear markets** to control drawdowns.
* **Increase participation during Greed trends** with disciplined stop-loss management.
* Prefer **consistent, frequent traders** over sporadic high-risk behavior.

---

## 🤖 Bonus Analysis

* Built a **Random Forest classifier** to predict trade profitability.
* Demonstrates how **behavior + sentiment features** can support predictive trading models.

---

## 📦 Reproducibility

All results can be reproduced by:

1. Installing dependencies
2. Running `analysis.ipynb`
3. Using the provided datasets in `/data`

No external APIs are required.

---

## 🧑‍💻 Author

Submission for:

**Primetrade.ai – Data Science / Analytics Intern (Round-0 Assignment)**

---

## 📬 Contact

If you are reviewing this project and need clarification, feel free to reach out via the email provided in the internship application.
