"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/db/prisma";
import { stripe } from "@/lib/stripe";

export async function createBillingPortal() {
  try {
    // 1. Get authenticated user from Kinde
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    // 2. Fetch the Stripe customer ID from your DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { customerId: true },
    });

    if (!dbUser?.customerId) {
      throw new Error("No Stripe customer found for this user");
    }

    // 3. Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.customerId,
      return_url: `${process.env.KINDE_SITE_URL!}/premium`,
    });

    // 4. Redirect to Stripe Billing Portal
    return { url: session.url };
  } catch (err) {
    console.error("Error creating billing portal:", err);
    throw err;
  }
}
