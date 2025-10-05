import cloudinary from "../config/cloudinary.js";
import { formatBufferTo64 } from "../middleware/uploadMiddleware.js";
import Upload from "../models/Upload.js";

// ✅ Upload a project
export const handleUpload = async (req, res) => {
  try {
    let {
      category,
      projectName,
      description,
      keywords,
      demoLink,
      sourceLink,
      editableProjectLink,
    } = req.body;

    // 🛡️ Basic Validation
    if (!category || !projectName || !description) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // 🧼 Normalize category to lowercase
    category = category.trim().toLowerCase();
    console.log("⤵️ Final category to be saved:", category); // ✅ debug

    // 🧠 Upload file to Cloudinary
    let fileUrl = null;
    if (req.file) {
      console.log("🧾 File received:", req.file?.originalname, req.file?.mimetype, req.file?.size);
      const file64 = formatBufferTo64(req.file);

      if (!file64?.content) {
        console.log("❌ File to base64 conversion failed:", file64);
        return res.status(400).json({ msg: "Invalid file format" });
      }

      const cloudRes = await cloudinary.uploader.upload(file64.content, {
        resource_type: "auto",
        folder: "theme_browser_uploads",
        public_id: `${Date.now()}_${req.file.originalname.split('.')[0]}`,
        use_filename: true,
      });

      fileUrl = cloudRes.secure_url;
      console.log("✅ File uploaded to Cloudinary:", fileUrl);
    }

    // 📌 Convert keywords
    const keywordArray =
      typeof keywords === "string"
        ? keywords.split(",").map((k) => k.trim().toLowerCase())
        : Array.isArray(keywords)
        ? keywords.map((k) => k.trim().toLowerCase())
        : [];

    // 🧾 Create Upload doc
    const newUpload = new Upload({
      userId: req.user.id,
      category,
      projectName: projectName.trim(),
      description: description.trim(),
      keywords: keywordArray,
      demoLink: demoLink?.trim(),
      sourceLink: sourceLink?.trim(),
      editableProjectLink: editableProjectLink?.trim(),
      fileUrl,
    });

    await newUpload.save();
    console.log("✅ Upload saved to DB:", newUpload);

    res.status(201).json({
      success: true,
      msg: "✅ Upload successful",
      projectId: newUpload._id,
      data: newUpload,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    res.status(500).json({ success: false, msg: "Upload failed", error: err.message });
  }
};

// ✅ Clean & Safe: Get uploads by category (case-insensitive match)
export const getUploadsByCategory = async (req, res) => {
  const requestedCategory = req.params.category.toLowerCase();

  try {
    const uploads = await Upload.find();

    const filtered = uploads.filter(upload => 
      upload.category.toLowerCase() === requestedCategory
    );

    res.status(200).json({ uploads: filtered });
  } catch (error) {
    console.error("❌ Error fetching uploads by category:", error.message);
    res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
  }
};


// ✅ Get uploads by logged-in user
export const getUploadsByUser = async (req, res) => {
  try {
    console.log("👤 Fetching uploads for user:", req.user.id);

    const uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, uploads });
  } catch (err) {
    console.error("❌ Error fetching user uploads:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch user uploads" });
  }
};
