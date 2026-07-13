import Home from "../models/home.js";
import { uploadToCloud, deleteFromCloud } from "../utils/CloudUpload.js";

// Sections allowed to be patched via PUT /api/home
const ALLOWED_SECTIONS = [
  "hero",
  "whoWeAre",
  "ourProducts",
  "ourProcess",
  "featuredProducts",
  "whyChooseUs",
  "industriesWeServe",
  "testimonials",
  "ctaBanner",
];

// There is only ever one Home document. This fetches it,
// creating it (with schema defaults) on first run.
const getOrCreateHome = async () => {
  let home = await Home.findOne();
  if (!home) {
    home = await Home.create({});
  }
  return home;
};

/**
 * @desc   Get all home page content
 * @route  GET /api/home
 * @access Public — consumed directly by the storefront frontend
 */
export const getHomeContent = async (req, res) => {
  try {
    const home = await getOrCreateHome();
    res.status(200).json({ success: true, data: home });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Update one or more sections of the home page content.
 *         Send only the section(s) you want to change, e.g.:
 *           { "testimonials": { "items": [...] } }
 *           { "hero": { "headingLine1": "New headline" } }
 *         Each provided section REPLACES that section as a whole
 *         (so for arrays, send the full updated array — add/remove/
 *         edit items on the client before submitting).
 * @route  PUT /api/home
 * @access Private/Admin
 */
export const updateHomeContent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const home = await getOrCreateHome();

    ALLOWED_SECTIONS.forEach((section) => {
      if (req.body[section] !== undefined) {
        const current = home[section]?.toObject ? home[section].toObject() : {};
        home[section] = { ...current, ...req.body[section] };
        home.markModified(section);
      }
    });

    await home.save();

    res.status(200).json({ success: true, data: home });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Upload an image for any home section (hero slide, brand logo,
 *         WhoWeAre photo, featured project image, etc). Upload first,
 *         then include the returned url/publicId in your PUT /api/home
 *         payload for the relevant section.
 * @route  POST /api/home/upload
 * @access Private/Admin
 * @body   multipart/form-data — field "image" (file), optional "folder"
 */
export const uploadHomeImage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    const folder = req.body.folder || "home";
    const result = await uploadToCloud(req.file, folder);

    res.status(200).json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc   Delete a previously uploaded home-content image from Cloudinary
 *         (e.g. when an admin removes a slide, brand, or project image).
 * @route  DELETE /api/home/upload
 * @access Private/Admin
 * @body   { "publicId": "home/xxxxx" }
 */
export const deleteHomeImage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const { publicId } = req.body;
    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, message: "publicId is required" });
    }

    await deleteFromCloud(publicId);
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};