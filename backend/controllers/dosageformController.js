import Dosageform from "../models/dosageformModel.js";

export const getAllDosageform = async (req, res) => {
  try {
    const dosageforms = await Dosageform.find();
    res.status(200).json(dosageforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDosageform = async (req, res) => {
  try {
    const { dosageform } = req.body;
    const newDosageform = new Dosageform({
      dosageform
    });
    await newDosageform.save();
    res.status(201).json(newDosageform);
  } catch (error) {
    console.error("Error adding dosageform:", error);
    res.status(500).json({ error: "Failed to add dosageform" });
  }
};

export const updateDosageform = async (req, res) => {
  try {
    const { id } = req.params;
    const { dosageform } =
      req.body;

    const updatedDosageform = await Dosageform.findByIdAndUpdate(
      id,
      {
        dosageform,
        updated_at: Date.now(),
      },
      { new: true }
    );

    res.json({ success: true, dosageform: updatedDosageform });
  } catch (error) {
    console.error("Error updating dosageform:", error);
    res.json({ success: false, error: "Failed to update dosageform" });
  }
};

export const deleteDosageform = async (req, res) => {
  try {
    const { id } = req.params;
    await Dosageform.findByIdAndDelete(id);
    res.json({ success: true, message: "Dosageform deleted successfully" });
  } catch (error) {
    console.error("Error deleting dosageform:", error);
    res.json({ success: false, error: "Failed to delete dosageform" });
  }
};
