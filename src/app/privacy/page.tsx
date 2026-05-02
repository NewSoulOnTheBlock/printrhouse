export const metadata = { title: "Privacy Policy · Printrhouse" };

export default function PrivacyPage() {
  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-3xl mx-auto text-white/80 leading-relaxed">
      <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="mb-6">
        Worried about doxxing? At Printrhouse, your privacy is our priority. We keep your Web3
        identity and shipping info completely separate.
      </p>

      <h2 className="text-white text-xl font-bold mt-6 mb-2">What we collect &amp; why</h2>
      <p className="mb-4">
        We only gather what&apos;s needed to run the platform: email, wallet address, name, shipping
        address, phone, order history, and basic technical data. Shipping details go solely to
        carriers for delivery — never for marketing or sale. Carriers never see your wallet or
        blockchain data. Your on-chain activity stays disconnected from personal details.
      </p>

      <h2 className="text-white text-xl font-bold mt-6 mb-2">How we protect you</h2>
      <ul className="list-none space-y-1 mb-4">
        <li>✓ We never sell your data</li>
        <li>✓ Private keys stay in your control</li>
        <li>✓ Robust encryption and security measures</li>
        <li>✓ Strict segregation between Web3 identity and physical shipping info</li>
        <li>! Public wallet addresses and blockchain transactions remain visible on-chain</li>
      </ul>

      <h2 className="text-white text-xl font-bold mt-6 mb-2">How we use data</h2>
      <p className="mb-4">
        Verify ownership, process orders/payments, manage shipping, provide support, and improve
        our platform. Credit cards are handled by Stripe; crypto via Solana. We don&apos;t store card
        info.
      </p>

      <h2 className="text-white text-xl font-bold mt-6 mb-2">Your rights</h2>
      <p className="mb-4">
        Access, correct, delete, or export your data. Opt out of marketing anytime. EU/UK and
        California users have additional rights under GDPR and CCPA.
      </p>

      <h2 className="text-white text-xl font-bold mt-6 mb-2">Updates</h2>
      <p className="mb-6">
        We&apos;ll notify you of material changes. Questions? Contact{" "}
        <a href="mailto:support@printrhouse" className="text-ph-cyan hover:underline">
          support@printrhouse
        </a>
        .
      </p>

      <p className="text-white/40 text-sm">Printrhouse © 2026</p>
    </div>
  );
}
