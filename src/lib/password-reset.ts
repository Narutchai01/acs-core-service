import { config } from "../core/config/config";

const configuredRedirectURL =
  process.env.FRONTEND_RESET_PASSWORD_URL ??
  "http://localhost:3000/reset-password";
const passwordResetDeliveryURL = process.env.PASSWORD_RESET_DELIVERY_URL;

if (config.ENVIRONMENT === "production" && !passwordResetDeliveryURL) {
  throw new Error(
    "PASSWORD_RESET_DELIVERY_URL must be configured in production",
  );
}

export const passwordResetRedirectURL = new URL(
  configuredRedirectURL,
).toString();
export const passwordResetRedirectOrigin = new URL(passwordResetRedirectURL)
  .origin;

export const sendPasswordResetLink = async ({
  email,
  url,
}: {
  email: string;
  url: string;
}): Promise<void> => {
  if (!passwordResetDeliveryURL) {
    throw new Error(
      "PASSWORD_RESET_DELIVERY_URL must be configured to deliver password reset links",
    );
  }

  const response = await fetch(passwordResetDeliveryURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "password-reset",
      email,
      passwordResetURL: url,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Password reset delivery failed with status ${response.status}`,
    );
  }
};
