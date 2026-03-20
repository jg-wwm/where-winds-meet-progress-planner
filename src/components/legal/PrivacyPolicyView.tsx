import { SectionCard } from '../shared/SectionCard'

export const PrivacyPolicyView = () => {
  return (
    <div className="mx-auto grid max-w-[980px] gap-6">
      <div className="py-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--wwm-text)]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[var(--wwm-text-muted)]">
          Last updated: March 19, 2026
        </p>
      </div>

      <SectionCard title="Overview">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            Where Winds Meet Progress Planner is an unofficial fan-made
            companion tool for the game <strong className="text-[var(--wwm-text)]">Where Winds Meet</strong>.
          </p>
          <p>
            This site is designed to help players track mystic progression,
            manage planning data, and use related companion features. The app
            runs primarily in your browser and does not require a user account.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Information We Collect">
        <div className="grid gap-6 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--wwm-text)]">
              Local Storage
            </h3>
            <p>
              Planner data you enter, such as characters, skill targets,
              inventory values, and app preferences, is stored locally in your
              browser on your device.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--wwm-text)]">
              No User Accounts
            </h3>
            <p>
              We do not ask you to create an account, and we do not collect
              names, email addresses, passwords, or profile information through
              this tool.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--wwm-text)]">
              No Analytics at Launch
            </h3>
            <p>
              This site does not use analytics or visitor tracking tools at
              launch.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Import and Export Files">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            When you import a planner JSON file, that file is processed in your
            browser so the data can be loaded into the app.
          </p>
          <p>
            When you export a planner JSON file, the file is created in your
            browser and downloaded to your device using your browser’s normal
            download behavior.
          </p>
          <p>
            Imported and exported planner files are controlled by you on your
            own device.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Cookies and Local Storage">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            This app uses browser local storage to remember planner data and
            related settings on your device.
          </p>
          <p>
            The app does not currently use a cookie banner because it does not
            use analytics or advertising cookies at launch.
          </p>
          <p>
            Your browser or hosting provider may still use technically necessary
            cookies or similar technologies for security, performance, or basic
            site delivery.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Third-Party Services">
        <div className="grid gap-6 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--wwm-text)]">
              Hosting Provider
            </h3>
            <p>
              This site is hosted by a third-party static hosting provider.
              That provider may collect limited technical information such as IP
              address, request logs, or basic diagnostic data as part of normal
              site hosting and security operations.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--wwm-text)]">
              External Links
            </h3>
            <p>
              This site may include links to third-party sites such as game
              resources, community tools, Discord, Reddit, or other websites.
              Those sites have their own policies and practices.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Your Choices">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>You can:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>clear this site’s local data through your browser settings</li>
            <li>choose whether or not to import planner files</li>
            <li>delete exported planner files from your device at any time</li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard title="Data Retention">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            Data stored in browser local storage remains available until you
            clear it, reset it, or remove it through your browser or device.
          </p>
          <p>
            Exported planner files remain on your device until you move or
            delete them.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Changes to This Policy">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            This privacy policy may be updated from time to time as the site
            grows. Significant updates will be reflected by changing the “Last
            updated” date at the top of this page.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Contact">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            If you have questions, feedback, or privacy-related concerns about
            this tool, use the community contact method you choose to publish
            with the site, such as Discord, Reddit, or another public channel.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Disclaimer">
        <div className="grid gap-4 text-[15px] leading-8 text-[var(--wwm-text-muted)]">
          <p>
            Where Winds Meet Progress Planner is an unofficial fan-made tool. It
            is not affiliated with, endorsed by, or connected to the developers,
            publishers, or rights holders of <strong className="text-[var(--wwm-text)]">Where Winds Meet</strong>.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}