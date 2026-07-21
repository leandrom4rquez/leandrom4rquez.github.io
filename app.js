(function() {
  'use strict';

  // ---- 1. CORE VARIABLES & DOM SELECTORS ----
  var $html = document.documentElement;
  var $body = document.body;
  var lang = localStorage.getItem("cv-lang") || "en";

  // ---- 2. STATIC MEDIA DATABASE (PREVENTS 404 SPAM) ----
  var PROJECT_MEDIA = {
    between: [
      "images/between-songs-demons-dim-haunted-corrido-comp.webp",
      "images/between-songs-demons-flashlight-characte-comp.webp",
      "images/between-songs-demons-foggy-forest-path-comp.webp"
    ],
    alloy: [
      "images/alloy-landing-and-whatsapp-chat-mockup-comp.webp",
      "images/alloy-whatsapp-business-chat-automation-comp.webp",
      "images/alloy-analytics-dashboard.webp"
    ],
    light: [
      "images/headlight-intrusion-onto-a-house-at-nigh-comp.webp",
      "images/aerial-site-plan-of-the-proposed-road-at-comp.webp",
      "images/interior-view-of-light-intrusion-through-comp.webp"
    ],
    videobooth: [
      "images/before-and-after-background-removal-comp.webp",
      "images/desktop-ui-with-timeline-and-model-selec.webp",
      "images/clean-cutout-with-fine-hair-detail.webp"
    ],
    psxcycles: [
      "images/psx-cycles-demo.mp4"
    ],
    rigidanim: [
      "images/rigidanim-merger-summary.webp"
    ],
    gemjoy: [
      "images/gemjoy-demo-1.webp",
      "images/gemjoy-demo-2.webp",
      "images/gemjoy-demo-3.webp"
    ],
    canal4: [
      "images/canal4-automation.webp"
    ]
  };

  // ---- 3. LENIS SMOOTH SCROLL ----
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (window.Lenis && !window.matchMedia("(prefers-reduced-motion:reduce)").matches && !isTouch) {
    var lenis = new Lenis({
      lerp: 0.12,
      duration: 1.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.__lenis = lenis;

    // smooth anchors scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener("click", function(e) {
        var id = a.getAttribute("href").slice(1);
        if (id === "") return;
        var el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -80 });
        }
      });
    });
  }

  // ---- 4. TRANSLATIONS (EN / ES) ----
  function applyLang(l) {
    lang = l;
    $html.lang = l;
    document.querySelectorAll("[data-en]").forEach(function(el) {
      var txt = el.getAttribute("data-" + l);
      if (txt !== null) el.innerHTML = txt;
    });
    document.querySelectorAll(".lang button").forEach(function(btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === l);
    });
    var langEl = document.querySelector(".lang");
    if (langEl) langEl.setAttribute("data-active", l);
    if (window.updateBttTip) window.updateBttTip();
    localStorage.setItem("cv-lang", l);
  }
  document.querySelectorAll(".lang button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      applyLang(btn.getAttribute("data-lang"));
    });
  });
  applyLang(lang);

  // ---- 5. REVEAL SYSTEM ON SCROLL (STAGGERED) ----
  function observeReveals(scope) {
    function applyStagger(el) {
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = [].slice.call(parent.querySelectorAll(":scope > .reveal"));
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 65) + "ms";
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting) {
            applyStagger(en.target);
            en.target.classList.add("in");
            var txt = en.target.querySelector(".txt-reveal");
            if (txt) {
              txt.querySelectorAll(".word").forEach(function(w, i) {
                w.style.transitionDelay = (i * 35) + "ms";
                w.classList.add("in");
              });
            }
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.1 });
      (scope || document).querySelectorAll(".reveal").forEach(function(el) {
        io.observe(el);
      });
    } else {
      (scope || document).querySelectorAll(".reveal").forEach(function(el) {
        el.classList.add("in");
      });
    }
  }

  // Split text for custom sliding typography
  document.querySelectorAll(".txt-reveal").forEach(function(el) {
    var txt = el.textContent.trim();
    if (!txt) return;
    el.innerHTML = "";
    var parts = txt.split(/\s+/);
    parts.forEach(function(w, i) {
      var sp = document.createElement("span");
      sp.className = "word";
      sp.textContent = w;
      el.appendChild(sp);
      if (i < parts.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });
  observeReveals();

  // ---- 6. MOUSE GLOW & TILT EFFECTS ----
  (function() {
    var blocks = document.querySelectorAll(".card, .skill-block, .blog-card, .t-card, .yt-card");
    blocks.forEach(function(el) {
      // Glow tracking
      el.addEventListener("mousemove", function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty("--mx", x + "px");
        el.style.setProperty("--my", y + "px");
      });

      // 3D Perspective Tilt (subtle, 5deg max)
      el.classList.add("tilt-perspective");
      var inner = el.querySelector(":scope > *");
      if (!inner) inner = el;
      inner.classList.add("tilt-inner");

      el.addEventListener("mousemove", function(e) {
        var rect = el.getBoundingClientRect();
        var tiltX = (e.clientX - rect.left) / rect.width - 0.5;
        var tiltY = (e.clientY - rect.top) / rect.height - 0.5;
        inner.style.transform = "rotateY(" + (tiltX * 10) + "deg) rotateX(" + (-tiltY * 10) + "deg)";
      });

      el.addEventListener("mouseleave", function() {
        inner.style.transform = "";
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  })();

  // ---- 8. MAGNETIC PHYSICS FOR BUTTONS ----
  (function() {
    var magnets = document.querySelectorAll(".btn:not(.btn-icon), .btn-detail");
    magnets.forEach(function(btn) {
      btn.addEventListener("mousemove", function(e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = "translate(" + (x * 12) + "px, " + (y * 12) + "px)";
      });
      btn.addEventListener("mouseleave", function() {
        btn.style.transform = "";
      });
    });
  })();

  // ---- 9. JAW-DROPPING FLUID MESH BACKGROUND (CANVAS SIMPLEX DRIFT) ----
  (function() {
    var cnv = document.querySelector(".gradient-mesh");
    if (!cnv || !cnv.getContext) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      cnv.style.display = "none";
      return;
    }
    
    var ctx = cnv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W, H;
    var particles = [];
    var running = true;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      cnv.width = W * dpr;
      cnv.height = H * dpr;
      cnv.style.width = W + "px";
      cnv.style.height = H + "px";
      ctx.scale(dpr, dpr);
      
      // Initialize fluid color points
      particles = [];
      var colorsArr = [
        "rgba(59, 130, 246, ",  // blue-500
        "rgba(37, 99, 235, ",   // blue-600
        "rgba(6, 182, 212, ",   // cyan-500
        "rgba(99, 102, 241, "   // indigo-500
      ];
      
      var count = 8;
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          radius: Math.random() * (W * 0.35) + (W * 0.15),
          color: colorsArr[i % colorsArr.length],
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          alpha: Math.random() * 0.12 + 0.08
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Pause rendering loop if canvas is out of viewport to save resources
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        running = e.isIntersecting;
      });
    });
    observer.observe(cnv);

    function draw() {
      if (!running) {
        requestAnimationFrame(draw);
        return;
      }
      
      ctx.clearRect(0, 0, W, H);
      
      // Update and draw each glowing aura blob
      particles.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce on boundaries
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        
        var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color + p.alpha + ")");
        gradient.addColorStop(0.5, p.color + (p.alpha * 0.3) + ")");
        gradient.addColorStop(1, p.color + "0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ---- 10. CAROUSEL SYSTEM (EXPLICIT MAPPING, NO 404s) ----
  function initCarousel(car, projId) {
    var track = car.querySelector(".track");
    if (!track) return;
    
    // Clear slide track first
    track.innerHTML = "";
    
    var images = PROJECT_MEDIA[projId] || [];
    var label = (car.closest(".project") && car.closest(".project").querySelector("h3"))
      ? car.closest(".project").querySelector("h3").textContent.trim() : "Project";

    if (!images.length) return;
    
    // Fill slider media statically
    images.forEach(function(src, k) {
      var slide = document.createElement("div");
      slide.className = "slide";
      var isVideo = src.match(/\.(mp4|webm)$/i);
      var mediaEl;
      if (isVideo) {
        mediaEl = document.createElement("video");
        mediaEl.src = src;
        mediaEl.autoplay = true;
        mediaEl.loop = true;
        mediaEl.muted = true;
        mediaEl.playsInline = true;
        mediaEl.setAttribute("playsinline", "");
        mediaEl.style.width = "100%";
        mediaEl.style.height = "100%";
        mediaEl.style.objectFit = "cover";
      } else {
        mediaEl = document.createElement("img");
        mediaEl.loading = "lazy";
        mediaEl.src = src;
        mediaEl.alt = label + " image " + (k + 1);
        
        // Bind zoom/lightbox action (only for images, not videos)
        mediaEl.addEventListener("click", function() {
          var lb = document.getElementById("lightbox");
          var lbImg = lb.querySelector("img");
          lbImg.src = mediaEl.src;
          lbImg.alt = mediaEl.alt;
          lb.classList.add("open");
        });
      }
      slide.appendChild(mediaEl);
      track.appendChild(slide);
    });

    var slides = car.querySelectorAll(".slide");
    var n = slides.length, i = 0;
    
    // Dots container
    var dots = document.createElement("div");
    dots.className = "dots";
    var counter = document.createElement("div");
    counter.className = "counter";
    car.appendChild(dots);
    car.appendChild(counter);

    for (var d = 0; d < n; d++) {
      (function(idx) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Slide " + (idx + 1));
        b.addEventListener("click", function() { go(idx); });
        dots.appendChild(b);
      })(d);
    }

    // Add navigation arrows
    var prevBtn = document.createElement("button");
    prevBtn.className = "car-btn prev";
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
    prevBtn.addEventListener("click", function(e) { e.stopPropagation(); go(i - 1); });
    
    var nextBtn = document.createElement("button");
    nextBtn.className = "car-btn next";
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
    nextBtn.addEventListener("click", function(e) { e.stopPropagation(); go(i + 1); });

    car.appendChild(prevBtn);
    car.appendChild(nextBtn);

    function render() {
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      dots.querySelectorAll("button").forEach(function(b, k) {
        b.classList.toggle("active", k === i);
      });
      counter.textContent = (i + 1) + " / " + n;
    }

    function go(k) {
      i = (k + n) % n;
      render();
    }
    render();

    // Swipe guestures support
    var startX = 0;
    car.addEventListener("touchstart", function(e) { startX = e.touches[0].clientX; }, { passive: true });
    car.addEventListener("touchend", function(e) {
      var diffX = e.changedTouches[0].clientX - startX;
      if (Math.abs(diffX) > 40) {
        go(diffX < 0 ? i + 1 : i - 1);
      }
    });

    // Auto rotate
    var timer = setInterval(function() { go(i + 1); }, 7000);
    car.addEventListener("mouseenter", function() { clearInterval(timer); });
    car.addEventListener("mouseleave", function() {
      timer = setInterval(function() { go(i + 1); }, 7000);
    });
  }

  // ---- 12. RUNTIME CAROUSEL & MARQUEE GENERATION ----
  document.querySelectorAll("[data-carousel]").forEach(function(car) {
    var projId = car.getAttribute("data-extra");
    initCarousel(car, projId);
  });

  // Populate bottom marquee gallery
  (function() {
    var sources = [];
    Object.keys(PROJECT_MEDIA).forEach(function(k) {
      PROJECT_MEDIA[k].forEach(function(src) {
        if (!src.match(/\.(mp4|webm)$/i)) {
          sources.push({ src: src, label: k.toUpperCase() });
        }
      });
    });

    if (sources.length) {
      var fillRow = function(row, list) {
        var doubleList = list.concat(list);
        doubleList.forEach(function(o) {
          var a = document.createElement("a");
          a.href = "#projects";
          a.setAttribute("data-label", o.label);
          var img = document.createElement("img");
          img.loading = "lazy";
          img.src = o.src;
          img.alt = o.label + " gallery image";
          a.appendChild(img);
          row.appendChild(a);
        });
      };
      
      var leftTrack = document.querySelector('[data-mq-track="left"]');
      var rightTrack = document.querySelector('[data-mq-track="right"]');
      
      if (leftTrack) fillRow(leftTrack, sources);
      if (rightTrack) fillRow(rightTrack, sources.slice().reverse());
    }
  })();

  // ---- 13. DYNAMIC PROJECT DETAIL MODAL ----
  (function() {
    var PROJECTS = {
      between: {
        role_en: "Developer & Technical Artist",
        role_es: "Desarrollador y Artista Técnico",
        title: "Between Songs & Demons",
        lead_en: "A retro-horror title channelling the grain, fog and limited palette of the PlayStation 1 era. I owned gameplay programming, low-poly asset creation and the technical pipeline that keeps an authentic PSX look running at a stable framerate.",
        lead_es: "Un título de retro-horror que captura el grano, la niebla y la paleta limitada de la era PlayStation 1. Me encargué de la programación de gameplay, la creación de assets low-poly y el pipeline técnico que mantiene un look PSX auténtico con framerate estable.",
        feats_en: [
          "Gameplay programming in C# (inventory, interaction, scares)",
          "Hand-made low-poly assets with PSX-style texturing",
          "Vertex jitter, affine mapping and dithering shaders",
          "Atmospheric environment & level design",
          "Performance optimization for a locked retro framerate",
          "Full technical implementation end to end"
        ],
        feats_es: [
          "Programación de gameplay en C# (inventario, interacción, sustos)",
          "Assets low-poly hechos a mano con texturizado estilo PSX",
          "Shaders de vertex jitter, mapeo afín y dithering",
          "Diseño de entornos y niveles atmosféricos",
          "Optimización para un framerate retro fijo",
          "Implementación técnica completa de punta a punta"
        ],
        tags: ["Unity", "C#", "Blender", "PSX style"],
        links: []
      },
      alloy: {
        role_en: "Founder & Lead Developer",
        role_es: "Fundador y Desarrollador Principal",
        title: "Alloy, AI Receptionist",
        lead_en: "A commercial AI receptionist that lives inside WhatsApp. Alloy answers customers, qualifies leads, books appointments and pushes everything into the business CRM, replacing hours of manual front-desk work with automated, on-brand conversations.",
        lead_es: "Un recepcionista con IA comercial que vive dentro de WhatsApp. Alloy responde clientes, califica leads, agenda turnos y envía todo al CRM del negocio, reemplazando horas de trabajo manual de recepción con conversaciones automatizadas y con identidad de marca.",
        feats_en: [
          "AI-driven customer conversations on WhatsApp",
          "Automated lead qualification & routing",
          "Appointment scheduling synced to calendars",
          "CRM integration and workflow automation",
          "Analytics dashboard for conversations & conversions",
          "Built and shipped as a real commercial product"
        ],
        feats_es: [
          "Conversaciones con clientes impulsadas por IA en WhatsApp",
          "Calificación y derivación automática de leads",
          "Agendamiento de turnos sincronizado con calendarios",
          "Integración con CRM y automatización de flujos",
          "Panel de analítica de conversaciones y conversiones",
          "Construido y lanzado como producto comercial real"
        ],
        tags: ["C#", "Supabase", "Evolution API", "REST APIs", "AI Integrations"],
        links: []
      },
      light: {
        role_en: "Simulation Developer",
        role_es: "Desarrollador de Simulación",
        title_en: "Light Pollution Impact Study",
        title_es: "Estudio de Impacto de Contaminación Lumínica",
        lead_en: "A real-time environmental simulation that recreates, from accurate topographic and site-plan data, how vehicle headlights from a proposed residential road would spill onto existing homes in Massachusetts at night.",
        lead_es: "Una simulación ambiental en tiempo real que recrea, a partir de datos topográficos y de planos precisos, cómo las luces de los vehículos de un camino residencial propuesto se proyectarían sobre viviendas existentes en Massachusetts durante la noche.",
        feats_en: [
          "Real-world terrain rebuilt from topographic data",
          "Physically-based headlight & HDRP lighting",
          "Interactive vehicle paths along the proposed road",
          "Interior and exterior intrusion viewpoints",
          "Submitted as technical evidence to the Plymouth ZBA",
          "Helped communicate environmental impact clearly"
        ],
        feats_es: [
          "Terreno real reconstruido desde datos topográficos",
          "Iluminación de faros e HDRP basada en física",
          "Recorridos de vehículos interactivos sobre el camino propuesto",
          "Puntos de vista de intrusión interior y exterior",
          "Presentada como evidencia técnica ante el ZBA de Plymouth",
          "Ayudó a comunicar el impacto ambiental con claridad"
        ],
        tags: ["Unity HDRP", "Blender", "C#", "Real-time lighting"],
        links: []
      },
      videobooth: {
        role_en: "Lead Software Developer",
        role_es: "Desarrollador de Software Principal",
        title: "Background Remover, VideoBooth",
        lead_en: "A professional desktop app that removes backgrounds from video and image sequences. It combines several state-of-the-art segmentation models into one unified workflow, with a timeline, model selection and precise edge masking for production use.",
        lead_es: "Una app de escritorio profesional que elimina fondos de videos y secuencias de imágenes. Combina varios modelos de segmentación de última generación en un flujo unificado, con línea de tiempo, selección de modelos y enmascarado de bordes preciso para uso en producción.",
        feats_en: [
          "Multi-model AI segmentation pipeline",
          "Video and image-sequence background removal",
          "Timeline UI with per-model selection",
          "Precise edge & fine-hair masking",
          "Production-ready commercial desktop deployment",
          "Optimized batch processing"
        ],
        feats_es: [
          "Pipeline de segmentación con IA multi-modelo",
          "Quitado de fondo en video y secuencias de imágenes",
          "Interfaz con línea de tiempo y selección por modelo",
          "Enmascarado preciso de bordes y cabello fino",
          "Despliegue de escritorio comercial listo para producción",
          "Procesamiento por lotes optimizado"
        ],
        tags: ["RMV", "BiRefNet Lite", "RMBG 2.0", "MODNet", "MediaPipe"],
        links: []
      },
      psxcycles: {
        role_en: "Addon Developer & Technical Artist",
        role_es: "Desarrollador de Addons y Artista Técnico",
        title: "PSX Cycles",
        lead_en: "A native Blender render engine that faithfully recreates the visual characteristics of classic 32-bit console graphics. Unlike post-processing shaders, PSX Cycles integrates directly into Blender's rendering pipeline.",
        lead_es: "Un motor de render nativo para Blender que recrea fielmente las características visuales de los gráficos clásicos de consolas de 32 bits. A diferencia de los shaders de postprocesamiento, se integra directamente en el pipeline de renderizado.",
        feats_en: [
          "Native render engine integration in Blender",
          "Faithful recreation of 32-bit console visual limits",
          "Affine texture mapping & custom vertex jitter simulation",
          "Retro color palette restriction and dithering styles",
          "Preserved native Blender animation & shading workflows",
          "Highly efficient real-time preview inside viewport"
        ],
        feats_es: [
          "Integración nativa como motor de render en Blender",
          "Recreación fiel de las limitaciones visuales de consolas de 32 bits",
          "Simulación de vertex jitter y mapeo de texturas afín",
          "Restricción de paleta de colores retro y estilos de dithering",
          "Conserva los flujos nativos de animación y sombreado en Blender",
          "Previsualización en tiempo real altamente eficiente en el viewport"
        ],
        tags: ["Blender SDK", "Python", "Render Engine", "Retro Graphics", "C++ / Shaders"],
        links: []
      },
      rigidanim: {
        role_en: "Addon Developer & Pipeline Engineer",
        role_es: "Desarrollador de Addons e Ingeniero de Pipeline",
        title: "Rigidanim Merger",
        lead_en: "Blender has no built-in way to merge multiple animated objects into a single rig (Armature). This is the single biggest friction point for game devs exporting from Blender. Every artist eventually hits this wall. This addon fixes that.",
        lead_es: "Blender no tiene una forma nativa de fusionar múltiples objetos animados en un solo esqueleto (Armature). Este es el mayor punto de fricción para desarrolladores que exportan desde Blender. Cada artista choca con esta pared eventualmente. Este addon lo soluciona.",
        feats_en: [
          "Auto-merges separated animated objects into a single Armature",
          "Maintains coordinate hierarchies, rotations, and scales perfectly",
          "Bakes multiple non-armature animations into vertex groups and bone weights",
          "Optimizes export sizes for game engines (Unity, Unreal Engine, Godot)",
          "Eliminates hours of manual rig binding and weight painting",
          "One-click non-destructive execution pipeline"
        ],
        feats_es: [
          "Fusiona automáticamente objetos animados separados en una sola Armadura",
          "Mantiene jerarquías de coordenadas, rotaciones y escalas a la perfección",
          "Hornea múltiples animaciones sin esqueleto en grupos de vértices y pesos de huesos",
          "Optimiza tamaños de exportación para motores de juego (Unity, Unreal, Godot)",
          "Elimina horas de vinculación manual de rigs y pintado de pesos",
          "Flujo de trabajo no destructivo con ejecución en un solo clic"
        ],
        tags: ["Blender API", "Python", "Game Dev Tooling", "Rigging Automation"],
        links: []
      },
      gemjoy: {
        role_en: "Unity & AR Developer",
        role_es: "Desarrollador Unity y RA",
        title: "GemJoy AR Portal",
        lead_en: "Worked for Katie, founder of GemJoy (a brand of custom gems, bracelets, and watches). Created an augmented reality gem-capture system using Vuforia Image Targets. Upon scanning, it plays an interactive, magical animation.",
        lead_es: "Trabajé para Katie, fundadora de GemJoy (marca de gemas personalizadas, brazaletes y relojes). Creé un sistema de captura de gemas en realidad aumentada usando Vuforia Image Targets. Al escanearlas, reproduce una animación mágica interactiva.",
        feats_en: [
          "AR scanning system using Vuforia Image Targets",
          "High-performance particle effects and magical shaders in Unity",
          "Interactive triggers linked to physical bracelet and gem positions",
          "Optimized runtime performance for iOS and Android mobile web apps",
          "Custom particle systems for mystical, luxurious gemstone reflections",
          "Seamless UI/UX integration overlaying AR tracking viewports"
        ],
        feats_es: [
          "Sistema de escaneo RA usando Vuforia Image Targets",
          "Efectos de partículas de alto rendimiento y shaders mágicos en Unity",
          "Disparadores interactivos vinculados a posiciones físicas de brazaletes y gemas",
          "Rendimiento de tiempo de ejecución optimizado para móviles iOS y Android",
          "Sistemas de partículas personalizados para reflejos místicos y lujosos de gemas",
          "Integración perfecta de UI/UX sobrepuesta en viewports de seguimiento RA"
        ],
        tags: ["Unity", "C#", "Vuforia AR", "Mobile AR", "Shader Graph", "Particle Systems"],
        links: []
      },
      canal4: {
        role_en: "Software Developer & Broadcast Systems Tech",
        role_es: "Desarrollador de Software y Técnico de Sistemas de Transmisión",
        title: "Canal 4 SCA",
        lead_en: "Designed and built custom screen automation software that processes RSS XML feeds for automated, real-time news generation, configured broadcast networks and remote live technical feeds, and operated central control studio production workflows.",
        lead_es: "Diseñé y programé un software a medida de automatización de pantalla que procesaba RSS feeds en XML para generar noticias en tiempo real, configuré redes de transmisión y radioenlaces, y operé control central de estudio.",
        feats_en: [
          "100% human-free automated screen news pipeline from XML feeds",
          "Automated real-time text, images, and weather graphics generation",
          "Configured technical radio links and remote transmission networks",
          "Central control room operations utilizing vMix and OBS Studio",
          "Interactive 3D virtual set concepts developed in Unreal Engine",
          "Optimized live broadcast infrastructure stability"
        ],
        feats_es: [
          "Pipeline desatendido de noticias en pantalla a partir de feeds XML",
          "Generación automática en tiempo real de texto, imágenes y clima",
          "Configuración de radioenlaces y redes de transmisión remota",
          "Operación técnica de control central con vMix y OBS Studio",
          "Propuestas de sets virtuales interactivos 3D en Unreal Engine",
          "Estabilidad optimizada de la infraestructura de transmisión en vivo"
        ],
        tags: ["vMix / OBS", "XML / RSS", "Python", "Unreal Engine", "Broadcast Networks"],
        links: []
      }
    };

    var modal = document.getElementById("projectModal");
    if (!modal) return;
    var pmImg = document.getElementById("pm-img");
    var pmThumbs = document.getElementById("pm-thumbs");
    var pmRole = document.getElementById("pm-role");
    var pmTitle = document.getElementById("pm-title");
    var pmLead = document.getElementById("pm-lead");
    var pmFeats = document.getElementById("pm-feats");
    var pmTags = document.getElementById("pm-tags");
    var pmLinks = document.getElementById("pm-links");

    function openModal(id) {
      var data = PROJECTS[id];
      if (!data) return;
      var L = lang;
      
      pmRole.textContent = data["role_" + L] || data.role_en;
      pmTitle.textContent = data.title || data["title_" + L] || data.title_en;
      pmLead.textContent = data["lead_" + L] || data.lead_en;
      
      // Load highlights
      pmFeats.innerHTML = "";
      (data["feats_" + L] || data.feats_en || []).forEach(function(feat) {
        var li = document.createElement("li");
        li.textContent = feat;
        pmFeats.appendChild(li);
      });
      
      // Load tags
      pmTags.innerHTML = "";
      (data.tags || []).forEach(function(t) {
        var s = document.createElement("span");
        s.textContent = t;
        pmTags.appendChild(s);
      });
      
      // Load links
      pmLinks.innerHTML = "";
      (data.links || []).forEach(function(lk) {
        var a = document.createElement("a");
        a.className = "btn btn-ghost";
        a.href = lk.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = lk.label;
        pmLinks.appendChild(a);
      });

      // Images slide thumbnails
      var images = PROJECT_MEDIA[id] || [];
      pmThumbs.innerHTML = "";
      if (images.length) {
        pmImg.src = images[0];
        pmImg.alt = data.title;
        
        images.forEach(function(src, k) {
          var t = document.createElement("img");
          t.src = src;
          t.alt = "Thumbnail image " + (k + 1);
          if (k === 0) t.className = "active";
          
          t.addEventListener("click", function() {
            pmImg.src = src;
            pmThumbs.querySelectorAll("img").forEach(function(x) { x.classList.remove("active"); });
            t.classList.add("active");
          });
          pmThumbs.appendChild(t);
        });
      }
      
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-detail]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        openModal(btn.getAttribute("data-detail"));
      });
    });

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") closeModal();
    });
  })();

  // ---- 14. DYNAMIC TESTIMONIALS (Consolidated Client Showcase) ----
  (function() {
    var slider = document.getElementById("testimonials-slider");
    if (!slider) return;

    var FALLBACK = [
      {
        name: "Sarah Mitchell",
        role_en: "CEO, Brightpath Solutions",
        role_es: "CEO, Brightpath Solutions",
        rating: 5,
        avatar: "",
        text_en: "Leandro built an AI receptionist that completely transformed how we handle customer communication. Response times went from hours to seconds. The WhatsApp integration was flawless.",
        text_es: "Leandro construyó un recepcionista con IA que transformó completamente cómo manejamos la comunicación con clientes. Los tiempos de respuesta pasaron de horas a segundos. La integración con WhatsApp fue impecable."
      }
    ];

    function renderSlider(list) {
      slider.innerHTML = "";
      list.forEach(function(t) {
        var card = document.createElement("div");
        card.className = "t-card reveal";
        
        var body = document.createElement("div");
        body.className = "t-card-body";
        
        var stars = document.createElement("div");
        stars.className = "t-stars";
        stars.textContent = "★".repeat(t.rating || 5);
        body.appendChild(stars);
        
        var p = document.createElement("p");
        p.className = "t-text";
        p.setAttribute("data-en", t.text_en || "");
        p.setAttribute("data-es", t.text_es || t.text_en || "");
        p.textContent = (lang === "es" ? (t.text_es || t.text_en) : t.text_en) || "";
        body.appendChild(p);

        var who = document.createElement("div");
        who.className = "t-who";
        
        var av;
        if (t.avatar) {
          av = document.createElement("img");
          av.className = "t-av";
          av.src = t.avatar;
          av.alt = t.name;
          av.loading = "lazy";
        } else {
          av = document.createElement("div");
          av.className = "t-av ph";
          av.textContent = (t.name || "?").trim().charAt(0).toUpperCase();
        }
        
        var details = document.createElement("div");
        var nameDiv = document.createElement("div");
        nameDiv.className = "t-name";
        nameDiv.textContent = t.name;
        
        var roleDiv = document.createElement("div");
        roleDiv.className = "t-role";
        roleDiv.setAttribute("data-en", t.role_en || "");
        roleDiv.setAttribute("data-es", t.role_es || t.role_en || "");
        roleDiv.textContent = (lang === "es" ? (t.role_es || t.role_en) : t.role_en) || "";
        
        details.appendChild(nameDiv);
        details.appendChild(roleDiv);
        who.appendChild(av);
        who.appendChild(details);
        
        card.appendChild(body);
        card.appendChild(who);
        slider.appendChild(card);
      });
      
      observeReveals(slider);
    }

    // Drag-to-scroll implementation for client deck
    var isDown = false;
    var startX, scrollLeft;
    
    slider.addEventListener("mousedown", function(e) {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", function() {
      isDown = false;
    });
    slider.addEventListener("mouseup", function() {
      isDown = false;
    });
    slider.addEventListener("mousemove", function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - slider.offsetLeft;
      var walk = (x - startX) * 1.2;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Fetch testimonials
    fetch("testimonials.json", { cache: "no-store" })
      .then(function(r) { if (!r.ok) throw 0; return r.json(); })
      .then(function(data) {
        var list = Array.isArray(data) ? data : (data.testimonials || []);
        renderSlider(list);
      })
      .catch(function() {
        renderSlider(FALLBACK);
      });
  })();

  // ---- 15. DYNAMIC BLOG PORTFOLIO DATA ----
  (function() {
    var BLOG = [
      {
        date: "2026-06-17",
        tag: "AI",
        title_en: "Building Alloy: Lessons from Shipping an AI Receptionist",
        title_es: "Construyendo Alloy: Lecciones de lanzar un recepcionista con IA",
        summary_en: "What it took to build and ship a commercial AI product that handles real customer conversations on WhatsApp — architecture, pitfalls, and what I'd do differently.",
        summary_es: "Lo que costó construir y lanzar un producto comercial de IA que maneja conversaciones reales con clientes en WhatsApp — arquitectura, errores y qué haría diferente.",
        body_en: "<p>Shipping an AI product is one thing. Shipping one that handles real customer conversations — where every response matters and a mistake costs a lead — is another.</p><p>Alloy started as a prototype and grew into a full WhatsApp-native AI receptionist handling lead qualification, appointment scheduling, and CRM sync. Here are the key lessons:</p><h4>1. The AI is the easy part</h4><p>The hardest part wasn't the model — it was reliability. Customers expect instant, accurate responses every time. We invested heavily in fallback chains, timeout handling, and conversation context management.</p><h4>2. WhatsApp integration is delicate</h4><p>WhatsApp Business API has strict messaging windows, template requirements, and rate limits. Handling session timeouts and re-engagement gracefully was a significant engineering challenge.</p><h4>3. Users don't want AI, they want results</h4><p>Early users didn't care about the technology. They cared about: did the lead get followed up? Was the appointment booked? This reframed our entire product strategy around outcomes, not capabilities.</p>",
        body_es: "<p>Lanzar un producto de IA es una cosa. Lanzar uno que maneje conversaciones reales con clientes — donde cada respuesta importa y un error cuesta un lead — es otra.</p><p>Alloy empezó como un prototipo y creció hasta ser un recepcionista con IA nativo de WhatsApp manejando calificación de leads, agendamiento de turnos y sincronización con CRM. Estas son las lecciones clave:</p><h4>1. La IA es la parte fácil</h4><p>Lo más difícil no fue el modelo — fue la confiabilidad. Los clientes esperan respuestas instantáneas y precisas siempre. Invertimos mucho en cadenas de respaldo, manejo de timeouts y gestión de contexto de conversación.</p><h4>2. La integración con WhatsApp es delicada</h4><p>La API de WhatsApp Business tiene ventanas de mensajería estrictas, requisitos de plantillas y límites de tasa. Manejar timeouts de sesión y re-engagement de manera elegante fue un desafío de ingeniería significativo.</p><h4>3. Los usuarios no quieren IA, quieren resultados</h4><p>Los primeros usuarios no se preocupaban por la tecnología. Les importaba: ¿se hizo el follow-up del lead? ¿se agendó el turno? Esto reencuadró toda nuestra estrategia de producto alrededor de resultados, no de capacidades.</p>"
      },
      {
        date: "2026-05-22",
        tag: "Simulation",
        title_en: "Using Real-Time Simulation as Technical Evidence",
        title_es: "Usando simulación en tiempo real como evidencia técnica",
        summary_en: "How an interactive environmental simulation helped communicate light pollution impact to a zoning board more effectively than documents ever could.",
        summary_es: "Cómo una simulación ambiental interactiva ayudó a comunicar el impacto de contaminación lumínica a una junta municipal más efectivamente que cualquier documento.",
        body_en: "<p>When the Plymouth Zoning Board of Appeals needed to understand how a proposed residential road would affect neighboring homes, documents and static renderings weren't enough.</p><p>We built a real-time simulation in Unity HDRP that let them:</p><ul><li>Drive virtual vehicles along the proposed road at night</li><li>See headlight intrusion from multiple angles — interior and exterior</li><li>Toggle between proposed and existing conditions instantly</li></ul><p>The result was a unanimous approval. The simulation didn't just show the data — it let the board experience it.</p><p>This project reinforced my belief that real-time visualization is one of the most underutilized tools in technical communication.</p>",
        body_es: "<p>Cuando el Zoning Board of Appeals de Plymouth necesitaba entender cómo un camino residencial propuesto afectaría a las viviendas vecinas, los documentos y renderizaciones estáticas no fueron suficientes.</p><p>Construimos una simulación en tiempo real en Unity HDRP que les permitió:</p><ul><li>Conducir vehículos virtuales por el camino propuesto de noche</li><li>Ver la intrusión lumínica desde múltiples ángulos — interior y exterior</li><li>Alternar entre condiciones propuestas y existentes al instante</li></ul><p>El resultado fue una aprobación unánime. La simulación no solo mostró los datos — les permitió experimentarlos.</p><p>Este proyecto reforzó mi creencia de que la visualización en tiempo real es una de las herramientas más subutilizadas en la comunicación técnica.</p>"
      },
      {
        date: "2026-04-10",
        tag: "Development",
        title_en: "The PSX Aesthetic: Why Constraints Make Better Art",
        title_es: "La estética PSX: Por qué las limitaciones hacen mejor arte",
        summary_en: "What building a retro-horror game taught me about working within technical constraints — and why that mindset applies to every software project.",
        summary_es: "Lo que construir un juego retro-horror me enseñó sobre trabajar dentro de limitaciones técnicas — y por qué esa mentalidad aplica a todo proyecto de software.",
        body_en: "<p>Building \"Between Songs & Demons\" meant deliberately working within the constraints of a 1995-era PlayStation. Limited polygon counts, texture warping, dithering, and a strict color palette.</p><p>What I learned: constraints force creativity. When you can't add more polygons, you learn to make every polygon count. When you can't use modern lighting, you learn to bake light into textures.</p><p>This mindset carries directly into software engineering. The best systems aren't the ones with unlimited resources — they're the ones that use what they have brilliantly.</p>",
        body_es: "<p>Construir \"Between Songs & Demons\" significó trabajar deliberadamente dentro de las limitaciones de una PlayStation de 1995. Countos de polígonos limitados, warping de texturas, dithering y una paleta de colores estricta.</p><p>Lo que aprendí: las limitaciones fuerzan la creatividad. Cuando no puedes agregar más polígonos, aprendes a hacer que cada polígono cuente. Cuando no puedes usar iluminación moderna, aprendes a hornear luz en las texturas.</p><p>Esta mentalidad se traslada directamente a la ingeniería de software. Los mejores sistemas no son los que tienen recursos ilimitados — son los que usan lo que tienen de manera brillante.</p>"
      }
    ];

    var grid = document.getElementById("blog-grid");
    if (!grid) return;
    grid.innerHTML = "";

    BLOG.forEach(function(post, idx) {
      var card = document.createElement("div");
      card.className = "blog-card reveal";
      
      var date = document.createElement("div");
      date.className = "bc-date";
      date.textContent = post.date;
      
      var title = document.createElement("h3");
      title.setAttribute("data-en", post.title_en);
      title.setAttribute("data-es", post.title_es);
      title.textContent = lang === "es" ? post.title_es : post.title_en;
      
      var summary = document.createElement("p");
      summary.setAttribute("data-en", post.summary_en);
      summary.setAttribute("data-es", post.summary_es);
      summary.textContent = lang === "es" ? post.summary_es : post.summary_en;
      
      var tag = document.createElement("span");
      tag.className = "bc-tag";
      tag.textContent = post.tag;
      
      card.appendChild(date);
      card.appendChild(title);
      card.appendChild(summary);
      card.appendChild(tag);
      
      card.addEventListener("click", function() {
        openBlog(post);
      });
      grid.appendChild(card);
    });

    var bModal = document.getElementById("blogModal");
    var bmDate = document.getElementById("bm-date");
    var bmTitle = document.getElementById("bm-title");
    var bmTags = document.getElementById("bm-tags");
    var bmBody = document.getElementById("bm-body");

    function openBlog(post) {
      if (!bModal) return;
      var L = lang;
      bmDate.textContent = post.date;
      bmTitle.textContent = post["title_" + L] || post.title_en;
      bmTags.textContent = post.tag;
      bmBody.innerHTML = post["body_" + L] || post.body_en;
      bModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeBlog() {
      bModal.classList.remove("open");
      document.body.style.overflow = "";
    }

    if (bModal) {
      bModal.querySelector(".modal-close").addEventListener("click", closeBlog);
      bModal.addEventListener("click", function(e) { if (e.target === bModal) closeBlog(); });
      document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeBlog(); });
    }

    observeReveals(grid);
  })();

  // ---- 16. THEME TOGGLE (SMOOTH TRANSITIONS) ----
  (function() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    
    btn.addEventListener("click", function() {
      var nextTheme = $html.getAttribute("data-theme") === "light" ? "" : "light";
      $html.setAttribute("data-theme", nextTheme);
      localStorage.setItem("cv-theme", nextTheme);
      
      // Rotate effect inside toggle icon
      btn.style.transform = "rotate(360deg)";
      setTimeout(function() { btn.style.transform = ""; }, 400);
      
      // Update icons state
      var sun = btn.querySelector(".sun");
      var moon = btn.querySelector(".moon");
      if (sun && moon) {
        if (nextTheme === "light") {
          sun.style.display = "none";
          moon.style.display = "";
        } else {
          sun.style.display = "";
          moon.style.display = "none";
        }
      }
    });

    // Synchronize initial icons
    var initialTheme = localStorage.getItem("cv-theme");
    if (initialTheme === "light") {
      var sun = btn.querySelector(".sun");
      var moon = btn.querySelector(".moon");
      if (sun && moon) {
        sun.style.display = "none";
        moon.style.display = "";
      }
    }
  })();

  // ---- 17. BACK TO TOP ----
  (function() {
    var btt = document.getElementById("backToTop");
    if (!btt) return;
    
    var bttRAF;
    function handleScroll() {
      if (bttRAF) cancelAnimationFrame(bttRAF);
      bttRAF = requestAnimationFrame(function() {
        btt.classList.toggle("visible", window.scrollY > 400);
      });
    }

    if (window.__lenis) {
      window.__lenis.on('scroll', handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    btt.addEventListener("click", function() {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  })();

  // ---- 18. LIGHTBOX ----
  (function() {
    var lb = document.getElementById("lightbox");
    if (!lb) return;
    
    function closeLb() { lb.classList.remove("open"); }
    lb.addEventListener("click", closeLb);
    document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeLb(); });
  })();

  // ---- 19. HAMBURGER NAV DRAWER ----
  (function() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector("header.nav");
    if (!toggle || !header) return;

    toggle.addEventListener("click", function() {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });

    document.querySelectorAll(".nav-links a").forEach(function(a) {
      a.addEventListener("click", function() {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  })();

  // ---- 20. PROJECT FILTER CATEGORIES ----
  (function() {
    var projSec = document.getElementById("projects");
    if (!projSec) return;
    var filterBar = projSec.querySelector(".filter-bar");
    if (!filterBar) return;
    
    var projects = [].slice.call(projSec.querySelectorAll(".project"));
    var catButtons = filterBar.querySelectorAll(".filter-btn");
    
    catButtons.forEach(function(btn) {
      btn.addEventListener("click", function() {
        catButtons.forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        
        var filterVal = btn.getAttribute("data-filter");
        projects.forEach(function(p) {
          var pCat = p.getAttribute("data-project") || "other";
          if (filterVal === "all" || pCat === filterVal) {
            p.classList.remove("hidden");
          } else {
            p.classList.add("hidden");
          }
        });
      });
    });
  })();

  // ---- 21. SCROLL SPY IN LINK HIGHLIGHTS ----
  (function() {
    var navLinks = document.querySelectorAll(".nav-links a");
    if (navLinks.length && "IntersectionObserver" in window) {
      var sections = [];
      navLinks.forEach(function(a) {
        var id = a.getAttribute("href").replace("#", "");
        var el = document.getElementById(id);
        if (el) sections.push({ el: el, link: a });
      });

      if (sections.length) {
        var spyObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(en) {
            if (en.isIntersecting) {
              navLinks.forEach(function(a) { a.classList.remove("active"); });
              sections.forEach(function(sec) {
                if (sec.el === en.target) sec.link.classList.add("active");
              });
            }
          });
        }, { threshold: 0.15, rootMargin: "-80px 0px 0px 0px" });
        sections.forEach(function(sec) { spyObserver.observe(sec.el); });
      }
    }
  })();

  // ---- 22. SPLIT HERO CHARACTERS ANIMATION ----
  (function() {
    var h1 = document.querySelector(".hero .hero-enormous");
    if (!h1) return;
    
    var nodes = [];
    h1.childNodes.forEach(function(node) {
      if (node.nodeType === 3) { // text
        var txt = node.textContent;
        if (!txt.trim()) { nodes.push(document.createTextNode(txt)); return; }
        
        var parts = txt.split(/(\s+)/);
        parts.forEach(function(p) {
          if (!p) return;
          if (!p.trim()) { nodes.push(document.createTextNode(p)); return; }
          
          var wrap = document.createElement("span");
          wrap.className = "char-wrap";
          for (var i = 0; i < p.length; i++) {
            var ch = document.createElement("span");
            ch.className = "char";
            ch.textContent = p[i];
            wrap.appendChild(ch);
          }
          nodes.push(wrap);
        });
      } else if (node.nodeType === 1) { // element like <em>
        var el = node.cloneNode(true);
        var txt = el.textContent;
        el.innerHTML = "";
        for (var i = 0; i < txt.length; i++) {
          var ch = document.createElement("span");
          ch.className = "char";
          ch.textContent = txt[i];
          el.appendChild(ch);
        }
        nodes.push(el);
      }
    });

    h1.textContent = "";
    nodes.forEach(function(node) { h1.appendChild(node); });
    
    setTimeout(function() {
      h1.querySelectorAll(".char").forEach(function(ch, i) {
        setTimeout(function() { ch.classList.add("in"); }, i * 35);
      });
    }, 400);
  })();

  // ---- 23. PROGRESS PROGRESSION TICK ----
  (function() {
    var bar = document.getElementById("navProgress");
    if (!bar) return;
    
    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min(scrollTop / docHeight * 100, 100) : 0;
      bar.style.width = pct + "%";
    }

    if (window.__lenis) {
      window.__lenis.on('scroll', updateProgress);
    } else {
      window.addEventListener("scroll", updateProgress, { passive: true });
    }
  })();

  // ---- 24. NAV SCROLL SHADOW (NO HIDE — STICKY ALWAYS VISIBLE) ----
  (function() {
    var nav = document.querySelector("header.nav");
    if (!nav) return;
    var ticking = false;
    function update() {
      nav.classList.toggle("nav-scrolled", window.scrollY > 80);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    if (window.__lenis) {
      window.__lenis.on('scroll', onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  })();

  // ---- 25. COUNTER NUMBER TICKERS ----
  (function() {
    document.querySelectorAll("[data-count]").forEach(function(el) {
      var val = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(val)) return;
      el.textContent = "0";
      el.classList.add("counter-n");
      
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting) {
            var start = 0, dur = 1000, step = 16;
            var increment = val / (dur / step);
            var timer = setInterval(function() {
              start += increment;
              if (start >= val) {
                el.textContent = val;
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(start);
              }
            }, step);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  })();

  // ---- 26. SPLASH SCREEN LIFECYCLE ----
  (function() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      splash.style.display = "none";
      return;
    }
    
    var p1 = document.getElementById("splashPhrase1");
    var p2 = document.getElementById("splashPhrase2");
    if (!p1 || !p2) return;

    function splitPhrase(el, text) {
      el.innerHTML = "";
      for (var i = 0; i < text.length; i++) {
        var sp = document.createElement("span");
        sp.className = "splash-char";
        sp.textContent = text[i] === " " ? "\u00A0" : text[i];
        el.appendChild(sp);
      }
    }

    splitPhrase(p1, lang === "es" ? "YA CASI" : "ALMOST THERE");
    splitPhrase(p2, lang === "es" ? "BIENVENIDO" : "WELCOME");

    var c1 = p1.querySelectorAll(".splash-char");
    var c2 = p2.querySelectorAll(".splash-char");
    var duration = 40;
    
    setTimeout(function() {
      c1.forEach(function(ch, idx) {
        setTimeout(function() { ch.classList.add("in"); }, idx * duration);
      });
    }, 50);

    var endP1 = 50 + c1.length * duration;
    setTimeout(function() { p1.classList.add("fade-out"); }, endP1 + 350);

    setTimeout(function() {
      c2.forEach(function(ch, idx) {
        setTimeout(function() { ch.classList.add("in"); }, idx * duration);
      });
    }, endP1 + 350 + 500);

    var endP2 = endP1 + 350 + 500 + c2.length * duration;

    // Shift logo and show name text
    setTimeout(function() {
      var wrap = document.querySelector(".splash-logo-wrap");
      if (wrap) wrap.classList.add("shift");
      var nm = document.getElementById("splashName");
      if (nm) {
        var txt = "Leandro Marquez";
        nm.innerHTML = "";
        for (var i = 0; i < txt.length; i++) {
          var sp = document.createElement("span");
          sp.className = "splash-name-char";
          sp.textContent = txt[i] === " " ? "\u00A0" : txt[i];
          nm.appendChild(sp);
        }
        nm.classList.add("show");
        nm.querySelectorAll(".splash-name-char").forEach(function(ch, idx) {
          setTimeout(function() { ch.classList.add("in"); }, idx * 25);
        });
      }
    }, 900);

    // Circular shrink animation for splash preloader
    setTimeout(function() {
      splash.classList.add("up");
      var main = document.querySelector(".page-wrap");
      if (main) {
        main.style.opacity = "0.3";
        main.style.transform = "scale(0.96)";
        main.style.transition = "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(function() {
          main.style.opacity = "1";
          main.style.transform = "scale(1)";
        }, 80);
      }
      setTimeout(function() {
        splash.remove();
      }, 1250);
    }, endP2 + 1000);
  })();

  // ---- 27. EMAIL CLIPBOARD UTILITY ----
  document.querySelectorAll("[data-copy-email]").forEach(function(el) {
    el.addEventListener("click", function() {
      var emailText = "nahuelmarquezwork@gmail.com";
      var msg = lang === "es" ? "Email copiado — abriendo tu correo..." : "Email copied — opening your mail app...";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(function() {
          toast(msg);
        }).catch(function() {
          toast("Email: " + emailText);
        });
      } else {
        toast("Email: " + emailText);
      }
    });
  });

  // Toast Notification handler
  var toastNode;
  function toast(msg) {
    if (!toastNode) {
      toastNode = document.createElement("div");
      toastNode.className = "toast";
      document.body.appendChild(toastNode);
    }
    toastNode.textContent = msg;
    toastNode.classList.add("show");
    clearTimeout(toastNode._timer);
    toastNode._timer = setTimeout(function() {
      toastNode.classList.remove("show");
    }, 2500);
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // Service worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(function() {});
  }

  // ---- N. TERMINAL TYPEWRITER (SIGNATURE) ----
  (function() {
    var el = document.getElementById("heroCmd");
    if (!el) return;
    var phrases = [
      "building AI products & real-time simulations",
      "shipping production software since 2019",
      "currently: simulation, vision, automation"
    ];
    var i = 0;
    function type() {
      var txt = phrases[i];
      var pos = 0;
      el.textContent = "";
      function tick() {
        if (pos < txt.length) {
          el.textContent += txt.charAt(pos);
          pos++;
          setTimeout(tick, 28 + Math.random() * 20);
        } else {
          setTimeout(function() {
            i = (i + 1) % phrases.length;
            setTimeout(type, 600);
          }, 3000);
        }
      }
      tick();
    }
    setTimeout(type, 1200);
  })();

  // ----  N. 3D SCENE — "Living Current" particle flow field ----
  function init3DScene() {
    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('scene-3d');
    if (!container || container.dataset.inited) return;
    container.dataset.inited = '1';

    // Circular particle texture
    var texCanvas = document.createElement('canvas');
    texCanvas.width = 48; texCanvas.height = 48;
    var tCtx = texCanvas.getContext('2d');
    var grad = tCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    tCtx.fillStyle = grad;
    tCtx.fillRect(0, 0, 48, 48);
    var sprite = new THREE.CanvasTexture(texCanvas);

    var scene = new THREE.Scene();

    var cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.set(0, 0, 6);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    function isLight() {
      return document.documentElement.getAttribute('data-theme') === 'light';
    }

    // Flow field — structural drift
    function flow(x, y, z, t) {
      return {
        x: Math.sin(y * 0.12 + t * 0.035) * 0.45 + Math.cos(z * 0.1 + t * 0.03) * 0.35,
        y: Math.sin(z * 0.11 + t * 0.032) * 0.45 + Math.cos(x * 0.13 + t * 0.028) * 0.35,
        z: Math.sin(x * 0.1 + t * 0.038) * 0.45 + Math.cos(y * 0.12 + t * 0.03) * 0.35
      };
    }

    // Turbulence field — organic breathing for idle state
    function turbField(x, y, z, t) {
      return {
        x: Math.sin(y * 0.07 + t * 0.011) * 0.6 + Math.sin(x * 0.05 + z * 0.06 + t * 0.016) * 0.3,
        y: Math.cos(x * 0.06 + t * 0.013) * 0.6 + Math.sin(z * 0.08 + y * 0.05 + t * 0.014) * 0.3,
        z: Math.sin(z * 0.05 + t * 0.010) * 0.6 + Math.cos(x * 0.07 + y * 0.06 + t * 0.017) * 0.3
      };
    }

    var count = 800;
    var pos = new Float32Array(count * 3);
    var vel = new Float32Array(count * 3);
    var col = new Float32Array(count * 3);
    var baseCol = new Float32Array(count * 3);  // per-particle base hue
    var seed = new Float32Array(count);
    var phase = new Float32Array(count);
    var maxV = new Float32Array(count);
    var origin = new Float32Array(count * 3);
    var explode = new Float32Array(count * 3);

    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var radius = 1.5 + Math.random() * 6;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius * 0.65;
      var z = (Math.random() - 0.5) * 4;
      pos[i*3] = x; origin[i*3] = x;
      pos[i*3+1] = y; origin[i*3+1] = y;
      pos[i*3+2] = z; origin[i*3+2] = z;
      var len = Math.sqrt(x*x + y*y + z*z) + 0.01;
      explode[i*3] = x / len * (6 + Math.random() * 14);
      explode[i*3+1] = y / len * (5 + Math.random() * 10);
      explode[i*3+2] = z / len * (6 + Math.random() * 12);
      seed[i] = Math.random() * 6.28;
      phase[i] = Math.random() * 6.28;
      maxV[i] = 0.015 + Math.random() * 0.025;
      baseCol[i*3] = 0.04 + Math.random() * 0.18;
      baseCol[i*3+1] = 0.15 + Math.random() * 0.25;
      baseCol[i*3+2] = 0.50 + Math.random() * 0.40;
      col[i*3] = baseCol[i*3];
      col[i*3+1] = baseCol[i*3+1];
      col[i*3+2] = baseCol[i*3+2];
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    var mat = new THREE.PointsMaterial({
      size: 0.075,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    // Mouse with idle detection
    var mouse = {
      x: 0, y: 0, mx: 0, my: 0,
      vx: 0, vy: 0, pmx: 0, pmy: 0,
      idleTicks: 0,
      turbAmp: 0   // 0 = fully responsive, 1 = fully idle/turbulent
    };
    var IDLE_THRESHOLD = 150;  // frames (~2.5s at 60fps)

    document.addEventListener('mousemove', function(e) {
      mouse.mx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.my = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.idleTicks = 0;
    });

    // Scroll — explode particles from center
    var scrollRaw = 0, scrollSmoothed = 0;
    window.addEventListener('scroll', function() {
      scrollRaw = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    });

    window.addEventListener('resize', function() {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Theme
    new MutationObserver(function() {
      var light = isLight();
      mat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      mat.opacity = light ? 0.6 : 0.75;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    var t = 0, pulse = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;
      pulse += 0.01;

      // Pulse every ~6s
      var pWave = Math.sin(pulse * 0.26) * 0.5 + 0.5;
      var pBright = Math.pow(pWave, 5) * 0.25;

      // Idle detection — smooth ramp
      mouse.idleTicks++;
      var targetTurb = mouse.idleTicks > IDLE_THRESHOLD ? 1 : 0;
      mouse.turbAmp += (targetTurb - mouse.turbAmp) * 0.025;

      // Smooth mouse — more viscous
      mouse.x += (mouse.mx - mouse.x) * 0.02;
      mouse.y += (mouse.my - mouse.y) * 0.02;
      var rawVx = (mouse.mx - mouse.pmx) * 3;
      var rawVy = (mouse.my - mouse.pmy) * 3;
      mouse.vx += (rawVx - mouse.vx) * 0.05;
      mouse.vy += (rawVy - mouse.vy) * 0.05;
      mouse.pmx = mouse.mx;
      mouse.pmy = mouse.my;

      // Smoothed scroll with slight lag
      scrollSmoothed += (scrollRaw - scrollSmoothed) * 0.035;

      // Camera parallax — very subtle, barely moves
      var camGain = 1 - mouse.turbAmp * 0.7;
      cam.position.x += (mouse.x * 0.35 * camGain - cam.position.x) * 0.004;
      cam.position.y += (mouse.y * 0.2 * camGain - cam.position.y) * 0.004;
      cam.lookAt(scene.position);

      // Scene rotation from scroll
      scene.rotation.y += 0.0002 + scrollSmoothed * 0.0001;
      scene.rotation.x = scrollSmoothed * 0.02;
      scene.rotation.z = -0.01 + scrollSmoothed * 0.01;

      var p = geo.attributes.position.array;
      var c = geo.attributes.color.array;
      var mPosX = mouse.x * 3;
      var mPosY = mouse.y * 2.2;

      // Explode factor (eased)
      var e = scrollSmoothed;
      var easeE = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;

      // Turbulence intensity (quadratic ease-in, feels organic)
      var turbStrength = mouse.turbAmp * mouse.turbAmp;
      // Mouse influence fades as turbulence rises
      var mouseStrength = 1 - turbStrength * 0.85;

      for (var i = 0; i < count; i++) {
        var ix = i*3, iy = i*3+1, iz = i*3+2;
        var s = seed[i];

        // Flow field
        var f = flow(
          p[ix] + Math.sin(s) * 1.5,
          p[iy] + Math.cos(s * 1.3) * 1.5,
          p[iz] + Math.sin(s * 0.7) * 1.5,
          t + s * 0.3 + scrollSmoothed * 2
        );

        // Turbulence field (idle breathing)
        var turb = turbField(
          p[ix] + Math.sin(s) * 2,
          p[iy] + Math.cos(s * 1.3) * 2,
          p[iz] + Math.sin(s * 0.7) * 2,
          t * 0.7 + s * 0.5
        );

        // Mouse vortex interaction — very subtle, like displacing water
        var dx = p[ix] - mPosX, dy = p[iy] - mPosY, dz = p[iz];
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 0.01;
        var influ = Math.max(0, 1 - dist / 4);
        var influ2 = influ * influ;
        var tx = -dy / dist, ty = dx / dist;
        var tForceX = tx * influ2 * 0.04 * mouseStrength;
        var tForceY = ty * influ2 * 0.04 * mouseStrength;
        var dForceX = mouse.vx * influ2 * 0.05 * mouseStrength;
        var dForceY = mouse.vy * influ2 * 0.05 * mouseStrength;
        var rForceX = (dx / dist) * influ * 0.015 * mouseStrength;
        var rForceY = (dy / dist) * influ * 0.015 * mouseStrength;
        var rForceZ = (dz / dist) * influ * 0.015 * mouseStrength;

        // Spring toward scroll-blended target (light — water drifts freely)
        var targetX = origin[ix] + explode[ix] * easeE;
        var targetY = origin[iy] + explode[iy] * easeE;
        var targetZ = origin[iz] + explode[iz] * easeE;
        var springX = (targetX - p[ix]) * 0.003;
        var springY = (targetY - p[iy]) * 0.003;
        var springZ = (targetZ - p[iz]) * 0.003;

        // Apply forces — stronger damping, gentler flow
        var damping = 0.06 + turbStrength * 0.04;
        vel[ix] += (f.x * 0.006 + turb.x * turbStrength * 0.006 + tForceX + dForceX + rForceX + springX - vel[ix] * damping);
        vel[iy] += (f.y * 0.006 + turb.y * turbStrength * 0.006 + tForceY + dForceY + rForceY + springY - vel[iy] * damping);
        vel[iz] += (f.z * 0.006 + turb.z * turbStrength * 0.006 + rForceZ + springZ - vel[iz] * damping);

        // Cap speed — slower overall, like water currents
        var speedCap = maxV[i] * (1 - turbStrength * 0.15);
        var speed = Math.sqrt(vel[ix]*vel[ix] + vel[iy]*vel[iy] + vel[iz]*vel[iz]);
        if (speed > speedCap) {
          vel[ix] *= speedCap / speed;
          vel[iy] *= speedCap / speed;
          vel[iz] *= speedCap / speed;
          speed = speedCap;
        }

        p[ix] += vel[ix];
        p[iy] += vel[iy];
        p[iz] += vel[iz];

        // Color: active → cyan, idle → drift toward purple/violet
        var norm = maxV[i] > 0 ? speed / maxV[i] : 0;
        // Turbulence color sample (varies per particle)
        var tc = (turb.x + turb.y + turb.z) / 3;  // -0.6 to 0.6
        var colorShift = turbStrength * (0.25 + 0.35 * (tc + 0.6) / 1.2);
        // Particles with higher colorShift lean more purple

        c[ix] = Math.min(baseCol[ix] + norm * 0.3 + colorShift * 0.50, 1);
        c[iy] = Math.min((baseCol[iy] + norm * 0.35) * (1 - colorShift * 0.35), 1);
        c[iz] = Math.min((baseCol[iz] + norm * 0.10) * (1 - colorShift * 0.40), 1);

        // Pulse flash (additive white burst)
        var flash = pBright * (0.4 + 0.6 * Math.sin(phase[i] + t * 0.3));
        c[ix] = Math.min(c[ix] + flash * 0.4, 1);
        c[iy] = Math.min(c[iy] + flash * 0.6, 1);
        c[iz] = Math.min(c[iz] + flash, 1);
      }

      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;

      renderer.render(scene, cam);
    }
    animate();
  }

  if (typeof THREE !== 'undefined') {
    init3DScene();
  } else {
    var chk = setInterval(function() {
      if (typeof THREE !== 'undefined') { clearInterval(chk); init3DScene(); }
    }, 100);
  }

})();
