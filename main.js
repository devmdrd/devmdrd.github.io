document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => loadingScreen.remove(), 500);
    }
  }, 1500);

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      html.classList.add("dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    }
  }

  themeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");

    if (isDark) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    }

    updateSceneColors();
  });

  initTheme();

  const typed = new Typed("#typed-text", {
    strings: ["Software Engineer", "Full Stack Developer", "MERN Stack Developer"],
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

  let scene, camera, renderer, wireframe, glow, particleMesh;
  let animationId;

  function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    const isMobile = window.innerWidth <= 768;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    
    document.getElementById("three-container").appendChild(renderer.domElement);

    createObjects(isMobile); 
    camera.position.z = isMobile ? 7 : 5; 

    window.addEventListener("resize", onWindowResize);
    animate();
  }

  function createObjects(isMobile) {
    const torusSize = isMobile ? 1.0 : 1.5;
    const torusThickness = isMobile ? 0.3 : 0.5;
    
    const geometry = new THREE.TorusGeometry(torusSize, torusThickness, isMobile ? 8 : 16, isMobile ? 50 : 100);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: getWireColor(),
      transparent: true,
      opacity: isMobile ? 0.6 : 0.8, 
    });

    wireframe = new THREE.LineSegments(edges, material);
    scene.add(wireframe);

    const glowGeometry = new THREE.TorusGeometry(torusSize + 0.02, torusThickness + 0.02, isMobile ? 16 : 32, isMobile ? 60 : 100);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: getGlowColor(),
      transparent: true,
      opacity: isMobile ? 0.1 : 0.15, 
      blending: THREE.AdditiveBlending,
    });

    glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const particleCount = isMobile ? 50 : 100;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * (isMobile ? 2 : 3); 
    }

    particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.02 : 0.03,
      color: getWireColor(),
      transparent: true,
      opacity: isMobile ? 0.4 : 0.6, 
    });

    particleMesh = new THREE.Points(particles, particleMaterial);
    scene.add(particleMesh);
  }

  function getWireColor() {
    return html.classList.contains("dark") ? 0xffffff : 0x000000;
  }

  function getGlowColor() {
    return html.classList.contains("dark") ? 0xffffff : 0x000000;
  }

  function updateSceneColors() {
    if (wireframe && wireframe.material) {
      wireframe.material.color.setHex(getWireColor());
    }
    if (glow && glow.material) {
      glow.material.color.setHex(getGlowColor());
    }
    if (particleMesh && particleMesh.material) {
      particleMesh.material.color.setHex(getWireColor());
    }
  }

  function onWindowResize() {
    const isMobile = window.innerWidth <= 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = isMobile ? 7 : 5;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    
    cleanupThreeJS();
    initThreeJS();
  }

  let time = 0;
  function animate() {
    animationId = requestAnimationFrame(animate);

    time += 0.005;

    if (wireframe) {
      wireframe.rotation.x = time * 0.5;
      wireframe.rotation.y = time * 0.8;
    }
    if (glow) {
      glow.rotation.x = time * 0.5;
      glow.rotation.y = time * 0.8;
      glow.scale.setScalar(1 + Math.sin(time * 2) * 0.03);
    }

    if (particleMesh && particleMesh.geometry) {
      const positions = particleMesh.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] *= 0.99;
        positions[i + 1] *= 0.99;
        positions[i + 2] *= 0.99;

        if (Math.random() < 0.02) {
          positions[i] = (Math.random() - 0.5) * 3;
          positions[i + 1] = (Math.random() - 0.5) * 3;
          positions[i + 2] = (Math.random() - 0.5) * 3;
        }
      }
      particleMesh.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function cleanupThreeJS() {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", onWindowResize);

    if (renderer) {
      renderer.dispose();
      const container = document.getElementById("three-container");
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }

    [wireframe, glow, particleMesh].forEach((obj) => {
      if (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });
  }

  initThreeJS();

  const form = document.getElementById("contactFormDesktop");
  if (form) {
    const success = document.getElementById("formSuccessDesktop");
    const error = document.getElementById("formErrorDesktop");
    const submitText = document.getElementById("submitText");
    const submitSpinner = document.getElementById("submitSpinner");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      success?.classList.add("hidden");
      error?.classList.add("hidden");
      if (submitText) submitText.textContent = "Sending...";
      if (submitSpinner) submitSpinner.classList.remove("hidden");

      try {
        const formData = new FormData(form);
        const response = await fetch("https://formspree.io/f/mnnvvnwp", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.ok) {
          form.reset();
          success?.classList.remove("hidden");
          setTimeout(() => success?.classList.add("hidden"), 5000);
        } else {
          const errorData = await response.json();
          if (error && errorData.errors) {
            error.textContent = errorData.errors.map((err) => err.message).join(", ");
          }
          error?.classList.remove("hidden");
          setTimeout(() => error?.classList.add("hidden"), 5000);
        }
      } catch (err) {
        if (error) {
          error.textContent = "Network error. Please try again later.";
          error.classList.remove("hidden");
          setTimeout(() => error.classList.add("hidden"), 5000);
        }
      } finally {
        if (submitText) submitText.textContent = "Send Message";
        if (submitSpinner) submitSpinner.classList.add("hidden");
      }
    });
  }

  window.addEventListener("beforeunload", cleanupThreeJS);
});