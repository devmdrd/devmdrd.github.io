# Muhammed Rashid — Portfolio

Personal portfolio site built with Astro, deployed on GitHub Pages.

🌐 [devmdrd.github.io](https://devmdrd.github.io)

## Stack

- [Astro](https://astro.build) — static site generator
- [Fira Code](https://fonts.google.com/specimen/Fira+Code) — monospace font
- [Font Awesome](https://fontawesome.com) — icons
- [Typed.js](https://mattboldt.com/demos/typed-js/) — typing animation
- [CountUp.js](https://inorganik.github.io/countUp.js/) — number animations
- GitHub REST API — live stats & contribution chart
- [Formspree](https://formspree.io) — contact form

## Sections

| Section    | Description                              |
|------------|------------------------------------------|
| About      | Intro, stats, live GitHub overview       |
| Skills     | Technologies grouped by category         |
| Experience | Work history with duration calculation   |
| Projects   | GitHub repos with live stars & topics    |
| GitHub     | Contribution chart, streak, top languages|
| Education  | Degrees and coursework                   |
| Contact    | Contact form + social links              |

## Structure

```
├── .github/workflows/deploy.yml
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── About.astro
│   │   ├── Skills.astro
│   │   ├── Experience.astro
│   │   ├── Projects.astro
│   │   ├── GitHub.astro
│   │   ├── Education.astro
│   │   └── Contact.astro
│   ├── pages/index.astro
│   └── styles/global.css
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── resume.pdf
│   └── assets/images/profile.webp
└── astro.config.mjs
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## License

[MIT](LICENSE)
