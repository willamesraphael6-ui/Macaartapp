
import { CAKTO_CONFIG } from "../constants";

export const caktoService = {
  getAccessToken: async (): Promise<string | null> => {
    try {
      const response = await fetch(CAKTO_CONFIG.authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: CAKTO_CONFIG.clientId,
          client_secret: CAKTO_CONFIG.clientSecret
        })
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.access_token || null;
    } catch (error) {
      console.warn("Cakto connection error (CORS or Network).");
      return null;
    }
  },

  checkSubscriptionStatus: async (email: string): Promise<boolean> => {
    try {
      const token = await caktoService.getAccessToken();
      if (!token) return false;

      const response = await fetch(CAKTO_CONFIG.subscriptionUrl + "?email=" + encodeURIComponent(email), {
        headers: {
          "Authorization": "Bearer " + token,
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) return false;
      const data = await response.json();
      return data.data?.some((sub: any) => sub.status === "active" || sub.status === "trialing") || false;
    } catch (error) {
      console.warn("Subscription check failed, assuming free user.");
      return false;
    }
  },

  getMonthlyCheckoutLink: () => {
    return CAKTO_CONFIG.checkoutMensal;
  },

  getCreditsCheckoutLink: () => {
    return CAKTO_CONFIG.checkoutCreditos;
  }
};
