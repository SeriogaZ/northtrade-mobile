import express from 'express';

export const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Premium smartphones & accessories', active: 'home' });
});

router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About us', active: 'about' });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact & support', active: 'contact' });
});

router.get('/shop', (req, res) => {
  res.render('shop/index', { title: 'Shop catalog', active: 'shop' });
});

router.get('/projects/phone-shop', (req, res) => {
  res.redirect(301, '/shop');
});
