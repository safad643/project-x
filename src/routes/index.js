const express = require('express');
const path = require('path');
const router = express.Router();

// Development-only routes for UI testing
// These routes serve static HTML files for easy UI development

// Favicon route
router.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response for favicon
});

// Homepage route
router.get('/homepage-view', (req, res) => {
    res.render('pages/homepage');
});

// Login/Register page route
router.get('/index-view', (req, res) => {
    res.render('pages/index');
});

// Rooms page route
router.get('/rooms-view', (req, res) => {
    res.render('pages/rooms');
});

// Subscriptions page route
router.get('/subscriptions-view', (req, res) => {
    res.render('pages/subscriptions');
});

// Profile page route
router.get('/profile-view', (req, res) => {
    res.render('pages/profile');
});

// Contact page route
router.get('/contact-view', (req, res) => {
    res.render('pages/contact');
});

// Root route - redirect to homepage
router.get('/', (req, res) => {
    res.redirect('/homepage-view');
});


module.exports = router; 