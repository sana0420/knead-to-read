const express = require("express")
const mongoose = require("mongoose")
const SubscriptionPlan = require("../models/SubscriptionPlan")
const subscriptionPlansData = require("../data/subscriptionPlans")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

// Helper to auto-seed if empty
const ensurePlansExist = async () => {
    try {
        const count = await SubscriptionPlan.countDocuments()
        if (count === 0) {
            await SubscriptionPlan.insertMany(subscriptionPlansData)
        }
    } catch (err) {
        console.error("Auto-seed error:", err)
    }
}

// Helper to find a plan by Mongo _id or custom planId
const findPlan = async (idOrPlanId) => {
    if (!idOrPlanId) return null
    if (mongoose.Types.ObjectId.isValid(idOrPlanId)) {
        const byId = await SubscriptionPlan.findById(idOrPlanId)
        if (byId) return byId
    }
    return await SubscriptionPlan.findOne({ planId: idOrPlanId })
}

// Formatter to ensure both status and all plan fields are present
const formatPlan = (plan) => {
    const obj = plan.toObject ? plan.toObject() : plan
    return {
        ...obj,
        status: obj.isActive ? "active" : "inactive",
    }
}

// ==========================================
// GET all plans (both / and /plans)
// ==========================================
const getAllPlans = async (req, res) => {
    try {
        await ensurePlansExist()
        const plans = await SubscriptionPlan.find({}).sort({ createdAt: 1 })
        res.json(plans.map(formatPlan))
    } catch (error) {
        console.error("Error fetching subscription plans:", error)
        res.status(500).json({ message: "Server Error" })
    }
}
router.get("/", getAllPlans)
router.get("/plans", getAllPlans)

// ==========================================
// GET single plan by ID or planId (both /plans/:id and /:id)
// ==========================================
const getSinglePlan = async (req, res) => {
    try {
        const plan = await findPlan(req.params.id)
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" })
        res.json(formatPlan(plan))
    } catch (error) {
        console.error("Error fetching subscription plan:", error)
        res.status(500).json({ message: "Server Error" })
    }
}
router.get("/plans/:id", getSinglePlan)
router.get("/:id", getSinglePlan)

// ==========================================
// PUT update plan (both /plans/:id and /:id)
// ==========================================
const updatePlan = async (req, res) => {
    try {
        const plan = await findPlan(req.params.id)
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" })

        const {
            name,
            badge,
            category,
            description,
            includes,
            intervals,
            isActive
        } = req.body

        if (name !== undefined) plan.name = name.trim()
        if (badge !== undefined) plan.badge = badge ? badge.trim() : null
        if (category !== undefined) plan.category = category
        if (description !== undefined) plan.description = description
        if (includes !== undefined && Array.isArray(includes)) {
            plan.includes = includes.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean)
        }
        if (intervals !== undefined) {
            plan.intervals = intervals
        }
        if (isActive !== undefined) {
            plan.isActive = Boolean(isActive)
        }

        const updated = await plan.save()
        res.json(formatPlan(updated))
    } catch (error) {
        console.error("Error updating subscription plan:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
}
router.put("/plans/:id", protect, admin, updatePlan)
router.put("/:id", protect, admin, updatePlan)

// ==========================================
// PATCH toggle status (both /plans/:id/toggle-status, /:id/toggle-status, /plans/:id, and /:id)
// ==========================================
const toggleStatus = async (req, res) => {
    try {
        const plan = await findPlan(req.params.id)
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" })

        if (req.body.isActive !== undefined) {
            plan.isActive = Boolean(req.body.isActive)
        } else {
            plan.isActive = !plan.isActive
        }

        const updated = await plan.save()
        res.json(formatPlan(updated))
    } catch (error) {
        console.error("Error toggling plan status:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
}
router.patch("/plans/:id/toggle-status", protect, admin, toggleStatus)
router.patch("/:id/toggle-status", protect, admin, toggleStatus)
router.patch("/plans/:id", protect, admin, toggleStatus)
router.patch("/:id", protect, admin, toggleStatus)

// ==========================================
// POST create plan (both /plans and /)
// ==========================================
const createPlan = async (req, res) => {
    try {
        const {
            planId,
            name,
            badge,
            category,
            description,
            includes,
            intervals,
            isActive
        } = req.body

        if (!name || !category) {
            return res.status(400).json({ message: "Name and Category are required" })
        }

        const generatedPlanId = planId || `plan_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        const existing = await SubscriptionPlan.findOne({ planId: generatedPlanId })
        if (existing) {
            return res.status(400).json({ message: "A plan with this ID or name already exists" })
        }

        const newPlan = new SubscriptionPlan({
            planId: generatedPlanId,
            name: name.trim(),
            badge: badge ? badge.trim() : null,
            category,
            description: description || name,
            includes: Array.isArray(includes)
                ? includes.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean)
                : [],
            intervals: intervals || {},
            isActive: isActive !== undefined ? Boolean(isActive) : true
        })

        const saved = await newPlan.save()
        res.status(201).json(formatPlan(saved))
    } catch (error) {
        console.error("Error creating subscription plan:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
}
router.post("/plans", protect, admin, createPlan)
router.post("/", protect, admin, createPlan)

// ==========================================
// DELETE plan (both /plans/:id and /:id)
// ==========================================
const deletePlan = async (req, res) => {
    try {
        const plan = await findPlan(req.params.id)
        if (!plan) return res.status(404).json({ message: "Subscription plan not found" })

        await plan.deleteOne()
        res.json({ message: "Subscription plan deleted", id: req.params.id })
    } catch (error) {
        console.error("Error deleting subscription plan:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
}
router.delete("/plans/:id", protect, admin, deletePlan)
router.delete("/:id", protect, admin, deletePlan)

module.exports = router
