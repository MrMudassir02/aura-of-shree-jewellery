import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F5EBDD] text-[#3A1A1B]">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <Link href="/" className="text-sm text-[#806D60] hover:text-[#3A1A1B]">
          ← Back to home
        </Link>
        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-[#967344]">
          Your information
        </p>
        <h1 className="mt-5 font-serif text-5xl sm:text-6xl">Privacy policy</h1>
        <p className="mt-4 text-xs text-[#806D60]">
          Last updated: 12 October 2026
        </p>
        <p className="mt-6 text-sm leading-8 text-[#806D60]">
          This page explains the main categories of information the Aura of
          Shree Jewellery website may process when you browse, register, or
          place an order. The final policy should be reviewed against the
          store’s actual operations and applicable law before launch.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="font-serif text-2xl">Information you provide</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Account and order workflows may collect details such as your name,
              email address, phone number, delivery address, and information
              needed to manage purchases and customer requests.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">How information is used</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Information may be used to operate your account, verify your
              email, process orders and payments, communicate about
              transactions, prevent misuse, and maintain website security.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Payments</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Payments are initiated through the configured Razorpay checkout.
              Do not send card details, banking passwords, or payment OTPs
              through ordinary messages. Review the payment provider’s privacy
              terms for information about its processing practices.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Storage and security</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              The application uses database-backed account and order records and
              browser storage for shopping-bag functionality. Reasonable
              technical safeguards should be maintained, but no online system
              can guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Your choices and requests</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              Requests to access, correct, or delete personal information should
              be handled through the store’s verified support channel, subject
              to applicable legal and transaction-retention requirements.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl">Policy updates</h2>
            <p className="mt-3 text-sm leading-8 text-[#806D60]">
              This policy may be updated when website features, data practices,
              or legal requirements change. The published version should reflect
              the store’s actual practices.
            </p>
          </section>
        </div>

        <p className="mt-14 border-t border-[#3A1A1B]/15 pt-8 text-sm leading-7 text-[#806D60]">
          This is a starter policy, not a legal review. Confirm the data
          retention, cookie, analytics, support, and privacy-request procedures
          before treating it as the final business policy.
        </p>
      </section>
    </main>
  );
}
