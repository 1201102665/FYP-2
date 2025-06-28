/* routes/recommendations.js ------------------------------------------------ */
import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* ————————————————— helpers ————————————————— */
function jaccard(a = [], b = []) {
    const A = new Set(a.map(t => t.toLowerCase()));
    const B = new Set(b.map(t => t.toLowerCase()));
    const inter = [...A].filter(x => B.has(x)).length;
    const union = new Set([...A, ...B]).size;
    return union === 0 ? 0 : inter / union;
}

function priceScore(price, min, max) {
    const mid = (min + max) / 2;
    const span = Math.max((max - min) / 2, 1);
    const score = 1 - Math.abs(price - mid) / span;
    return Math.max(0, Math.min(1, score));          // clamp 0–1
}

/* ————————————————— GET /api/recommendations ——————————————— */
router.get('/', authenticateToken, async (req, res) => {
    try {
        /* 1 ▸ current user -------------------------------------------------- */
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthenticated' });
        }

        /* 2 ▸ load all prefs for this user --------------------------------- */
        const prefsRows = await db.query(
            `SELECT preference_key, preference_value
         FROM user_preferences
        WHERE user_id = ?`,
            [userId]
        );

        /* ---- parse into variables ---- */
        let userActivities = [];
        let userDestinations = [];
        let userTravelStyles = [];
        let minBudget = 500;     // sensible defaults
        let maxBudget = 3000;

        if (prefsRows && prefsRows.length > 0) {
            for (const row of prefsRows) {
                const { preference_key: k, preference_value: v } = row;
                try {
                    switch (k) {
                        case 'preferred_activities': userActivities = JSON.parse(v); break;
                        case 'favorite_destinations': userDestinations = JSON.parse(v); break;
                        case 'travel_style': userTravelStyles = JSON.parse(v); break;
                        case 'budget_range_min': minBudget = parseFloat(v); break;
                        case 'budget_range_max': maxBudget = parseFloat(v); break;
                        default: /* ignore */;
                    }
                } catch { /* malformed JSON → skip */ }
            }
        }

        const userTags = [...userActivities, ...userTravelStyles, ...userDestinations];

        /* 3 ▸ fetch all active packages ------------------------------------ */
        const packagesRaw = await db.query(
            `SELECT *
         FROM packages
        WHERE status = 'active'`
        );

        /* 4 ▸ score each package ------------------------------------------- */
        const W_INT = 0.55;   // interests weight
        const W_PRICE = 0.45;   // price weight

        const scored = packagesRaw.map(pkg => {
            /* parse JSON columns safely */
            try { pkg.activities = JSON.parse(pkg.activities) || []; } catch { pkg.activities = []; }
            try { pkg.travel_styles = JSON.parse(pkg.travel_styles) || []; } catch { pkg.travel_styles = []; }
            try { pkg.tags = JSON.parse(pkg.tags) || []; } catch { pkg.tags = []; }

            const pkgTags = [...pkg.activities, ...pkg.travel_styles, ...(pkg.dest_region ? [pkg.dest_region] : [])];

            const intScore = jaccard(userTags, pkgTags);
            const priceSc = priceScore(Number(pkg.price ?? pkg.base_price), minBudget, maxBudget);
            pkg.score = W_INT * intScore + W_PRICE * priceSc;

            return pkg;
        });

        /* 5 ▸ sort by blended score DESC ----------------------------------- */
        scored.sort((a, b) => b.score - a.score);

        /* 6 ▸ pagination ---------------------------------------------------- */
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;
        const paginated = scored.slice(offset, offset + limit);

        /* 7 ▸ respond ------------------------------------------------------- */
        res.json({
            success: true,
            data: {
                packages: paginated,
                pagination: {
                    page,
                    limit,
                    total: scored.length,
                    pages: Math.ceil(scored.length / limit),
                    hasNext: offset + limit < scored.length,
                    hasPrev: page > 1
                },
                user_preferences: {
                    activities: userActivities,
                    destinations: userDestinations,
                    travel_styles: userTravelStyles,
                    budget_range: [minBudget, maxBudget]
                }
            }
        });
    } catch (err) {
        console.error('Recommendations error:', err);
        res.status(500).json({ success: false, error: 'Failed to get recommendations' });
    }
});

export default router;
