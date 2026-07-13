import mongoose from "mongoose";

/* ════════════════════════════════════════════════════════════════
   Reusable sub-schemas
   Each gets its own _id so the admin panel can target/edit/delete
   a single array item (e.g. one testimonial, one slide) by id.
═══════════════════════════════════════════════════════════════════ */

// Used by: hero.stats, whyChooseUs.stats
// `value` is kept as a String so it can hold either a number ("2500")
// or text ("Pan") — e.g. Hero's "Pan India" stat. The frontend counter
// component can Number(value) when it needs to animate it.
const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  suffix: { type: String, default: "" },
  label: { type: String, required: true },
});

// Used by: hero.slides
const slideSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Cloudinary secure_url
  imagePublicId: { type: String }, // Cloudinary public_id (for deletion)
  label: { type: String, required: true },
  sub: { type: String, default: "" },
});

// Used by: hero.brands (marquee logos)
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String },
});

// Used by: whoWeAre.features (simple checklist — icon is fixed in UI)
const checklistItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
});

// Used by: whyChooseUs.features (icon is a custom inline SVG in the UI,
// so only the text + accent color are editable content)
const highlightFeatureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  accentColor: { type: String, default: "#A8003E" },
});

// Used by: ourProducts.products
// `icon` stores a react-icons key (e.g. "LuStore") — map it back to a
// component on the frontend with a small lookup table.
const productServiceSchema = new mongoose.Schema({
  icon: { type: String, default: "LuStore" },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  href: { type: String, default: "/products" },
});

// Used by: featuredProducts.products (project/portfolio gallery)
const projectItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  imagePublicId: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, default: "" },
  tag: { type: String, default: "" },
});

// Used by: industriesWeServe.industries
const industryItemSchema = new mongoose.Schema({
  icon: { type: String, default: "LuStore" },
  iconColor: { type: String, default: "#A78BFA" },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  clients: { type: [String], default: [] },
  href: { type: String, default: "/Clientele" },
});

// Used by: testimonials.items
const testimonialItemSchema = new mongoose.Schema({
  initial: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, default: 5, min: 1, max: 5 },
});

// Used by: ourProcess.steps
// `icon` stores a react-icons key (e.g. "LuSearch") — map it back to a
// component on the frontend with a small lookup table.
const processStepSchema = new mongoose.Schema({
  icon: { type: String, default: "LuSearch" },
  tag: { type: String, required: true }, // e.g. "DISCOVER"
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

/* ════════════════════════════════════════════════════════════════
   Main Home schema — one document holds the whole page.
   Section names map 1:1 to your component file names.
═══════════════════════════════════════════════════════════════════ */

const homeSchema = new mongoose.Schema(
  {
    // ── Hero.jsx ──────────────────────────────────────────────
    hero: {
      badgeText: {
        type: String,
        default: "Complete Retail Solutions · Est. 2013",
      },
      headingLine1: { type: String, default: "We Fill Your" },
      headingLine2: { type: String, default: "Brand Into" },
      headingLine3: { type: String, default: "Every Space." },
      subtext: {
        type: String,
        default:
          "End-to-end retail fit-out, signage, branding, interior and fixture solutions - designed, printed, fabricated, and installed across India. Trusted by 25+ leading brands since 2013.",
      },
      stats: { type: [statSchema], default: [] },
      slides: { type: [slideSchema], default: [] },
      brands: { type: [brandSchema], default: [] },
    },

    // ── WhoWeAre.jsx ──────────────────────────────────────────
    whoWeAre: {
      headingLine1: { type: String, default: "Founded in Delhi" },
      headingLine2: { type: String, default: "Built on" },
      headingLine3: { type: String, default: "Craftsmanship." },
      paragraph1: { type: String, default: "" },
      paragraph2: { type: String, default: "" },
      image: { type: String, default: "" },
      imagePublicId: { type: String },
      yearsOfExcellence: { type: Number, default: 15 },
      features: { type: [checklistItemSchema], default: [] },
    },

    // ── OurProducts.jsx ───────────────────────────────────────
    ourProducts: {
      headingLine1: { type: String, default: "End-to-End Signage" },
      headingLine2: { type: String, default: "& Branding" },
      headingLine3: { type: String, default: "Solutions" },
      products: { type: [productServiceSchema], default: [] },
    },

    // ── OurProducts.jsx ──────────────────────────────────
    ourProcess: {
      headingLine1: { type: String, default: "A Process That Ensures" },
      headingLine2: { type: String, default: "Perfect Execution" },
      steps: { type: [processStepSchema], default: [] },
    },

    // ── FeaturedProducts.jsx ──────────────────────────────────
    featuredProducts: {
      headingLine1: { type: String, default: "Spaces We've" },
      headingLine2: { type: String, default: "Transformed" },
      products: { type: [projectItemSchema], default: [] },
    },

    // ── WhyChooseUs.jsx ───────────────────────────────────────
    whyChooseUs: {
      headingLine1: { type: String, default: "Why Businesses" },
      headingLine2: { type: String, default: "Choose Us" },
      subtext: {
        type: String,
        default:
          "Backed by two decades of expertise, trusted by India's leading brands, and driven by a passion for impactful brand experiences that endure.",
      },
      stats: { type: [statSchema], default: [] },
      features: { type: [highlightFeatureSchema], default: [] },
    },

    // ── IndustriesWeServe.jsx ─────────────────────────────────
    industriesWeServe: {
      headingLine1: { type: String, default: "Build For" },
      headingLine2: { type: String, default: "Every Sector" },
      industries: { type: [industryItemSchema], default: [] },
    },

    // ── Testimonials.jsx ──────────────────────────────────────
    testimonials: {
      headingLine1: { type: String, default: "What Our" },
      headingLine2: { type: String, default: "Clients Say" },
      items: { type: [testimonialItemSchema], default: [] },
    },

    // ── CTABanner.jsx ─────────────────────────────────────────
    ctaBanner: {
      headline1: { type: String, default: "Ready To Transform" },
      headline2: { type: String, default: "Your Space?" },
      subText: {
        type: String,
        default: "Get in touch for a free consultation and quote.",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Home", homeSchema);
