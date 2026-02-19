pnl_sentiment = (
    df.dropna(subset=["Classification"])
      .groupby("Classification")["closedPnL"]
      .mean()
      .reset_index()
)

print("pnl_sentiment DataFrame:")
print(pnl_sentiment)

if not pnl_sentiment.empty and "Classification" in pnl_sentiment.columns and "closedPnL" in pnl_sentiment.columns:
    plt.figure()
    sns.barplot(data=pnl_sentiment, x="Classification", y="closedPnL")
    plt.title("Average PnL by Market Sentiment")
    plt.show()
else:
    print("No data to plot or columns missing.")