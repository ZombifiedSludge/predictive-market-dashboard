from KalshiClientsBase import ExchangeClient
import json
import datetime
import os

# Function to parse range midpoints
def parse_midpoint(range_str):
    try:
        # Handle ranges like "6400-6600"
        if "-" in range_str:
            parts = range_str.split("-")
            min_val = float(parts[0].replace("$", "").replace(",", ""))
            max_val = float(parts[1].replace("$", "").replace(",", ""))
            return (min_val + max_val) / 2
        # Handle ranges like ">6800"
        elif ">" in range_str:
            return float(range_str.replace(">", "").replace("$", "").replace(",", "")) + 100
        # Handle ranges like "<4000"
        elif "<" in range_str:
            return float(range_str.replace("<", "").replace("$", "").replace(",", "")) - 100
        else:
            return float(range_str.replace("$", "").replace(",", ""))
    except:
        return 0

try:
    # Connect to Kalshi
    exchange_client = ExchangeClient(
        "https://trading-api.kalshi.com", 
        "YOUR_EMAIL", 
        "YOUR_PASSWORD"
    )
    
    # Get all markets
    all_public_markets = exchange_client.get_public_markets()
    
    # Filter for S&P 500 2025 markets
    sp500_markets = []
    for market in all_public_markets['markets']:
        if 'KXINXY-25DEC31' in market.get('ticker_name', ''):
            sp500_markets.append(market['id'])
    
    # If no markets found, raise exception
    if not sp500_markets:
        raise Exception("No S&P 500 2025 markets found")
    
    # Create data structure
    bins = []
    probabilities = []
    
    # Get data for each market
    for market_id in sp500_markets:
        market_obj = exchange_client.get_market(market_id)
        yes_bid = market_obj['market']['yes_bid']
        yes_ask = market_obj['market']['yes_ask']
        est_prob = (yes_ask + yes_bid)/2
        
        # Get the range from the market title
        range_title = market_obj['market'].get('sub_title', '')
        if not range_title:
            range_title = market_obj['market'].get('title', '').split(':')[-1].strip()
        
        probabilities.append(est_prob)
        bins.append(range_title)
    
    # Calculate weighted average
    weighted_sum = 0
    total_weight = 0
    
    for i, bin_range in enumerate(bins):
        midpoint = parse_midpoint(bin_range)
        weighted_sum += midpoint * probabilities[i]
        total_weight += probabilities[i]
    
    expected_value = weighted_sum / total_weight if total_weight > 0 else 0
    
    # Create output JSON
    output = {
        "timestamp": datetime.datetime.now().isoformat(),
        "expected_value": round(expected_value, 0),
        "ranges": [{"range": b, "probability": p} for b, p in zip(bins, probabilities)]
    }
    
    # Determine the path to the public directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    public_dir = os.path.join(project_root, "public")
    
    # Write to file in your public directory
    output_path = os.path.join(public_dir, "sp500_predictions.json")
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"Successfully wrote prediction data to {output_path}")

except Exception as e:
    print(f"Error fetching Kalshi data: {e}")
    
    # If error, create a fallback file if it doesn't exist
    fallback_data = {
        "timestamp": datetime.datetime.now().isoformat(),
        "expected_value": 6450,
        "ranges": [
            {"range": "6400-6600", "probability": 35},
            {"range": "6200-6400", "probability": 25},
            {"range": "6600-6800", "probability": 20},
            {"range": "6000-6200", "probability": 15},
            {"range": "6800-7000", "probability": 5}
        ]
    }
    
    # Determine the path to the public directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    public_dir = os.path.join(project_root, "public")
    
    # Write fallback data
    output_path = os.path.join(public_dir, "sp500_predictions.json")
    if not os.path.exists(output_path):
        with open(output_path, "w") as f:
            json.dump(fallback_data, f, indent=2)
        print(f"Created fallback data at {output_path}")
