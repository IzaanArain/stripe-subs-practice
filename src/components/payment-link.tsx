"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";

type TPaymentLinkProps = {
  href: string;
  paymentLink?: string;
  text: string;
};

const PaymentLink = ({ href, paymentLink, text }: TPaymentLinkProps) => {
  return (
    <Link
      href={href}
      className={buttonVariants()}
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem("stripePaymentLink", paymentLink);
        }
      }}
    >
      {text}
    </Link>
  );
};

export default PaymentLink;
