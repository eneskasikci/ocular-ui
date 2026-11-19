import { useEffect } from 'react'
import { SUPPORT_EMAIL } from '../../config'
import { SubpageLayout } from './SubpageLayout'

const PROSE_CLS =
  'mt-8 pt-6 border-t border-hair [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-[1.25rem] [&_h2]:leading-[1.2] [&_h2]:mb-3 [&_p]:text-ink-muted [&_p]:leading-[1.6] [&_li]:text-ink-muted [&_li]:leading-[1.6] [&_li]:mb-[0.55em] [&_ul]:mt-0 [&_ul]:mb-4 [&_ul]:pl-5 [&_strong]:text-silver [&_code]:font-mono [&_code]:font-medium [&_code]:text-[0.88em] [&_code]:px-[0.4em] [&_code]:py-[0.1em] [&_code]:rounded-[6px] [&_code]:bg-graphite [&_code]:[overflow-wrap:anywhere]'

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — Ocular'
  }, [])

  return (
    <SubpageLayout active="privacy" backdrop="meridian" as="article">
      <h1 className="font-display font-bold text-[clamp(2rem,7vw,3.3rem)] leading-[1.05] tracking-[-0.025em] m-0">
        Privacy Policy for Ocular
      </h1>
      <p className="mt-3 mb-6 font-mono font-medium text-[0.84rem] leading-[1.4] text-ink-subtle">
        Effective date: November 19, 2026
      </p>

      <div
        className="mb-9 px-5 py-[18px] rounded-2xl bg-[#0a2e24]/90 border border-emerald/58 [&_p:last-child]:mb-0"
        role="note"
        aria-label="Privacy summary"
      >
        <p className="mb-2 font-mono font-bold text-[0.76rem] leading-[1.3] tracking-[0.12em] uppercase text-emerald-ink">
          Summary · Zero Data Collected
        </p>
        <p>
          <strong>No personal data collected. No accounts. No tracking.</strong> Your photos, RAW captures, EXIF
          notes, and custom film recipes stay strictly on your device.
        </p>
      </div>

      <section className={PROSE_CLS} aria-labelledby="s1">
        <h2 id="s1">1. Data Collection</h2>
        <p>
          Ocular does not collect, transmit, store on external servers, sell, or share any personal information,
          usage analytics, crash telemetry, or advertising identifiers.
        </p>
        <p>Ocular v1 has no user accounts, no login system, and no backend servers operated by the developer.</p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s2">
        <h2 id="s2">2. Camera, Photos &amp; Local Storage</h2>
        <p>All image processing happens locally on your iPhone or iPad:</p>
        <ul>
          <li>
            <strong>Camera &amp; Captures:</strong> Live viewfinder frames and captured JPEG, HEIF, or RAW/DNG
            photos are processed entirely on your device and saved to your Apple Photos library. Ocular never uploads
            or accesses your photos off-device.
          </li>
          <li>
            <strong>Recipes &amp; Preferences:</strong> Your custom film recipes and camera preferences are stored
            locally in app storage (<code>UserDefaults</code>) on your device.
          </li>
          <li>
            <strong>Location &amp; EXIF Metadata:</strong> Ocular records optical camera settings and optional
            film-look notes locally inside photo metadata. GPS location metadata is never written to photos unless
            you explicitly enable location tagging.
          </li>
        </ul>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s3">
        <h2 id="s3">3. System Permissions &amp; Revoking Consent</h2>
        <p>Ocular only requests iOS permissions directly needed for photography:</p>
        <ul>
          <li>
            <strong>Camera:</strong> Used solely to display the live viewfinder and capture photos.
          </li>
          <li>
            <strong>Photo Library:</strong> Used to save your captured photos, display your recent shots, and allow
            re-developing RAW photos with film recipes inside the darkroom.
          </li>
        </ul>
        <p>
          You can review, limit, or revoke Camera or Photo Library access at any time in{' '}
          <strong>iOS Settings &rarr; Ocular</strong>. Paid features never depend on granting tracking or unrelated
          permissions.
        </p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s4">
        <h2 id="s4">4. In-App Purchases &amp; Subscriptions</h2>
        <p>
          Optional Ocular Pro subscriptions (monthly and annual plans, including any eligible 3-day introductory free
          trial) and the Lifetime purchase are processed exclusively by Apple through StoreKit and the App Store.
        </p>
        <p>
          Ocular never receives, processes, or stores your payment card details, billing address, or Apple Account
          credentials. To understand how Apple handles transaction data, please review{' '}
          <a href="https://www.apple.com/legal/privacy/" rel="noopener noreferrer">
            Apple&apos;s Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s5">
        <h2 id="s5">5. Third-Party SDKs &amp; Tracking</h2>
        <p>
          Ocular contains no third-party analytics SDKs, no advertising frameworks, and no tracking domains (
          <code>NSPrivacyTracking</code> is disabled in the app&apos;s privacy manifest). No third party receives
          user data through Ocular.
        </p>
        <p>
          This website (<code>ocular-camera.pages.dev</code>) is purely static and sets no cookies, runs no
          analytics scripts, and loads no third-party tracking assets.
        </p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s6">
        <h2 id="s6">6. Data Retention &amp; Deletion</h2>
        <p>
          Because Ocular stores no personal data on external servers, you remain in full control of all retention
          and deletion directly on your device:
        </p>
        <ul>
          <li>Delete individual photos anytime in the Apple Photos app.</li>
          <li>Reset camera preferences inside Ocular&apos;s Settings screen.</li>
          <li>
            Uninstall Ocular from your device to permanently delete all locally stored custom recipes and app
            preferences.
          </li>
        </ul>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s7">
        <h2 id="s7">7. Children&apos;s Privacy</h2>
        <p>
          Ocular does not knowingly collect personal data from anyone, including children under the age of 13 (or
          the applicable minimum age in your jurisdiction).
        </p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s8">
        <h2 id="s8">8. Changes to This Policy</h2>
        <p>
          If Ocular&apos;s functionality changes in a future update (for example, if optional cloud sync is ever
          introduced), this Privacy Policy will be updated at <code>https://ocular-camera.pages.dev/privacy</code>{' '}
          with a new effective date before those changes take effect.
        </p>
      </section>

      <section className={PROSE_CLS} aria-labelledby="s9">
        <h2 id="s9">9. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy or Ocular&apos;s privacy practices, contact the
          developer at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. If you choose to email feedback from
          within the app, your mail app only sends the message and basic app, iOS, and device version details you
          choose to include, used solely to respond and improve Ocular.
        </p>
      </section>
    </SubpageLayout>
  )
}
