/**
 * Index Page Data Module
 * 
 * Page-specific data for the home/index page.
 * Experience and skills data is defined here for easy editing.
 */

import { createPageTemplate, type IndexContentData } from "jsr:@kunal-singh/cometa";

const indexPage = createPageTemplate<IndexContentData>({
  id: "index",
  title: "Kunal Singh - Full-Stack Developer",
  output: "index.html",
  layout: "base",
  
  header: {
    showNav: false,
  },
  
  content: {
    hero: {
      photo: "profile-photo.jpeg",
      name: "Kunal Singh",
      tagline: "Full-Stack Developer",
      description: "Crafting digital experiences with clean code and thoughtful architecture. Passionate about building products that make a difference.",
    },
    
    experience: [
      {
        dateRange: "2025 — Present",
        title: "Engineering Manager",
        company: "Pebble Inc.",
        location: "Remote",
        type: "Full Time",
        description: "Started as freelance full-stack engineer owning end-to-end React web platform and Node.js/TypeScript backend on AWS EKS; promoted to full-time Engineering Manager. Architected greenfield microservices using clean architecture principles while leading remote team. Developed event-driven distributed systems in Python using Redis Streams, Kubernetes API, and CI/CD on GKE.",
        current: true,
      },
      {
        dateRange: "2024 — 2025",
        title: "Senior Software Engineer",
        company: "Triveous Inc.",
        location: "Remote",
        type: "Freelance",
        description: "Built enterprise-grade desktop applications using Electron.js, React, and WebRTC for high-performance multi-platform deployment. Self-taught Flutter and Dart to deliver production-ready mobile applications.",
      },
      {
        dateRange: "2023 — 2024",
        title: "Senior Software Engineer",
        company: "Phasio",
        location: "Remote",
        type: "Full Time",
        description: "Drove UX revamp resulting in 3x increase in daily active users and 2x increase in average order value. Established company-wide design system and branding guidelines. Implemented ESLint, Stylelint, and Playwright end-to-end testing.",
      },
      {
        dateRange: "2020 — 2023",
        title: "Senior Software Engineer",
        company: "Joveo",
        location: "Hyderabad",
        type: "Full Time",
        description: "Built 2 enterprise-grade products from 0-1 to production in Angular and React. Led team of 5 junior frontend developers through end-to-end product deliveries. Drove major architectural decisions including SSO authentication.",
      },
      {
        dateRange: "2018 — 2020",
        title: "Freelance Frontend Engineer",
        company: "Self Employed",
        location: "Remote",
        type: "Freelance",
        description: "Delivered production applications including React e-commerce platform (FHM India), enterprise Angular app (Joveo), custom Shopify themes (Supplecent, iAyur, Rage Coffee), and AWS Serverless MERN prototype.",
      },
      {
        dateRange: "2016 — 2018",
        title: "Technical Lead",
        company: "iDecorama",
        location: "New Delhi",
        type: "Full Time",
        description: "Led cross-functional team of 10 developers and designers building social marketplace from scratch. Delivered web, Android, iOS, and offline tools achieving 150,000 downloads with 25% active user retention.",
      },
      {
        dateRange: "2014 — 2016",
        title: "Technical Lead",
        company: "PosterGully",
        location: "New Delhi",
        type: "Full Time",
        description: "Automated backend operations enabling 10x order volume growth. Built and led development team, launching Android and iOS applications while scaling marketplace to 15,000+ artists. Promoted to Technical Lead within 1 year.",
      },
    ],
    
    skills: ["React", "TypeScript", "Node.js", "Python", "Kubernetes"],
  },
  
  footer: {
    showCopyright: true,
  },
  
  meta: {
    description: "Kunal Singh - Full-Stack Developer. Building products with React, TypeScript, Node.js, Python and cloud infrastructure.",
    keywords: ["full-stack developer", "react", "typescript", "node.js", "kubernetes" , "python"],
  },
});

export default indexPage;
