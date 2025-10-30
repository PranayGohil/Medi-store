import axios from "axios";

// Currency conversion utility
class CurrencyConverter {
  constructor() {
    this.exchangeRates = {
      USD_TO_IDR: 15800, // Default fallback rate (update this periodically)
    };
    this.lastUpdate = null;
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Method 1: Use static exchange rate (faster, but needs manual updates)
  convertUSDtoIDR_Static(amountUSD) {
    const amountIDR = Math.round(
      parseFloat(amountUSD) * this.exchangeRates.USD_TO_IDR
    );
    console.log(
      `💱 Currency Conversion: $${amountUSD} USD = ${amountIDR} IDR (Rate: ${this.exchangeRates.USD_TO_IDR})`
    );
    return amountIDR;
  }

  // Method 2: Fetch live exchange rate (slower, but always accurate)
  async convertUSDtoIDR_Live(amountUSD) {
    try {
      // Check if we need to update the rate
      const now = Date.now();
      if (!this.lastUpdate || now - this.lastUpdate > this.cacheExpiry) {
        await this.updateExchangeRate();
      }

      const amountIDR = Math.round(
        parseFloat(amountUSD) * this.exchangeRates.USD_TO_IDR
      );
      console.log(
        `💱 Currency Conversion: $${amountUSD} USD = ${amountIDR} IDR (Rate: ${this.exchangeRates.USD_TO_IDR})`
      );
      return amountIDR;
    } catch (error) {
      console.error("❌ Error in live currency conversion:", error.message);
      // Fallback to static rate if API fails
      return this.convertUSDtoIDR_Static(amountUSD);
    }
  }

  // Update exchange rate from API
  async updateExchangeRate() {
    try {
      console.log("🔄 Fetching latest exchange rates...");

      // Option 1: Using exchangerate-api.com (free, no API key required)
      const response = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );

      if (response.data && response.data.rates && response.data.rates.IDR) {
        this.exchangeRates.USD_TO_IDR = response.data.rates.IDR;
        this.lastUpdate = Date.now();
        console.log(
          `✅ Exchange rate updated: 1 USD = ${this.exchangeRates.USD_TO_IDR} IDR`
        );
      }
    } catch (error) {
      console.error(
        "⚠️ Failed to fetch exchange rate, using cached/default rate:",
        error.message
      );

      // Alternative: Try another free API as backup
      try {
        const backupResponse = await axios.get(
          "https://open.er-api.com/v6/latest/USD"
        );
        if (
          backupResponse.data &&
          backupResponse.data.rates &&
          backupResponse.data.rates.IDR
        ) {
          this.exchangeRates.USD_TO_IDR = backupResponse.data.rates.IDR;
          this.lastUpdate = Date.now();
          console.log(
            `✅ Exchange rate updated from backup API: 1 USD = ${this.exchangeRates.USD_TO_IDR} IDR`
          );
        }
      } catch (backupError) {
        console.error("⚠️ Backup API also failed, using default rate");
      }
    }
  }

  // Get current exchange rate
  getCurrentRate() {
    return this.exchangeRates.USD_TO_IDR;
  }

  // Manual rate update (for admin control)
  setExchangeRate(rate) {
    this.exchangeRates.USD_TO_IDR = rate;
    this.lastUpdate = Date.now();
    console.log(`✅ Exchange rate manually set: 1 USD = ${rate} IDR`);
  }
}

// Create singleton instance
const currencyConverter = new CurrencyConverter();

// Initialize exchange rate on startup
currencyConverter.updateExchangeRate().catch((err) => {
  console.log("Using default exchange rate on startup");
});

export default currencyConverter;

// Export individual functions for convenience
export const convertUSDtoIDR = async (amountUSD, useLiveRate = true) => {
  if (useLiveRate) {
    return await currencyConverter.convertUSDtoIDR_Live(amountUSD);
  } else {
    return currencyConverter.convertUSDtoIDR_Static(amountUSD);
  }
};

export const getCurrentExchangeRate = () => {
  return currencyConverter.getCurrentRate();
};

export const setExchangeRate = (rate) => {
  currencyConverter.setExchangeRate(rate);
};
