# HELP TO GET JOB // CANDIDATE INTAKE TERMINAL
**Static Web Application for GitHub Pages // Precision Architectural Brutalism**

A high-conversion, ultra-professional candidate intake and career dispatch portal engineered for the **"Help to Get Job"** community (originating from our Instagram community `@helptogetjob`).

---

## 1. DESIGN SPECIFICATION & ETHOS: ARCHITECTURAL BRUTALISM
This application strictly adheres to the **Anti-"AI Slop" Design System**:
- **Zero Pill Shapes:** Maximum `border-radius: 0px` across the entire application. Sharp, precision-cut corners.
- **Zero Symmetrical SaaS Cards:** No rounded cards, no glassmorphism, no fake gradient text, no blurred background blobs.
- **Monochrome + International Signal Accent:**
  - Canvas Deep Carbon: `#08080A`
  - Elevated Graphite: `#0F1014`
  - Exposed 1px Structural Grid Lines: `#22242A`
  - Active Crisp Off-White: `#EAEAEA`
  - Aerospace Signal Orange: `#FF3B00` (<5% visual weight for key vectors & actions)
- **High-Performance Swiss & Engineering Typography:**
  - Display / Headlines: `Space Grotesk` (Tight `-0.03em` tracking, bold uppercase)
  - Telemetry & Technical Labels: `JetBrains Mono` (`0.75rem`, letter-spacing `0.1em`)
  - Body & Form Elements: `Inter`
- **Exposed Blueprint Grid & Corner Crosshairs:** `6px` precision `+` crosshairs at major architectural junctions.

---

## 2. 3D WEBGL ENGINE (THREE.JS)
Integrated into the sticky Left Architectural Pane:
- **Visual Core:** Abstract, precision-engineered **3D Topographic Wireframe Monolith** and concentric orbital gyro rings rendered in muted technical steel (`#3A3F4B`) with stark white (`#F4F4F6`) and signal orange (`#FF3B00`) vertex points. Zero cheesy plastic/glossy materials.
- **Mouse Parallax:** Damped real-time tracking of cursor coordinates.
- **Form Progress Reactivity:** Dynamically tracks completion percentage across Section `[01]`, `[02]`, and `[03]`. As fields are filled, the geometry increments its rotational matrix.
- **Submission Trajectory Lock:** Upon dossier dispatch, the 3D geometry rapidly aligns along a locked vertical vector ray symbolizing career trajectory lock.

---

## 3. HEADLESS GOOGLE FORM INTEGRATION ARCHITECTURE

The application routes submissions directly to your Google Form:
`https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/formResponse`

### Critical Requirement: Zero Google Branding & No Google Redirect
- **Silent Submission:** Submits via a hidden targeting iframe (`#hidden_submission_target`) and redundant `no-cors` fetch. The candidate is **NEVER** redirected to Google's generic confirmation page.
- **Mission Control Post-Submission:** The terminal instantly transitions into an in-app mission control receipt view displaying:
  - A unique **Candidate Transmission ID** (`HTGJ-2026-XXXX`)
  - Verification timestamp and status readout (`DOSSIER LOGGED // MENTOR REVIEW QUEUED`)
  - Full candidate dossier summary
  - Downloadable `.TXT` receipt generator
  - Direct CTA back to the **Help to Get Job Instagram community** (`@helptogetjob`)

---

## 4. OVERCOMING GOOGLE'S "SIGN IN TO GOOGLE" FILE UPLOAD WALL

### Why Google Shows "Sign in to your Google Account":
When a Google Form has a native "File Upload" question enabled, Google **forces all visitors to sign into a Google account** because Google uploads files directly into the form owner's personal Google Drive. This causes standard cross-origin anonymous submissions to hit Google's login wall.

### The Solution:
We provide **two zero-login transmission methods**:
1. **Cloud Resume Link (Direct):** Candidates can provide a Google Drive, Dropbox, Notion, LinkedIn, or GitHub resume link.
2. **Lightweight Google Apps Script Webhook (Recommended for File Uploads):**
   We have included `google-apps-script/Code.gs`. This creates an open Google Apps Script endpoint that:
   - Accepts the candidate dossier JSON payload + Base64-encoded resume file.
   - Automatically writes the submission into your Google Sheet.
   - Automatically saves the uploaded PDF/DOCX into a Google Drive folder (`Help to Get Job - Resumes`) and stores the link in the sheet.
   - **Candidates NEVER see a Google login prompt!**

#### How to Deploy Google Apps Script (in 60 seconds):
1. Open the Google Sheet linked to your Google Form (or create a new Sheet).
2. Go to `Extensions` > `Apps Script`.
3. Paste the contents of `google-apps-script/Code.gs`.
4. Click **Deploy** > **New deployment**.
5. Select **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the generated Web App URL (`https://script.google.com/macros/s/.../exec`).
7. Open `src/config/formConfig.ts` and paste the URL into `appsScriptWebhookUrl`.

---

## 5. LOCAL DEVELOPMENT & BUILD

```bash
# Install dependencies
npm install

# Run local development server (http://localhost:3000)
npm run dev

# Compile TypeScript and build static bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 6. GITHUB PAGES DEPLOYMENT

This repository is 100% static and pre-configured for GitHub Pages:
1. Push this repository to GitHub.
2. In GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` will automatically build and publish the site on every push to `main`!
