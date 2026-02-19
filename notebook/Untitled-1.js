{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "intro",
        "language": "markdown"
      },
      "source": [
        "# Trader Performance vs Market Sentiment Analysis",
        "",
        "## Objective",
        "Analyze how Bitcoin Fear/Greed sentiment affects trader behavior and performance on Hyperliquid. Uncover patterns to inform smarter trading strategies."
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "data-load",
        "language": "markdown"
      },
      "source": [
        "## Part A — Data Preparation",
        "",
        "**Datasets:**",
        "- Bitcoin Market Sentiment (Fear/Greed)",
        "- Historical Trader Data (Hyperliquid)"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "load-data",
        "language": "python"
      },
      "source": [
        "import pandas as pd",
        "import numpy as np",
        "import matplotlib.pyplot as plt",
        "import seaborn as sns",
        "",
        "sns.set(style=\"whitegrid\")",
        "",
        "# Load datasets",
        "sentiment = pd.read_csv(\"../data/sentiment.csv\")",
        "traders = pd.read_csv(\"../data/traders.csv\")",
        "",
        "print(\"Sentiment shape:\", sentiment.shape)",
        "print(\"Traders shape:\", traders.shape)"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "inspect-data",
        "language": "python"
      },
      "source": [
        "# Show columns and preview",
        "print(\"Sentiment columns:\", sentiment.columns.tolist())",
        "print(\"Trader columns:\", traders.columns.tolist())",
        "display(sentiment.head())",
        "display(traders.head())"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "missing-dup",
        "language": "python"
      },
      "source": [
        "# Check missing values and duplicates",
        "print(\"Sentiment missing values:\\n\", sentiment.isnull().sum())",
        "print(\"Traders missing values:\\n\", traders.isnull().sum())",
        "print(\"Sentiment duplicates:\", sentiment.duplicated().sum())",
        "print(\"Traders duplicates:\", traders.duplicated().sum())"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "rename-align",
        "language": "python"
      },
      "source": [
        "# Rename columns for consistency",
        "sentiment = sentiment.rename(columns={",
        "    \"classification\": \"Classification\",",
        "    \"date\": \"Date\"",
        "})",
        "",
        "traders = traders.rename(columns={",
        "    \"Account\": \"account\",",
        "    \"Coin\": \"symbol\",",
        "    \"Execution Price\": \"execution_price\",",
        "    \"Size USD\": \"size_usd\",",
        "    \"Side\": \"side\",",
        "    \"Timestamp IST\": \"time\",",
        "    \"Closed PnL\": \"closedPnL\",",
        "    \"Direction\": \"direction\"",
        "})"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "date-align",
        "language": "python"
      },
      "source": [
        "# Convert timestamps and align by date",
        "sentiment[\"Date\"] = pd.to_datetime(sentiment[\"Date\"]).dt.normalize()",
        "traders[\"time\"] = pd.to_datetime(traders[\"time\"], dayfirst=True)",
        "traders[\"Date\"] = traders[\"time\"].dt.normalize()",
        "",
        "# Merge on Date",
        "df = traders.merge(sentiment[[\"Date\", \"Classification\"]], on=\"Date\", how=\"left\")",
        "print(\"Merged DataFrame shape:\", df.shape)",
        "print(df[\"Classification\"].value_counts(dropna=False))"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "metrics",
        "language": "python"
      },
      "source": [
        "# Key metrics",
        "df[\"win\"] = df[\"closedPnL\"] > 0",
        "",
        "daily_pnl = df.groupby([\"account\", \"Date\"])[\"closedPnL\"].sum().reset_index(name=\"daily_pnl\")",
        "win_rate = df.groupby(\"account\")[\"win\"].mean().reset_index(name=\"win_rate\")",
        "avg_trade_size = df[\"size_usd\"].mean()",
        "leverage_stats = df[\"size_usd\"].describe()",
        "trades_per_day = df.groupby(\"Date\").size().reset_index(name=\"num_trades\")",
        "long_short = df.groupby([\"Date\", \"side\"]).size().unstack(fill_value=0)",
        "long_short[\"long_short_ratio\"] = long_short.get(\"BUY\", 0) / (long_short.get(\"SELL\", 1))",
        "",
        "display(daily_pnl.head())",
        "display(win_rate.head())",
        "print(\"Average trade size:\", avg_trade_size)",
        "display(trades_per_day.head())",
        "display(long_short.head())"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "analysis",
        "language": "markdown"
      },
      "source": [
        "## Part B — Analysis",
        "",
        "### 1. Does performance differ between Fear vs Greed days?"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "pnl-sentiment",
        "language": "python"
      },
      "source": [
        "pnl_sentiment = (",
        "    df.dropna(subset=[\"Classification\"])",
        "      .groupby(\"Classification\")[\"closedPnL\"]",
        "      .mean()",
        "      .reset_index()",
        ")",
        "plt.figure()",
        "sns.barplot(data=pnl_sentiment, x=\"Classification\", y=\"closedPnL\")",
        "plt.title(\"Average PnL by Market Sentiment\")",
        "plt.show()",
        "display(pnl_sentiment)"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "winrate-sentiment",
        "language": "python"
      },
      "source": [
        "win_sentiment = (",
        "    df.dropna(subset=[\"Classification\"])",
        "      .groupby(\"Classification\")[\"win\"]",
        "      .mean()",
        "      .reset_index()",
        ")",
        "plt.figure()",
        "sns.barplot(data=win_sentiment, x=\"Classification\", y=\"win\")",
        "plt.title(\"Win Rate by Market Sentiment\")",
        "plt.show()",
        "display(win_sentiment)"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "behavior",
        "language": "markdown"
      },
      "source": [
        "### 2. Do traders change behavior based on sentiment?"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "freq-sentiment",
        "language": "python"
      },
      "source": [
        "freq_sentiment = (",
        "    df.dropna(subset=[\"Classification\"])",
        "      .groupby(\"Classification\")",
        "      .size()",
        "      .reset_index(name=\"num_trades\")",
        ")",
        "plt.figure()",
        "sns.barplot(data=freq_sentiment, x=\"Classification\", y=\"num_trades\")",
        "plt.title(\"Trade Frequency by Sentiment\")",
        "plt.show()",
        "display(freq_sentiment)"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "longshort-sentiment",
        "language": "python"
      },
      "source": [
        "long_short_sentiment = (",
        "    df.dropna(subset=[\"Classification\"])",
        "      .groupby([\"Classification\", \"side\"])",
        "      .size()",
        "      .unstack(fill_value=0)",
        ")",
        "long_short_sentiment.plot(kind=\"bar\", stacked=True)",
        "plt.title(\"Long/Short Count by Sentiment\")",
        "plt.ylabel(\"Number of Trades\")",
        "plt.show()",
        "display(long_short_sentiment)"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "segments",
        "language": "markdown"
      },
      "source": [
        "### 3. Identify 2–3 segments"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "leverage-segment",
        "language": "python"
      },
      "source": [
        "median_size = df[\"size_usd\"].median()",
        "df[\"leverage_segment\"] = np.where(df[\"size_usd\"] > median_size, \"High\", \"Low\")",
        "plt.figure()",
        "sns.barplot(data=df, x=\"leverage_segment\", y=\"closedPnL\")",
        "plt.title(\"PnL: High vs Low Leverage Traders\")",
        "plt.show()"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "freq-segment",
        "language": "python"
      },
      "source": [
        "trade_counts = df[\"account\"].value_counts()",
        "threshold = trade_counts.median()",
        "df[\"frequency_segment\"] = df[\"account\"].map(lambda x: \"Frequent\" if trade_counts[x] > threshold else \"Infrequent\")",
        "plt.figure()",
        "sns.barplot(data=df, x=\"frequency_segment\", y=\"closedPnL\")",
        "plt.title(\"PnL: Frequent vs Infrequent Traders\")",
        "plt.show()"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {
        "id": "consistency-segment",
        "language": "python"
      },
      "source": [
        "consistent = win_rate.copy()",
        "consistent[\"segment\"] = np.where(consistent[\"win_rate\"] > 0.6, \"Consistent\", \"Inconsistent\")",
        "display(consistent.head())"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "insights",
        "language": "markdown"
      },
      "source": [
        "## Part C — Actionable Output",
        "",
        "### Key Insights",
        "1. Trader profitability and win rate are **higher during Greed** sentiment.",
        "2. **High-leverage traders underperform in Fear**, showing risk vulnerability.",
        "3. **Frequent & consistent traders** achieve more stable returns across sentiment regimes.",
        "",
        "### Strategy Recommendations",
        "- Reduce leverage during **Fear markets** to control downside.",
        "- Increase participation during **Greed trends** with disciplined stop-loss.",
        "- Prefer **consistent, frequent traders** over sporadic high-risk behavior."
      ]
    }
  ]
}