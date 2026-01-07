import { useNavigate, useLocation, Routes, Route, useParams } from "react-router-dom";
import { sanityClient, safeImageUrl } from './sanityClient';
import React, { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

import emailjs from "@emailjs/browser";
import ProjectGrid from './components/ProjectGrid';

const isIOS = () => {
  return false; // Temporarily disable iOS detection to unify behavior
  // if (typeof navigator === "undefined") return false;
  // return (
  //   /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  //   (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  // );
};

// -------------------------
// Home Background Video Component
// -------------------------
function HomeBackgroundVideo({ videoUrl }) {
  if (!videoUrl) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

// -------------------------
// Home Projects Section Component
// -------------------------
function HomeProjectsSection({ projects }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const activeProject = projects[heroIndex];

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <p className="text-red-500 text-xs tracking-[0.3em] md:tracking-[0.6em] font-semibold mb-4">OUR WORK</p>
          <h2 className="heading-font clamp-heading-lg font-black text-white max-w-3xl mx-auto">
            Featured Projects
          </h2>
          <p className="text-gray-300 body-font mt-3 max-w-2xl mx-auto">
            Explore our latest creative work across animation, CGI, and campaigns.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject._id}
                custom={direction}
                variants={{
                  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
                  center: { opacity: 1, x: 0 },
                  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 80 : -80 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.65,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.65 },
                  x: { duration: 0.65 },
                  filter: { duration: 0.65 },
                }}
                className="rounded-3xl overflow-hidden border border-white/15 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
              >
                <div className="relative h-[20rem] md:h-[24rem] overflow-hidden">
                  {(() => {
                    const src = safeImageUrl(activeProject.image, { width: 1200 });
                    return src && (
                      <motion.img
                        src={src}
                        className="w-full h-full object-cover"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute left-6 bottom-6 right-6 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-red-300 font-semibold mb-1">
                        {activeProject.category || "Featured"}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-1">{activeProject.title}</h3>
                      <p className="text-gray-300 max-w-xl line-clamp-2">{activeProject.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-6xl mx-auto">
          {activeProject?.images?.[0] && (
            <img
              src={safeImageUrl(activeProject.images[0], { width: 800 })}
              alt={`${activeProject.title} sample 1`}
              className="w-full h-80 object-cover rounded-xl border border-white/10"
            />
          )}
          {activeProject?.images?.[1] && (
            <img
              src={safeImageUrl(activeProject.images[1], { width: 800 })}
              alt={`${activeProject.title} sample 2`}
              className="w-full h-80 object-cover rounded-xl border border-white/10"
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
      
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h2>
            <p className="text-gray-400 mb-6">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
 


const LOGO_URL = "/images/BBSLogo.png";
const SHOW_HERO = true;
// --------------------



// -------------------------
// NAVBAR (hoisted)
// -------------------------
function Navbar({
  scrolledPastHero,
  NAVBAR_HEIGHT,
  scrollToSection,
  nativeScrollToSection,
  setPendingScrollTarget,
  location
}) {

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);



return (
  <nav
    className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 hover:scale-105"
    style={{ width: "90%", maxWidth: "1150px", height: NAVBAR_HEIGHT }}
  >
    {/* MAIN BAR */}
    <div
      className={`
        w-full h-full flex items-center justify-between px-6
        rounded-3xl border backdrop-blur-sm transition-all duration-300
        ${
          scrolledPastHero
            ? "bg-white/10 border-white/20"
            : "bg-white/10 border-white/10"
        }
      `}
    >
      {/* LOGO */}
      <img
        src={LOGO_URL}
        alt="Big Brain Studios"
        className="h-12 md:h-20 w-auto"
      />

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center space-x-8 font-medium">
        <button
          onClick={() => {
            if (location.pathname === "/") nativeScrollToSection("hero");
            else {
              setPendingScrollTarget("hero");
              navigate("/");
            }
          }}
          className="hover:text-red-500 transition"
        >
          Home
        </button>

        <button
          onClick={() => {
            if (location.pathname === "/") nativeScrollToSection("about");
            else {
              setPendingScrollTarget("about");
              navigate("/");
            }
          }}
          className="hover:text-red-500 transition"
        >
          About
        </button>

<button
  onClick={() => navigate("/services")}
  className="hover:text-red-500 transition"
>
  Services
</button>

<button
  onClick={() => navigate("/projects")}
  className="hover:text-red-500 transition"
>
  Projects
</button>


        <button
          onClick={() => {
            if (location.pathname === "/") nativeScrollToSection("contact-home");
            else {
              setPendingScrollTarget("contact-home");
              navigate("/");
            }
          }}
          className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition"
        >
          Contact
        </button>
      </div>

      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Open menu"
      >
        ☰
      </button>
    </div>

    {/* MOBILE MENU */}
    {mobileOpen && (
      <div className="md:hidden absolute top-full left-0 w-full mt-4 rounded-2xl bg-black/90 md:backdrop-blur-xl border border-white/10 p-6 space-y-6 text-center">
        {["Home", "About", "Services", "Projects"].map((label) => (
          <button
            key={label}
            className="block w-full text-lg font-semibold hover:text-red-500 transition"
onClick={() => {
  setMobileOpen(false);

  if (label === "Home") {
    if (location.pathname === "/") nativeScrollToSection("hero");
    else {
      setPendingScrollTarget("hero");
      navigate("/");
    }
  }

  if (label === "Services") {
    navigate("/services");
  }

  if (label === "Projects") {
    navigate("/projects");
  }

  if (label === "About") {
    if (location.pathname === "/") nativeScrollToSection("about");
    else {
      setPendingScrollTarget("about");
      navigate("/");
    }
  }
}}

          >
            {label}
          </button>
        ))}

        <button
          className="w-full bg-red-600 py-3 rounded-xl font-bold"
          onClick={() => {
            setMobileOpen(false);
            if (location.pathname === "/") nativeScrollToSection("contact-home");
            else {
              setPendingScrollTarget("contact-home");
              navigate("/");
            }
          }}
        >
          Contact
        </button>
      </div>
    )}
  </nav>
);
}

// -------------------------
// CONTACT (hoisted)
// -------------------------
function ContactSection({ contactData, formId = "contact-form" }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE,
      import.meta.env.VITE_EMAILJS_TEMPLATE,
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC
    );

    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  } catch (error) {
    console.error("EmailJS error:", error);
    alert("Failed to send message. Please try again.");
  }
};



  return (
    <section aria-labelledby="contact-heading" className="px-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-10">
          <p className="text-red-500 text-xs tracking-[0.3em] md:tracking-[0.6em] font-semibold mb-3">{contactData?.subtitle || "GET IN TOUCH"}</p>
          <h2 id="contact-heading" className="heading-font clamp-heading-lg font-black">{contactData?.title || "Contact Us"}</h2>
          <p className="text-gray-300 body-font mt-3">{contactData?.description || "We typically respond within one business day."}</p>
        </div>

        {/* Premium Glass Card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
            {/* subtle gradients and highlights */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-20%,rgba(239,68,68,0.08),transparent)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_110%_120%,rgba(168,85,247,0.06),transparent)]" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.08)]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Copy/CTA */}
              <div className="relative p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="max-w-lg">
                  <h3 className="heading-font font-black clamp-heading-xl mb-4">
                    {contactData?.leftTitle || "LET'S TALK"}
                  </h3>
                  <p className="text-gray-300 body-font mb-8">
                    {contactData?.leftDescription || "Tell us about your goals and timelines. We'll propose a tailored sprint with milestones and a delivery rhythm that fits your pipeline."}
                  </p>



                  <div className="flex items-center gap-3">
                    <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth',block:'start'})} className="px-6 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold shadow-[0_10px_30px_rgba(239,68,68,0.25)] hover:brightness-110 transition">
                      {contactData?.primaryButtonText || "Start your brief →"}
                    </button>
                    <a href={`mailto:${contactData?.emailAddress || "hello@bigbrainstudios.com"}`} className="px-6 py-3 rounded-full border border-white/15 hover:bg-white/10 transition text-gray-200">
                      {contactData?.secondaryButtonText || "Email us"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <form id={formId} onSubmit={handleSubmit} className="relative p-8 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="body-font text-sm text-gray-300 mb-2 block">{contactData?.formLabels?.name || "Name"}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition"
                      placeholder={contactData?.formPlaceholders?.name || "Your name"}
                    />
                  </div>
                  <div>
                    <label className="body-font text-sm text-gray-300 mb-2 block">{contactData?.formLabels?.email || "Email"}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition"
                      placeholder={contactData?.formPlaceholders?.email || "you@company.com"}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="body-font text-sm text-gray-300 mb-2 block">{contactData?.formLabels?.message || "Message"}</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition resize-none"
                    placeholder={contactData?.formPlaceholders?.message || "Tell us about your project, goals, budget, and timeline"}
                  />
                </div>

                <div className="mt-6 responsive-cta-row">
                  <p className="text-xs text-gray-400 body-font text-center md:text-left">{contactData?.termsText || "By sending, you agree to our terms and privacy policy."}</p>
                  <button type="submit" disabled={submitting} className="w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap px-8 md:px-10 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold text-white hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]">
                    {submitting ? 'Sending…' : (contactData?.submitButtonText || 'Send message')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------
// HOME (hoisted)
// -------------------------
// -------------------------
// HOME (hoisted)
// -------------------------
function Home({ NAVBAR_HEIGHT, scrollToSection, setSelectedService, services, projects, aboutData, homeHeroData, contactData }) {
  const navigate = useNavigate();

  const [activeService, setActiveService] = useState(0);

  return (
    <div
  className="bg-transparent text-white"
>

      {/* Hero */}
      {SHOW_HERO && (
<section
  id="hero"
  className="relative w-full overflow-hidden min-h-[100svh] pb-24"
>

<HomeBackgroundVideo videoUrl={homeHeroData?.videoUrl} />

        <div className="absolute inset-0 bg-black/30" />

        <div className="
          absolute
          bottom-20 md:bottom-28
          left-6 md:left-16
          z-10
          text-left
          max-w-3xl
        ">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight whitespace-normal md:whitespace-nowrap">
            {homeHeroData?.headline || "THE BIGBRAIN STUDIOS"}
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-300 font-medium tracking-wide">
            {homeHeroData?.subheadline || "Your Premier Animation Partner"}
          </p>
        </div>
      </section>
      )}

      {/* Services interactive (revamped) */}
      <section id="services-section" className="pt-24 pb-24 px-4 bg-transparent" style={{ paddingTop: NAVBAR_HEIGHT + 24 }}>
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-600 text-xs tracking-[0.6em] font-semibold mb-4">OUR EXPERTISE</p>
            <h2 className="heading-font clamp-heading-lg font-black text-white max-w-3xl mx-auto">
              Built-for-speed creative pods for animation, CGI, and campaigns
            </h2>
            <p className="text-gray-300 body-font mt-3 max-w-2xl mx-auto">
              Hover to preview. Click to deep-dive the service with process and samples.
            </p>
          </div>

{services && services.length > 0 ? (
  <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-start">

    {/* LEFT SIDE LIST */}
    <div className="lg:w-3/5 space-y-5">
      {services.map((s, i) => (
        <div
          key={s._id}
          onMouseEnter={() => setActiveService(i)}
          onClick={() => {
            navigate("/services/" + s._id);
          }}
          className="group cursor-pointer rounded-xl px-2 py-4 md:py-5 transition-colors duration-300 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-3">
            <span
              className={`${
                i === activeService
                  ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                  : "bg-white/20"
              } h-2 w-2 rounded-full transition-all`}
            />
            <h3
              className={`heading-font text-6xl md:text-7xl font-black transition-colors duration-300 ${
                i === activeService ? "text-white" : "text-gray-600"
              }`}
            >
              {s.title}
            </h3>
          </div>

          <div
            className={`mt-2 h-px bg-gradient-to-r from-red-600/80 via-red-500/40 to-transparent ${
              i === activeService
                ? "opacity-100"
                : "opacity-50 group-hover:opacity-80"
            }`}
          />
        </div>
      ))}

      <button
        onClick={() => navigate("/services")}
        className="text-white flex items-center gap-2 mt-4 hover:text-red-500 transition-colors font-semibold"
      >
        <span className="text-2xl">+</span> SEE ALL SERVICES
      </button>
    </div>

    {/* RIGHT PREVIEW */}
    <div className="lg:w-2/5">
      <div className="relative sticky top-32 rounded-3xl overflow-hidden border border-white/15 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        <div className="relative h-80 md:h-96 overflow-hidden">
          {safeImageUrl(services[activeService]?.image, { width: 1200, quality: 80 }) && (
            <img
              src={safeImageUrl(services[activeService]?.image, { width: 1200, quality: 80 })}
              alt={services[activeService]?.title || 'Loading'}
            />
          )}

          {/* Gradient overlay and inner highlight border */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />
          {/* Top-left badge */}
          <div className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.35em] uppercase rounded-full bg-black/50 border border-white/10">
            Preview
          </div>
        </div>

        <div className="p-6 md:p-7">
          <h3 className="heading-font text-2xl font-black text-white mb-2">
            {services[activeService]?.title || 'Loading...'}
          </h3>
          <p className="text-gray-300 body-font mb-6">
            {services[activeService]?.description || 'Loading...'}
          </p>
          <button
            onClick={() => {
              if (services[activeService]) {
                navigate("/services/" + services[activeService]._id);
              }
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold hover:brightness-110 transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
          >
            READ MORE →
          </button>
        </div>
      </div>
    </div>

  </div>
) : (
  <p className="text-center text-gray-400 py-20">
    Loading services…
  </p>
)}


            {/* RIGHT SIDE LIST (refined, no borders) */}
            
        </div>
      </section>

      <HomeProjectsSection projects={projects} />

      {/* About */}
      <section id="about" className="bg-transparent text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">WHO WE ARE</p>
            <h2 className="text-5xl font-black mb-8">{aboutData?.headline || "About Us"}</h2>
          </div>

          <div className="max-w-4xl mx-auto text-lg space-y-6 leading-relaxed">
            {aboutData?.body ? (
              aboutData.body.map((block, idx) => (
                <p key={idx} className="text-xl">
                  {block.children?.map(child => child.text).join('') || ''}
                </p>
              ))
            ) : (
              <p className="text-center text-gray-400 py-20">
                Loading about content…
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-home">
        <ContactSection contactData={contactData} formId="contact-form-home" />
      </section>
    </div>
  );
}

// -------------------------
// SERVICES PAGE (hoisted)
// -------------------------
function Services({ NAVBAR_HEIGHT, setSelectedService, scrollToSection, services, contactData }) {
  const navigate = useNavigate();

  const [highlightedService, setHighlightedService] = useState(services?.[0] || null);

  if (!services || !services.length) {
  return <div className="text-center text-white py-20">Loading services…</div>;
}

  const capabilityPills = [
    "Concept Development",
    "Realtime Rendering",
    "Global Team",
    "Story Boarding",
    "Brand Strategy",
  ];

  return (
    <div className="bg-transparent text-white relative"style={{ paddingTop: NAVBAR_HEIGHT }}>

      <div className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <p className="text-red-500 text-sm tracking-[0.4em] mb-5 font-semibold">WHAT WE DO</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Full-stack creative production with cinematic polish.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {capabilityPills.map((pill) => (
            <span key={pill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm tracking-wide backdrop-blur">
              {pill}
            </span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_minmax(0,0.9fr)] gap-12 items-stretch mb-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white">Capabilities</h2>
                <span className="text-sm uppercase tracking-[0.4em] text-gray-400">Studio Flow</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {Array.isArray(services) && services.length === 0 ? (
                  <p className="text-center col-span-full text-gray-400 py-16">
                    Loading services…
                  </p>
                ) : (
                  Array.isArray(services) && services.map((service, idx) => (
                    <button
                      key={service?._id || idx}
                      onMouseEnter={() => setHighlightedService(service)}
                      onClick={() => {
                        if (service) {
                          navigate("/services/" + service._id);
                        }
                      }}
                      className="text-left rounded-2xl bg-white/5 border border-white/10 px-5 py-6 transition-all duration-300 hover:border-red-500/50 hover:bg-white/10 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_40px_rgba(239,68,68,0.15)]"
                    >
                      <p className="text-xs uppercase tracking-[0.5em] text-gray-400 mb-3">
                        0{idx + 1}
                      </p>
                      <h3 className="text-2xl font-bold mb-3">{service?.title || 'Loading...'}</h3>
                      <p className="text-gray-300 text-sm">{service?.description || 'Loading...'}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {highlightedService && (
                <motion.div
                  key={highlightedService._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full bg-gradient-to-br from-red-600/20 via-white/5 to-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur"
                >
                  <div className="relative h-72">
                    {(() => {
                      const src = safeImageUrl(highlightedService.image, { width: 1400 });
                      return src && (
                        <img
                          src={src}
                          alt={highlightedService.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-xs uppercase tracking-[0.6em] text-red-200 mb-2">featured</p>
                      <h3 className="text-3xl font-black">{highlightedService.title}</h3>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <p className="text-gray-200 text-lg">{highlightedService.details}</p>

                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(highlightedService.samples) && highlightedService.samples.slice(0, 3).map((sample, idx) => {
                        const src = safeImageUrl(sample, { width: 500 });
                        return src && (
                          <img
                            key={`${highlightedService._id}-${idx}`}
                            src={src}
                            alt={`${highlightedService.title} sample ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-20 w-24 object-cover rounded-xl border border-white/10"
                          />
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        navigate("/services/" + highlightedService._id);
                      }}
                      className="mt-4 inline-flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-colors"
                    >
                      Schedule a sprint →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur"
          >
            <h3 className="text-2xl font-black mb-4">Production flow</h3>
            <p className="text-gray-300 mb-6">
              From concept to delivery, our pipeline keeps creative momentum
              while maintaining studio-level quality gates.
            </p>
            <div className="space-y-6 md:space-y-8 max-w-xl">
              {[
                {
                  title: "CoNcEpT & Pre-Visualization",
                  bullets: "• Aligning brand strategy • Storyboarding • Styleframes"
                },
                {
                  title: "3D & World Building",
                  bullets: "• High-Fidelity Modeling • Texturing • Camera Blocking"
                },
                {
                  title: "Animation & Cinematography",
                  bullets: "• Motion Design • Lighting Setup • Fluid Simulation"
                },
                {
                  title: "Rendering & Post-Production",
                  bullets: "• 4K Rendering • Compositing • Color Grading • Final Delivery"
                }
              ].map((step, idx) => (
                <div key={step.title} className="
                  text-left rounded-2xl border px-5 py-6 bg-[#09090b]/60 border-white/10
                  transition-all duration-300 hover:bg-white/[0.04]
                  hover:border-red-500/50
                ">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-white/[0.3] to-white/[0.08] backdrop-blur-xl border border-white/[0.3] shadow-[0_4px_18px_rgba(255,255,255,0.15)] font-black text-xl text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                    <h4
                        className="font-black text-white mb-0.01"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {step.title}
                      </h4>
                      <p className="text-gray-200 text-sm leading-relaxed">{step.bullets}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-[#0f0f12]/80 via-[#1b0b11]/80 to-[#35060f]/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 overflow-hidden min-h-[600px] flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/5 to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  backgroundPosition: ["100% 100%", "0% 0%", "100% 100%"],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-500/5 to-transparent rounded-full blur-3xl"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.03),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.02),transparent_50%)]" />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 text-center">What You Can Expect</h3>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { text: "Fast Delivery", icon: "⚡", desc: "Rapid turnaround without compromising quality" },
                  { text: "High Retention", icon: "🎯", desc: "Clients keep coming back for results" },
                  { text: "Low Revisions", icon: "✨", desc: "Get it right the first time" },
                  { text: "Serious Output", icon: "🚀", desc: "Professional-grade creative work" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.15, type: "spring", stiffness: 100 }}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-red-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <motion.span
                        className="text-4xl group-hover:scale-125 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        {item.icon}
                      </motion.span>
                      <div>
                        <span className="text-white font-bold text-lg block mb-1">{item.text}</span>
                        <span className="text-gray-300 text-sm">{item.desc}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center mb-8"
              >
                <p className="text-gray-300 mb-4 font-black text-2xl bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                  We Move Fast. We Get it Right.
                </p>
                <p className="text-gray-400 font-semibold text-lg">
                  That's the Point
                </p>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239,68,68,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("contact-section-services")}
              className="relative w-full py-4 px-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl font-bold text-white hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
              <span className="relative z-10">Open brief template →</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>

        <section id="contact-section-services">
          <ContactSection contactData={contactData} formId="contact-form-services" />
        </section>
      </div>
    </div>
  );
}


// -------------------------
// SERVICE DETAIL (hoisted)
// -------------------------
function ServiceDetail({ NAVBAR_HEIGHT, selectedService, services }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const service = selectedService || services?.find((s) => s._id === id);

  if (!service) {
    return <div className="text-center text-gray-400 py-20">Service not found</div>;
  }

  return (
    <div className="bg-transparent text-white"style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/15 rounded-full text-gray-200 hover:bg-white/20 transition backdrop-blur"
          >
            <span>←</span> Back to Services
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left: Hero Image & Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-20%,rgba(239,68,68,0.08),transparent)]" />

              <div className="relative h-80 md:h-96">
                {(() => {
                  const src = safeImageUrl(service?.image, { width: 1400 });
                  return src && (
                    <img
                      src={src}
                      alt={service?.title}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-6 left-6 px-4 py-2 text-xs uppercase tracking-[0.4em] bg-black/50 rounded-full border border-white/10">
                  Service Detail
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{service?.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{service?.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black mb-4">About This Service</h2>
              <p className="text-gray-300 leading-relaxed">{service?.details}</p>
            </div>



            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('contact-form-service-detail')?.scrollIntoView({behavior:'smooth'})}
              className="w-full px-8 py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full font-semibold text-white hover:brightness-110 transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
            >
              Get Started →
            </motion.button>
          </motion.div>
        </div>

        {/* Sample Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <p className="text-red-500 text-xs tracking-[0.6em] font-semibold mb-3">SAMPLE WORK</p>
            <h2 className="text-4xl md:text-5xl font-black">See Our Craft in Action</h2>
            <p className="text-gray-300 text-lg mt-3 max-w-2xl mx-auto">
              Explore our portfolio of {service?.title.toLowerCase()} projects that showcase our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(service?.samples) && service.samples.map((img, idx) => {
              const src = safeImageUrl(img, { width: 900 });
              if (!src) return null;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={src}
                      alt={`Sample ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-semibold"></span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <ContactSection formId="contact-form-service-detail" />
      </div>
    </div>
  );
}

// -------------------------
// PROJECTS PAGE (hoisted)
// -------------------------
const filterOptions = ["All", "Cinematic", "CGI", "Campaigns", "Experiential", "Realtime"];
const accentGradients = [
  "from-red-600/40 via-pink-600/20 to-transparent",
  "from-orange-500/40 via-amber-500/20 to-transparent",
  "from-fuchsia-500/40 via-purple-500/20 to-transparent",
  "from-sky-500/40 via-cyan-500/20 to-transparent",
];

function Projects({ NAVBAR_HEIGHT, setSelectedProject, scrollToSection, projects, contactData }) {
  const navigate = useNavigate();

  const processedProjects = useMemo(
    () =>
      projects.map((project, idx) => ({
        ...project,
        displayCategory: project.category || filterOptions[(idx % (filterOptions.length - 1)) + 1],
        accent: accentGradients[idx % accentGradients.length],
        shots: 18 + idx * 3,
        duration: `${45 + idx * 5}s`,
      })),
    [projects]
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = back

  const visibleProjects = useMemo(
    () => (activeFilter === "All" ? processedProjects : processedProjects.filter((p) => p.displayCategory === activeFilter)),
    [activeFilter, processedProjects]
  );

  const wrappedVisibleProjects = visibleProjects.length > 0 ? visibleProjects : processedProjects;
  const heroProject = wrappedVisibleProjects[heroIndex % wrappedVisibleProjects.length];

  // Auto-rotate hero
  useEffect(() => {
    if (isPaused || wrappedVisibleProjects.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % wrappedVisibleProjects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, wrappedVisibleProjects.length, heroIndex]);

  useEffect(() => {
    setHeroIndex(0);
  }, [activeFilter]);

  const goto = (index, dir = 0) => {
    const safe = Math.max(0, Math.min(index, wrappedVisibleProjects.length - 1));
    setDirection(dir);
    setHeroIndex(safe);
  };

  const prev = () => goto((heroIndex - 1 + wrappedVisibleProjects.length) % wrappedVisibleProjects.length, -1);
  const next = () => goto((heroIndex + 1) % wrappedVisibleProjects.length, 1);

  return (
    <div className="bg-transparent text-white" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Top heading (no whileInView so it shows immediately) */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center max-w-4xl mx-auto space-y-4">
          <p className="text-red-500 text-xs tracking-[0.6em] font-semibold">PORTFOLIO LAB</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Immersive storytelling built for campaigns, films, and realtime
            experiences.
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse the hero carousel — minimal, refined, and focused on the imagery. Click "View hero case" to open the full project details.
          </p>
        </motion.div>

        {/* LEFT-ONLY HERO */}
        <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative" aria-roledescription="carousel">
          <AnimatePresence mode="wait">
            {heroProject && (
              <motion.div
                key={heroProject._id}
                custom={direction}
                variants={{
                  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
                  center: { opacity: 1, x: 0 },
                  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 80 : -80 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.65,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.65 },
                  x: { duration: 0.65 },
                  filter: { duration: 0.65 },
                }}
                className="rounded-3xl overflow-hidden border-2 border-white/10 bg-gradient-to-b from-white/8 to-white/4 shadow-2xl md:backdrop-blur-xl"
              >
                {/* Glass background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-white/2 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/3 via-transparent to-purple-500/3 pointer-events-none" />

                {/* Inset glow border */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.08)] pointer-events-none" />

                <div className="relative h-[26rem] md:h-[34rem] lg:h-[40rem] overflow-hidden">
                  {(() => {
                    const src = safeImageUrl(heroProject.image, { width: 1800 });
                    return src && (
                      <motion.img
                        src={src}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.14}
                        onDragStart={() => setIsPaused(true)}
                        onDragEnd={(_, info) => {
                          const threshold = 80;
                          if (info.offset.x < -threshold) next();
                          else if (info.offset.x > threshold) prev();
                          setTimeout(() => setIsPaused(false), 250);
                        }}
                        whileTap={{ scale: 0.995 }}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing touch-pan-x"
                        style={{ userSelect: "none", WebkitUserDrag: "none" }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <motion.span
                    aria-hidden
                    initial={{ x: "-20%" }}
                    animate={{ x: isPaused ? "-10%" : "40%" }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                    className="absolute -right-40 -top-32 w-80 h-80 bg-gradient-to-r from-red-500/16 to-transparent rounded-full blur-3xl pointer-events-none"
                  />
                  <div className="absolute left-6 bottom-6 right-6 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-widest text-red-300 font-semibold mb-1">{heroProject.tag}</div>
                      <h2 className="text-3xl md:text-4xl font-black mb-1">{heroProject.title}</h2>
                      <p className="text-gray-300 max-w-2xl line-clamp-2">{heroProject.description}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(239,68,68,0.18)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate("/projects/" + heroProject._id);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full font-semibold hover:brightness-105 transition shadow-lg"
                      >
                        View hero case →
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(heroProject.video, "_blank")}
                        className="px-4 py-2 border border-white/10 rounded-lg text-sm text-gray-200 hover:bg-white/4 transition"
                      >
                        Watch demo
                      </motion.button>
                    </div>
                  </div>

                  {/* controls */}
                  <div className="absolute right-6 top-6 flex items-center gap-3">
                    <motion.button onClick={prev} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center w-11 h-11 rounded-full bg-black/30 border border-white/8 shadow-lg backdrop-blur-md" aria-label="Previous">
                      <span className="text-xl text-white/90">‹</span>
                    </motion.button>
                    <motion.button onClick={next} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-500 border border-red-400 shadow-[0_12px_30px_rgba(239,68,68,0.18)]" aria-label="Next">
                      <span className="text-xl text-white font-bold">›</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                setActiveFilter(option);
              }}
              className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest transition ${
                activeFilter === option
                  ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.35)]"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-red-500/60"
              }`}
            >
              {option}
            </button>
          ))}
        </motion.div>

        {/* Project grid (uses memoized ProjectGrid, no blink) */}
        <ProjectGrid
          visibleProjects={visibleProjects}
          onProjectClick={(project) => {
            navigate("/projects/" + project._id);
          }}
        />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 responsive-cta-row">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-400 mb-3">COLLAB MODE</p>
            <h3 className="text-3xl font-black mb-3">Need something custom?</h3>
            <p className="text-gray-300 max-w-2xl">
             Share the brief. We’ll plug in fast and take it from there.

            </p>
          </div>
          <button onClick={() => scrollToSection("contact-section-projects")} className="w-full md:w-auto px-6 py-3 bg-red-600 rounded-full font-semibold hover:bg-red-500 transition">
            Start a project →
          </button>
        </div>

        <section id="contact-section-projects">
          <ContactSection contactData={contactData} formId="contact-form-projects" />
        </section>
      </div>
    </div>
  );
}


// -------------------------
// PROJECT DETAIL (hoisted)
// -------------------------
function ProjectDetail({ NAVBAR_HEIGHT, selectedProject, projects }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const project = selectedProject || projects?.find((p) => p._id === id);

  if (!project) {
    return <div className="text-center text-gray-400 py-20">Project not found</div>;
  }

  const [direction, setDirection] = useState(0);

  const idx = Math.max(0, projects.findIndex((p) => p._id === project._id));
  const tagOptions = ["All", "Cinematic", "CGI", "Campaigns", "Experiential", "Realtime"];
  const projectTag = tagOptions[(idx % (tagOptions.length - 1)) + 1];
  const shots = 18 + idx * 3;

const goToProject = (newProject) => {
  const newIdx = projects.findIndex((p) => p._id === newProject._id);
  setDirection(newIdx > idx ? 1 : -1);
  navigate(`/projects/${newProject._id}`);
};


  return (
    <div className="bg-transparent text-white" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-12">
        <button onClick={() => navigate("/projects")} className="mb-8 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-500 transition">
          ← Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* LEFT: hero, description, images, video */}
          <div className="order-1 lg:order-1">
            <AnimatePresence mode="wait">
              {project && (
                <motion.div
                  key={project._id}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      x: dir > 0 ? 300 : -300,
                      y: dir > 0 ? -100 : 100,
                      opacity: 0,
                      scale: 0.85,
                      rotateY: dir > 0 ? -25 : 25,
                      rotateZ: dir > 0 ? 3 : -3,
                    }),
                    center: {
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      rotateZ: 0,
                    },
                    exit: (dir) => ({
                      x: dir < 0 ? 300 : -300,
                      y: dir < 0 ? -100 : 100,
                      opacity: 0,
                      scale: 0.85,
                      rotateY: dir < 0 ? -25 : 25,
                      rotateZ: dir < 0 ? 3 : -3,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.75,
                    ease: [0.34, 1.56, 0.64, 1],
                    scale: { duration: 0.75 },
                    opacity: { duration: 0.75 },
                  }}
                  style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                  className="relative mb-12"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="absolute inset-0 rounded-3xl border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] pointer-events-none" />

                    <div className="relative h-96 md:h-[28rem] lg:h-96 overflow-hidden">
                      {(() => {
                        const src = safeImageUrl(project.image, { width: 1800 });
                        return src && (
                          <motion.img
                            src={src}
                            alt={project.title}
                            initial={{ scale: 1.15, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
                      <motion.div
                        initial={{ x: "-40%", opacity: 0 }}
                        animate={{ x: "100%", opacity: 0.12 }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-400/30 to-transparent rounded-full blur-3xl pointer-events-none"
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-3">
                        <div className="inline-flex items-center gap-2 w-fit">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-xs uppercase tracking-widest text-red-300 font-semibold mb-1">{projectTag}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight">{project.title}</h1>
                        <p className="text-gray-200 max-w-2xl line-clamp-2 text-lg">{project.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{project.details}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {Array.isArray(project.images) && project.images.map((img, imgIdx) => {
                const src = safeImageUrl(img, { width: 900 });
                if (!src) return null;
                return (
                  <motion.img
                    key={imgIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: imgIdx * 0.1 }}
                    src={src}
                    alt={`Project ${imgIdx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
                  />
                );
              })}
            </div>

            {project.video && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
                <h2 className="text-2xl md:text-4xl font-black mb-6">Demo</h2>
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
                  <iframe className="w-full h-full" src={project.video} title="Demo Video" allowFullScreen />
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="order-2 lg:order-2 sticky top-[120px]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/4 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />

              <div className="relative p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">{project.deliveryRhythm?.title || "Delivery rhythm"}</h3>
                  <span className="text-xs uppercase tracking-widest text-gray-400">{project.deliveryRhythm?.subtitle || "Sprint stats"}</span>
                </div>

                <p className="text-gray-300 text-sm">{project.deliveryRhythm?.description || "Focused sprints covering look-dev, hero shots, and finishing — tailored per project."}</p>

                <div className="grid grid-cols-2 gap-4">
                  {(project.deliveryRhythm?.stats || [
                    { label: "Avg. sprint", value: "24 days" },
                    { label: "Shots / drop", value: shots.toString() },
                    { label: "Realtime scenes", value: "6+" },
                    { label: "Live toolkit", value: "UE + Houdini" },
                  ]).map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="rounded-xl bg-white/6 border border-white/8 p-3 backdrop-blur-sm hover:bg-white/8 transition"
                    >
                      <p className="text-xs uppercase text-gray-400">{stat.label}</p>
                      <div className="text-xl font-black mt-1">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  {(project.deliveryRhythm?.progressBars || [
                    { label: "Narrative development", percentage: 45 },
                    { label: "Realtime previz", percentage: 60 },
                    { label: "Hero shot polish", percentage: 75 },
                  ]).map((bar, i) => (
                    <motion.div key={bar.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                        <span>{bar.label}</span>
                        <span className="font-semibold text-red-400">{bar.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/6 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <motion.div
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${bar.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                          className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/4 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />

              <div className="relative p-6 md:p-8 space-y-6">
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Featured projects</div>
                  <div className="grid grid-cols-1 gap-2">
                    {projects.slice(0, 6).map((p) => (
                      <motion.button
                        key={p._id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goToProject(p)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition backdrop-blur-sm border ${
                          p._id === project._id
                            ? "bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white border-red-400 shadow-[0_8px_20px_rgba(239,68,68,0.2)]"
                            : "bg-white/6 text-gray-300 hover:bg-white/8 border-white/10"
                        }`}
                      >
                        {p.title}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="font-semibold">Project</span>
                    <span className="text-red-400 font-semibold">{idx + 1}/{projects.length}</span>
                  </div>
                  <div className="h-2 bg-white/6 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(100, (shots / 36) * 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        <section id="contact-section-project-detail">
          <ContactSection formId="contact-form-project-detail" />
        </section>
      </div>
    </div>
  );
}

// -------------------------
// Cinematic background component (brand-consistent, purpose-driven)
// -------------------------
function CinematicBackground() {
  // Bokeh Light Orbs variant (brand-consistent reds/magentas)
  const orbs = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    size: 180 + (i % 6) * 80, // reduced sizes for perf
    x: (i * 83) % 100,
    y: (i * 47) % 100,
    hue: [
      'rgba(255,58,58,0.12)',
      'rgba(255,77,109,0.10)',
      'rgba(217,39,98,0.10)'
    ][i % 3],
    delay: (i % 7) * 1.5,
    dur: 22 + (i % 5) * 8,
  }));

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-black">
      {/* Base tinted gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000000 80%, #8b0000 100%)' }} />

      {/* Bokeh orbs */}
      {orbs.map((o) => (
        <motion.div
          key={o.id}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 30% 30%, ${o.hue}, rgba(0,0,0) 65%)`,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
          initial={{ opacity: 0.08, scale: 0.98 }}
          animate={{
            opacity: [0.08, 0.16, 0.1],
            scale: [0.98, 1.05, 1.0],
            x: [0, 12, -8, 0],
            y: [0, -10, 8, 0],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
        />
      ))}

      {/* Gentle corner tints for depth */}
      <motion.div
        className="absolute -left-40 -top-20 w-[600px] h-[600px] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle at center, rgba(255,40,60,0.18), rgba(0,0,0,0) 70%)' }}
        animate={{ opacity: [0.12, 0.2, 0.14], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 bottom-0 w-[700px] h-[700px] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle at center, rgba(255,20,60,0.14), rgba(0,0,0,0) 70%)' }}
        animate={{ opacity: [0.1, 0.18, 0.12], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// -------------------------
// App Component (now only orchestrates state + layout)
// -------------------------
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null);

  const NAVBAR_HEIGHT = 80;

    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [aboutData, setAboutData] = useState(null);
    const [homeHeroData, setHomeHeroData] = useState(null);
    const [contactData, setContactData] = useState(null);
  // Scroll logic for navbar transparency / hero

useEffect(() => {
  sanityClient.fetch(
    `*[_type == "service"]{
      _id,
      title,
      description,
      details,
      image,
      samples,
      whyChooseUs
    }`
  ).then(data => {
    setServices(data || []);
  }).catch(err => {
    console.error('Failed to fetch services:', err);
    setServices([]);
  });
}, []);


useEffect(() => {
  sanityClient.fetch(
    `*[_type == "project"]{
      _id,
      title,
      description,
      details,
      image,
      images,
      video,
      deliveryRhythm,
      category
    }`
  ).then(setProjects).catch(err => {
    console.error('Failed to fetch projects:', err);
    setProjects([]);
  });
}, []);

useEffect(() => {
  sanityClient.fetch(`*[_type == "about"][0]`).then(setAboutData).catch(err => {
    console.error('Failed to fetch about data:', err);
    setAboutData(null);
  });
}, []);

useEffect(() => {
  sanityClient.fetch(`*[_type == "homeHero"][0]`).then(data => {
    console.log("HOME HERO FROM SANITY:", data);
    setHomeHeroData(data);
  }).catch(err => {
    console.error("HOME HERO FETCH ERROR:", err);
    setHomeHeroData(null);
  });
}, []);


useEffect(() => {
  sanityClient.fetch(`*[_type == "contact"][0]`).then(setContactData).catch(err => {
    console.error('Failed to fetch contact data:', err);
    setContactData(null);
  });
}, []);

useEffect(() => {
  if (location.pathname === "/") {
    document.documentElement.classList.add("home-page");
    document.body.classList.add("home-page");
  } else {
    document.documentElement.classList.remove("home-page");
    document.body.classList.remove("home-page");
  }
  return () => {
    document.documentElement.classList.remove("home-page");
    document.body.classList.remove("home-page");
  };
}, [location.pathname]);


  useEffect(() => {
    if (location.pathname !== "/") {
      setScrolledPastHero(true);
      return;
    }

    const update = () => {
      const heroEl = document.getElementById("hero");
      const heroHeight = heroEl?.getBoundingClientRect().height || 0;

      const shouldBeScrolled = window.scrollY > Math.max(50, heroHeight - NAVBAR_HEIGHT - 20);

      setScrolledPastHero((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [location.pathname]);




const scrollToSection = (id, retries = 10) => {
  const el = document.getElementById(id);

  if (!el) {
    if (retries > 0) {
      setTimeout(() => scrollToSection(id, retries - 1), 100);
    }
    return;
  }

  // 🍎 iOS Safari: native, non-smooth
  if (isIOS()) {
    el.scrollIntoView({ block: "start" });
    return;
  }

  // Existing behavior (UNCHANGED for others)
  const y =
    window.scrollY +
    el.getBoundingClientRect().top -
    NAVBAR_HEIGHT +
    8;

  window.scrollTo({ top: y, behavior: "smooth" });
};


const nativeScrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  if (isIOS()) {
    el.scrollIntoView({ block: "start" });
    return;
  }

  el.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};



useEffect(() => {
  if (isIOS()) return;

  if (location.pathname === "/" && pendingScrollTarget) {
    // Wait for Home DOM to be fully mounted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nativeScrollToSection(pendingScrollTarget);
        setPendingScrollTarget(null);
      });
    });
  }
}, [location.pathname, pendingScrollTarget]);



// Single source of truth: scroll to top on every page change
useEffect(() => {
  if (isIOS()) {
    // iOS: let Safari manage position naturally
    window.scrollTo(0, 0);
    return;
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, [location.pathname]);


// Disable browser scroll restoration so it doesn't restore previous positions
useEffect(() => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}, []);



  // -------------------------
// Render
  // -------------------------
  return (
    <ErrorBoundary>
      <div className="relative overflow-x-hidden">

        <CinematicBackground />

<Navbar
  scrolledPastHero={scrolledPastHero}
  NAVBAR_HEIGHT={NAVBAR_HEIGHT}
  scrollToSection={scrollToSection}
  nativeScrollToSection={nativeScrollToSection}
  setPendingScrollTarget={setPendingScrollTarget}
  location={location}
/>


<div className="relative z-10">
  <Routes>
    <Route
      path="/"
      element={
        <Home
          NAVBAR_HEIGHT={NAVBAR_HEIGHT}
          scrollToSection={scrollToSection}
          setSelectedService={setSelectedService}
          services={services}
          projects={projects}
          aboutData={aboutData}
          homeHeroData={homeHeroData}
          contactData={contactData}
        />
      }
    />

    <Route
      path="/services"
      element={
        <Services
          NAVBAR_HEIGHT={NAVBAR_HEIGHT}
          setSelectedService={setSelectedService}
          scrollToSection={scrollToSection}
          services={services}
          contactData={contactData}
        />
      }
    />

    <Route
      path="/services/:id"
      element={
        <ServiceDetail
          NAVBAR_HEIGHT={NAVBAR_HEIGHT}
          selectedService={selectedService}
          services={services}
        />
      }
    />

    <Route
      path="/projects"
      element={
        <Projects
          NAVBAR_HEIGHT={NAVBAR_HEIGHT}
          setSelectedProject={setSelectedProject}
          scrollToSection={scrollToSection}
          projects={projects}
          contactData={contactData}
        />
      }
    />

    <Route
      path="/projects/:id"
      element={
        <ProjectDetail
          NAVBAR_HEIGHT={NAVBAR_HEIGHT}
          selectedProject={selectedProject}
          projects={projects}
        />
      }
    />
  </Routes>
</div>


      </div>
    </ErrorBoundary>
  ); 
}

export default App;
