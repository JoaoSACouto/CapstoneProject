const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
    const { amount, name, email } = req.body;

    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("❌ STRIPE_SECRET_KEY not configured");
        return res.status(500).json({ 
            error: "Payment service not configured",
            details: "Stripe secret key missing"
        });
    }

    if (!process.env.FRONTEND_URL) {
        console.error("❌ FRONTEND_URL not configured");
        return res.status(500).json({ 
            error: "Payment service not configured",
            details: "Frontend URL missing"
        });
    }

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ 
            error: "Invalid amount",
            details: "Amount must be a positive number"
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "cad",
                        product_data: {
                            name: name || "Anonymous Donor",
                        },
                        unit_amount: Math.round(amount * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate/cancel`,
            customer_email: email || undefined,
        });

        console.log("✅ Stripe session created:", session.id);
        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("❌ Stripe error:", error.message);
        console.error("❌ Stripe error details:", error);
        
        // Provide more specific error messages
        let errorMessage = "Payment session creation failed";
        if (error.type === 'StripeInvalidRequestError') {
            errorMessage = "Invalid payment request";
        } else if (error.type === 'StripeAuthenticationError') {
            errorMessage = "Payment service authentication failed";
        } else if (error.type === 'StripePermissionError') {
            errorMessage = "Payment service permission denied";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.message
        });
    }
});

module.exports = router;
