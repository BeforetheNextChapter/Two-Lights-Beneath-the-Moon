# Mae & Sha — A chapter in my ocean

A complete, private-by-default static memory experience. Original procedural ocean and moon, supplied memory illustrations, nine chapters including a short return to Mae, interactive memories, and a local ambient soundtrack. No dependencies, external requests, accounts, tracking, or build step.

## Open it

Double-click `index.html`. Keep all files together in this folder. The site works offline. It attempts to start the soundtrack automatically; browser restrictions may require a click, touch, or keyboard interaction first. The sound button always lets you pause or resume it.

## Project structure

```text
mae-sha-memory/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── mae.jpg
    ├── sha.jpg
    ├── ocean.jpg
    └── Lana Del Rey - Chemtrails Over The Country Club (Official Music Video).mp3
```

The supplied illustrations are included as actual JPEG files. `ocean.jpg` is an original static atmospheric fallback; JavaScript draws the animated ocean over it.

## Replace the images

Replace `assets/mae.jpg` and `assets/sha.jpg` with your own JPEG images, keeping the filenames exactly the same (lowercase). Landscape images around 1536 × 1024 are ideal. Images retain their proportions, including on phones. Update the image descriptions in `index.html` when changing the artwork. If an image is temporarily missing, its memory caption and atmospheric text fallback remain.

## Sound

The supplied MP3 is included under its original filename. HTML5 audio attempts playback on page load, loops continuously, and uses 22% volume where the browser supports volume control. Procedural ocean noise has been removed.

If autoplay is blocked, the site retries on natural interactions (pointer, touch, click, keyboard, or scroll). Some browsers do not allow scroll alone to unlock audio; a later click or tap can start it. Retry listeners are removed after actual playback starts. A manual pause cancels automatic retries, so scrolling will never override your choice.

The existing HUD displays `SOUND ON` only after the audio's `playing` event, and `SOUND OFF` while paused, buffering, blocked, or unavailable. Missing or unsupported audio is handled without interrupting the story; there is no procedural fallback.

To replace the soundtrack, copy your MP3, WAV, or OGG into `assets/` and edit the single `AMBIENT_AUDIO_PATH` constant near the top of `script.js` to match its actual filename. Browser codec support applies. A static website cannot discover arbitrary new filenames inside a folder automatically; this explicit path keeps the site compatible with opening `index.html` directly and static hosting, without a backend or directory listing.

## Edit the story and appearance

- All writing, titles, image descriptions, and chapter links are in `index.html`.
- Colors, type, layouts, mobile adjustments, and reduced-motion rules are in `style.css`.
- Ocean rendering, sound, chapter progress, image fallbacks, and interactions are in `script.js`.

Native expandable memory objects support click, touch, Enter, and Space. On narrow screens they form a horizontally swipeable strip. The mobile Chapters button opens navigation; Escape closes it. Content remains readable with JavaScript disabled. Reduced-motion preferences disable animated reveals, moving ocean, fog, ripples, tilt, and smooth scrolling. The ocean uses a capped resolution and fewer wave bands on small screens or devices with limited CPU cores; rendering stops when the tab is hidden.

Mae also has four native expandable check-in notes and a shorter illustrated interlude after the apology. Her first chapter, returning memory, and final acknowledgment together stay below 40% of the page's written content when counting headings and labels. Sha's entire main chapter is unchanged. Mysha's context is contained in a short section; the apology centers Sha and accountability. These proportions describe editorial emphasis, not fixed screen-height allocations.

## Upload to GitHub and Vercel yourself

1. Put the contents of this folder in the root of your chosen GitHub repository.
2. In Vercel, import that repository and select **Other** as the framework preset.
3. Leave the build command empty and use the repository root (`.`) as the output directory. No install command or environment variables are required.
4. If uploading the parent folder instead, set Vercel's Root Directory to `mae-sha-memory`.

Everything uses relative paths. Nothing has been published, uploaded, or connected to an external account. Review the personal story and supplied illustrations before publishing them yourself.

## Validation

Passed: JavaScript syntax, nine chapters, unique IDs, internal chapter links, local file references, JPEG file signatures, balanced CSS blocks, and an exact hash comparison of the copied MP3 against the supplied file. Comparison checks confirm Sha's main chapter, the ocean rendering code, and all original CSS remain unchanged; new styles are scoped to Mae's additions and the shorter context section.

A DOM/audio test double checked initialization, menu opening and Escape, reduced-motion initialization, image fallbacks, successful autoplay, blocked autoplay, interaction retries, listener cleanup, unsupported audio, manual pause/resume, and a pause during pending playback. These are source-level and simulated behavior checks, not full browser tests.

Visual desktop/mobile rendering and real audio playback remain unverified: the available browser's security policy blocked opening local files. Open `index.html` to review the experience on your devices before publishing.
