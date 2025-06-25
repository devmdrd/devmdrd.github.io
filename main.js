document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector(".loading-screen").style.opacity = "0";
    setTimeout(function () {
      document.querySelector(".loading-screen").style.display = "none";
    }, 500);
  }, 1500);

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      html.classList.add("dark");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  }

  themeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");

    if (isDark) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  });

  initTheme();

  const typed = new Typed("#typed-text", {
    strings: [
      "Software Engineer",
      "Full Stack Developer",
      "MERN Stack Developer",
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    showCursor: false,
  });

  window.addEventListener("scroll", function () {
    const backToTop = document.getElementById("backToTop");
    if (window.pageYOffset > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  document.getElementById("backToTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  document.getElementById("particles-js").appendChild(renderer.domElement);

  function getParticleColor() {
    return html.classList.contains("dark") ? 0xffffff : 0x000000;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: getParticleColor(),
    transparent: true,
    opacity: 0.8,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 3;

  function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  themeToggle.addEventListener("click", function () {
    particlesMaterial.color.setHex(getParticleColor());
  });

  const form = document.getElementById("contactFormDesktop");
  const success = document.getElementById("formSuccessDesktop");
  const error = document.getElementById("formErrorDesktop");
  const submitText = document.getElementById("submitText");
  const submitSpinner = document.getElementById("submitSpinner");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    success.classList.add("hidden");
    error.classList.add("hidden");
    submitText.textContent = "Sending...";
    submitSpinner.classList.remove("hidden");

    try {
      const formData = new FormData(form);
      const response = await fetch("https://formspree.io/f/mnnvvnwp", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        success.classList.remove("hidden");
        setTimeout(() => success.classList.add("hidden"), 5000);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          error.textContent = errorData.errors
            .map((err) => err.message)
            .join(", ");
        }
        error.classList.remove("hidden");
        setTimeout(() => error.classList.add("hidden"), 5000);
      }
    } catch (err) {
      error.textContent = "Network error. Please try again later.";
      error.classList.remove("hidden");
      setTimeout(() => error.classList.add("hidden"), 5000);
    } finally {
      submitText.textContent = "Send Message";
      submitSpinner.classList.add("hidden");
    }
  });
});
