# CCivics

CCivics is a small Manifest V3 browser extension that previews activities found on supported `inscripcionscc.com` Centre Cívic pages. It deliberately stops before Google Calendar integration.

## Install locally

1. Open `chrome://extensions` (or the equivalent extensions page in a Chromium browser).
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository.
4. Visit an `https://*.inscripcionscc.com/` activity listing and use the CCivics toolbar button.

The extension performs extraction only when the button is pressed. The popup lets you choose Catalan, Spanish, or English and light, dark, or system theme.

## Development

The extractor treats each candidate DOM element as an independent activity block; it does not parse the document as a single text stream. Its returned objects use the V0.1 event model and can later be passed to another integration layer.
