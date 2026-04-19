// lib/section-registry.tsx
// ============================================
// SECTION REGISTRY - Extensible Section-Driven Architecture
// ============================================
// This file defines all available sections with their metadata,
// templates, and requirements. Add new sections here to make them
// available throughout the builder without hardcoding.

import { Section, OccasionType } from './types';
import { OCCASION_REGISTRY } from './occasion-registry';
import { getTemplatesForSection as getTemplatesFromConfig, SECTION_TEMPLATE_MAP } from '@/config/templateConfig';
import React from 'react';

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export interface SectionTemplate {
  key: string;
  label: string;
  description: string;
  preview: React.ReactNode;
}

// ============================================
// SECTION METADATA
// ============================================

export interface SectionMetadata {
  key: Section;
  title: string;
  description: string;
  icon: string;
  // NEW: Occasion compatibility
  supportedOccasions?: OccasionType[]; 
  // Related sections for smarter suggestions
  relatedSections?: Section[];
  // Requirements
  requiresPhotos: boolean;
  requiresTimeline: boolean;
  requiresSong: boolean;
  requiresEvents?: boolean;
  // Configuration options
  hasTemplates: boolean;
  hasLayoutOption: boolean;
  hasMemoriesOption: boolean;
  // Default settings
  defaultEnabled: boolean;
  required: boolean;
  // Deprecation info
  deprecated?: boolean;
  deprecatedMessage?: string;
  // Preview
  previewEmoji: string;
}

// ============================================
// SECTION REGISTRY
// ============================================

export const SECTION_REGISTRY: Record<Section, SectionMetadata> = {
  // Core Sections
  home: {
    key: 'home',
    title: 'Home',
    description: 'Hero section with names, special date, and message',
    icon: '🏠',
    supportedOccasions: ['couple', 'wedding', 'anniversary', 'birthday', 'proposal', 'graduation', 'baby_shower', 'baptism', 'debut', 'memorial', 'family', 'friendship', 'travel', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: true,
    required: true,
    previewEmoji: '🏠',
  },
  gallery: {
    key: 'gallery',
    title: 'Gallery',
    description: 'Photo memories from your relationship journey',
    icon: '📸',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'baby_shower', 'baptism', 'debut', 'memorial', 'family', 'friendship', 'travel', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: true,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: true,
    required: false,
    previewEmoji: '📸',
  },
  timeline: {
    key: 'timeline',
    title: 'Timeline',
    description: 'Key moments in your love story',
    icon: '📅',
    supportedOccasions: ['couple', 'wedding', 'anniversary', 'proposal', 'family', 'friendship'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: true,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: true,
    required: false,
    previewEmoji: '📅',
  },
  song: {
    key: 'song',
    title: 'Song',
    description: 'Your special Spotify or YouTube song',
    icon: '🎵',
    supportedOccasions: ['couple','wedding','anniversary','proposal'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎵',
  },
  
  // Content Sections
  love_letter: {
    key: 'love_letter',
    title: 'Love Letter',
    description: 'Your heartfelt message to your partner',
    icon: '💌',
    supportedOccasions: ['couple', 'proposal', 'anniversary', 'valentines'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: true,
    required: false,
    previewEmoji: '💌',
  },
  our_story: {
    key: 'our_story',
    title: 'Our Story',
    description: 'Share your relationship story in detail',
    icon: '📖',
    supportedOccasions: ['couple', 'wedding', 'anniversary', 'proposal'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📖',
  },
  first_date: {
    key: 'first_date',
    title: 'First Date',
    description: 'Highlight your first date memory',
    icon: '🌹',
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false, // Hidden from new builder
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    deprecated: true,
    deprecatedMessage: 'Use Timeline section instead - your first date will appear as a timeline event.',
    previewEmoji: '🌹',
  },
  special_moments: {
    key: 'special_moments',
    title: 'Special Moments',
    description: 'Highlight memorable experiences together',
    icon: '⭐',
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false, // Hidden from new builder
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    deprecated: true,
    deprecatedMessage: 'Use Timeline section instead - special moments will appear as timeline events.',
    previewEmoji: '⭐',
  },
  milestones: {
    key: 'milestones',
    title: 'Milestones',
    description: 'Relationship achievements and accomplishments',
    icon: '🏆',
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false, // Hidden from new builder
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    deprecated: true,
    deprecatedMessage: 'Use Timeline section instead - milestones will appear as timeline events.',
    previewEmoji: '🏆',
  },
  
  // Photo Sections
  polaroid_gallery: {
    key: 'polaroid_gallery',
    title: 'Polaroid Gallery',
    description: 'Display photos in polaroid style frames',
    icon: '🖼️',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'family', 'friendship'],
    requiresPhotos: true,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🖼️',
  },
  
  // Music & Video
  playlist: {
    key: 'playlist',
    title: 'Playlist',
    description: 'Share your relationship playlist',
    icon: '🎶',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'baby_shower', 'baptism', 'debut', 'family', 'friendship', 'travel', 'valentines'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎶',
  },
  video_memories: {
    key: 'video_memories',
    title: 'Video Memories',
    description: 'Share embedded video memories',
    icon: '🎬',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'baby_shower', 'baptism', 'debut', 'memorial', 'family', 'friendship', 'travel', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎬',
  },
  
  // Stats & Counters
  relationship_stats: {
    key: 'relationship_stats',
    title: 'Relationship Stats',
    description: 'Show days, months, and hours together',
    icon: '📊',
    supportedOccasions: ['couple','anniversary','wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📊',
  },
  anniversary_countdown: {
    key: 'anniversary_countdown',
    title: 'Anniversary Countdown',
    description: 'Live countdown to your next anniversary',
    icon: '⏰',
    supportedOccasions: ['couple','anniversary','wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '⏰',
  },
  
  // Dreams & Future
  future_dreams: {
    key: 'future_dreams',
    title: 'Future Dreams',
    description: 'Share your plans and dreams together',
    icon: '💭',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'friendship', 'valentines'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💭',
  },
  
  // Interactive Sections
  quotes: {
    key: 'quotes',
    title: 'Love Quotes',
    description: 'Display romantic love quotes',
    icon: '💕',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'memorial', 'family', 'friendship', 'travel', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💕',
  },
  reasons_love_you: {
    key: 'reasons_love_you',
    title: 'Reasons I Love You',
    description: 'List all the reasons you love them',
    icon: '💖',
    supportedOccasions: ['couple', 'anniversary', 'wedding', 'valentines'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💖',
  },
  memory_map: {
    key: 'memory_map',
    title: 'Memory Map',
    description: 'Show places you have visited together',
    icon: '🗺️',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'baby_shower', 'memorial', 'family', 'friendship', 'travel'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🗺️',
  },
  birthday_message: {
    key: 'birthday_message',
    title: 'Birthday Message',
    description: 'Warm birthday wishes and heartfelt messages',
    icon: '🎂',
    supportedOccasions: ['birthday'],
    relatedSections: ['birthday_wishes', 'party_details', 'gift_wishlist', 'birthday_countdown', 'birthday_timeline'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: true,
    required: false,
    previewEmoji: '🎉',
  },
  birthday_wishes: {
    key: 'birthday_wishes',
    title: 'Birthday Wishes',
    description: 'A section to display birthday greetings from friends and family',
    icon: '🎈',
    supportedOccasions: ['birthday'],
    relatedSections: ['birthday_message', 'birthday_timeline', 'gift_wishlist'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: true,
    required: false,
    previewEmoji: '🎈',
  },
  birthday_countdown: {
    key: 'birthday_countdown',
    title: 'Birthday Countdown',
    description: 'Countdown to the birthday celebration',
    icon: '⏳',
    supportedOccasions: ['birthday'],
    relatedSections: ['birthday_message', 'birthday_wishes'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '⏳',
  },  
  // Guest & Messages
  birthday_timeline: {
    key: 'birthday_timeline',
    title: 'Birthday Timeline',
    description: 'Chronicle life milestones and memorable moments for the celebrant',
    icon: '🎂',
    supportedOccasions: ['birthday'],
    relatedSections: ['birthday_message', 'birthday_wishes', 'party_details'],
    requiresPhotos: false,
    requiresTimeline: true,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📆',
  },
  party_details: {
    key: 'party_details',
    title: 'Party Details',
    description: 'Event location, time, and dress code for the birthday party',
    icon: '📍',
    supportedOccasions: ['birthday'],
    relatedSections: ['birthday_message', 'birthday_wishes', 'gift_wishlist', 'birthday_timeline'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📍',
  },
  gift_wishlist: {
    key: 'gift_wishlist',
    title: 'Gift Wishlist',
    description: 'Let guests know the perfect gift ideas for the celebrant',
    icon: '🎁',
    supportedOccasions: ['birthday', 'baptism'],
    relatedSections: ['birthday_message', 'birthday_wishes', 'party_details'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎁',
  },
  // New Gift Ideas section (baptism-friendly)
  gift_ideas: {
    key: 'gift_ideas',
    title: 'Gift Ideas',
    description: 'Thoughtful and gentle gift suggestions for your celebration',
    icon: '🎁',
    supportedOccasions: ['baptism'],
    relatedSections: ['invitation', 'closing'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎁',
  },
  guest_messages: {
    key: 'guest_messages',
    title: 'Guest Messages',
    description: 'Let friends and family leave messages',
    icon: '💬',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'baby_shower', 'baptism', 'debut', 'memorial', 'family', 'friendship', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💬',
  },
  
  // Special Features
  letter_future: {
    key: 'letter_future',
    title: 'Letter to the Future',
    description: 'Write a message to open later',
    icon: '📮',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📮',
  },
  gift_section: {
    key: 'gift_section',
    title: 'Gift Section',
    description: 'Display digital love gifts',
    icon: '🎁',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎁',
  },
  surprise_message: {
    key: 'surprise_message',
    title: 'Surprise Message',
    description: 'Hidden message reveal feature',
    icon: '🎉',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'friendship', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎉',
  },
  wedding_countdown: {
    key: 'wedding_countdown',
    title: 'Wedding Countdown',
    description: 'Countdown to the wedding celebration',
    icon: '⏰',
    supportedOccasions: ['wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '⏰',
  },
  event_details: {
    key: 'event_details',
    title: 'Event Details',
    description: 'Share venue, date, and event information',
    icon: '📍',
    supportedOccasions: ['wedding', 'baby_shower', 'baptism', 'debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📍',
  },
  // Baptism / Invitation specific sections
  invitation: {
    key: 'invitation',
    title: 'Invitation',
    description: 'Invitation message and special notes (e.g., godparents)',
    icon: '✉️',
    supportedOccasions: ['baptism'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: true,
    required: false,
    previewEmoji: '✉️',
  },
  schedule: {
    key: 'schedule',
    title: 'Schedule',
    description: 'Ceremony and reception schedule items',
    icon: '🕒',
    supportedOccasions: ['baptism', 'wedding', 'debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🕒',
  },
  dress_code: {
    key: 'dress_code',
    title: 'Dress Code',
    description: 'Guidance on attire for guests',
    icon: '👗',
    supportedOccasions: ['baptism', 'wedding', 'debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '👗',
  },
  map_section: {
    key: 'map_section',
    title: 'Map',
    description: 'Embed or link to a map for the venue',
    icon: '🗺️',
    supportedOccasions: ['baptism', 'wedding', 'debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🗺️',
  },
  safety_protocol: {
    key: 'safety_protocol',
    title: 'Safety Protocol',
    description: 'Guidelines and safety information for event attendees',
    icon: '🦺',
    supportedOccasions: ['baptism','wedding','baby_shower','birthday','anniversary','family'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🦺',
  },
  closing: {
    key: 'closing',
    title: 'Closing Message',
    description: 'A short closing note and parent names for invitations',
    icon: '🙏',
    supportedOccasions: ['baptism', 'debut', 'wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: false,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🙏',
  },
  wedding_timeline: {
    key: 'wedding_timeline',
    title: 'Wedding Timeline',
    description: 'Chronicle the milestones leading to the wedding day',
    icon: '💍',
    supportedOccasions: ['wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: true,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💍',
  },
  gift_registry: {
    key: 'gift_registry',
    title: 'Gift Registry',
    description: 'Share a registry or curated gift list',
    icon: '🎁',
    supportedOccasions: ['wedding', 'baby_shower'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎁',
  },
  rsvp: {
    key: 'rsvp',
    title: 'RSVP',
    description: 'Collect responses or notes from guests',
    icon: '💌',
    supportedOccasions: ['wedding', 'baptism'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💌',
  },
  couple_message: {
    key: 'couple_message',
    title: 'Couple Message',
    description: 'A welcome message from the couple',
    icon: '💞',
    supportedOccasions: ['wedding'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💞',
  },
  graduation_message: {
    key: 'graduation_message',
    title: 'Graduation Message',
    description: 'A personal message to mark the graduation milestone',
    icon: '🎓',
    supportedOccasions: ['graduation'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎓',
  },
  countdown: {
    key: 'countdown',
    title: 'Countdown',
    description: 'Count down to the special date',
    icon: '⏳',
    supportedOccasions: ['proposal', 'graduation', 'baby_shower', 'debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '⏳',
  },
  school_memories: {
    key: 'school_memories',
    title: 'School Memories',
    description: 'A timeline of school highlights and favorite memories',
    icon: '🏫',
    supportedOccasions: ['graduation'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: true,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🏫',
  },
  achievements: {
    key: 'achievements',
    title: 'Achievements',
    description: 'Highlight major milestones and accomplishments',
    icon: '🏆',
    supportedOccasions: ['graduation'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: true,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🏆',
  },
  future_plans: {
    key: 'future_plans',
    title: 'Future Plans',
    description: 'Share the exciting plans that come next',
    icon: '💭',
    supportedOccasions: ['graduation', 'baby_shower'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💭',
  },
  baby_predictions: {
    key: 'baby_predictions',
    title: 'Baby Predictions',
    description: 'Fun predictions and wishes for the little one',
    icon: '🍼',
    supportedOccasions: ['baby_shower'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🍼',
  },
  parents_message: {
    key: 'parents_message',
    title: 'Parents Message',
    description: 'A message from the parents-to-be',
    icon: '💌',
    supportedOccasions: ['baby_shower', 'baptism'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💌',
  },
  photo_highlights: {
    key: 'photo_highlights',
    title: 'Photo Highlights',
    description: 'Showcase standout photos from the celebration',
    icon: '🖼️',
    supportedOccasions: ['debut', 'memorial', 'family', 'travel', 'mothers_day', 'fathers_day', 'baptism'],
    requiresPhotos: true,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🖼️',
  },
  celebrant_message: {
    key: 'celebrant_message',
    title: 'Celebrant Message',
    description: 'A note from the celebrant',
    icon: '🎤',
    supportedOccasions: ['debut'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎤',
  },
  life_story: {
    key: 'life_story',
    title: 'Life Story',
    description: 'Tell the story of a life filled with meaning and memories',
    icon: '📖',
    supportedOccasions: ['memorial'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📖',
  },
  tributes: {
    key: 'tributes',
    title: 'Tributes',
    description: 'Messages and words of remembrance from loved ones',
    icon: '🕊️',
    supportedOccasions: ['memorial'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🕊️',
  },
  family_message: {
    key: 'family_message',
    title: 'Family Message',
    description: 'A heartfelt message from the family',
    icon: '🏡',
    supportedOccasions: ['memorial', 'family', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🏡',
  },
  travel_timeline: {
    key: 'travel_timeline',
    title: 'Travel Timeline',
    description: 'Document the journey step by step',
    icon: '✈️',
    supportedOccasions: ['travel'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    requiresEvents: true,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: true,
    defaultEnabled: false,
    required: false,
    previewEmoji: '✈️',
  },
  travel_notes: {
    key: 'travel_notes',
    title: 'Travel Notes',
    description: 'Share notes and reflections from the trip',
    icon: '📝',
    supportedOccasions: ['travel'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: false,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '📝',
  },
  message_letter: {
    key: 'message_letter',
    title: 'Message Letter',
    description: 'A personal letter-style message',
    icon: '💌',
    supportedOccasions: ['mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '💌',
  },
  
  // Keepsake
  qr_keepsake: {
    key: 'qr_keepsake',
    title: 'QR Keepsake',
    description: 'A printable QR code card for physical keepsake',
    icon: '🎴',
    supportedOccasions: ['couple', 'birthday', 'wedding', 'anniversary', 'proposal', 'graduation', 'baby_shower', 'debut', 'family', 'travel', 'valentines', 'mothers_day', 'fathers_day'],
    requiresPhotos: false,
    requiresTimeline: false,
    requiresSong: false,
    hasTemplates: true,
    hasLayoutOption: true,
    hasMemoriesOption: false,
    defaultEnabled: false,
    required: false,
    previewEmoji: '🎴',
  },
};

// ============================================
// SECTION TEMPLATES MAP
// ============================================

export const SECTION_TEMPLATES: Partial<Record<Section, SectionTemplate[]>> = {
  home: [
    { 
      key: 'hero_centered', 
      label: 'Hero Centered',
      description: 'Centered content with large title and elegant spacing',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-rose-100 to-white rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-rose-300 mb-1"></div>
          <div className="w-10 h-1 bg-rose-200 rounded"></div>
        </div>
      )
    },
    { 
      key: 'split_layout', 
      label: 'Split Layout',
      description: 'Photo on one side, text on the other for a modern look',
      preview: (
        <div className="w-full h-full bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-2 flex gap-1">
          <div className="flex-1 rounded bg-rose-200/50"></div>
          <div className="flex-1 rounded bg-rose-300/50"></div>
        </div>
      )
    },
    { 
      key: 'fullscreen_banner', 
      label: 'Fullscreen Banner',
      description: 'Immersive full-width hero with background image support',
      preview: (
        <div className="w-full h-full bg-rose-200 rounded-lg p-2 flex items-end justify-center">
          <div className="w-12 h-6 bg-white/70 rounded"></div>
        </div>
      )
    },
    {
      key: 'parallax_immersive',
      label: 'Parallax Immersive',
      description: 'Interactive parallax hero with mouse movement and particles',
      preview: (
        <div className="w-full h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 rounded-lg p-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/parallax-pattern.svg')] opacity-20 animate-drift parallax-bg" />
          <div className="relative z-10 flex flex-col items-center justify-end h-full p-2">
            <div className="w-10 h-10 bg-white/60 rounded-full shadow-lg glow-rose mb-1 animate-float" />
            <div className="w-12 h-6 bg-white/80 rounded shimmer animate-shimmer" />
          </div>
        </div>
      )
    },
    {
      key: 'particles_fullscreen',
      label: 'Particles Fullscreen',
      description: 'Full immersive hero with floating particles and typewriter effects',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-rose-900 rounded-lg relative">
          <div className="absolute inset-0 particles-canvas opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <div className="text-2xl mb-2 animate-gentle-pulse">✨💕✨</div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-2 animate-shimmer" />
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full animate-fade-in-blur typewriter-text">
              Your names here<span className="ml-1">|</span>
            </div>
          </div>
        </div>
      )
    },
  ],
  gallery: [
    { 
      key: 'grid', 
      label: 'Grid',
      description: 'Classic masonry grid layout for displaying multiple photos',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-1.5 grid grid-cols-2 gap-1">
          <div className="rounded bg-rose-200"></div>
          <div className="rounded bg-pink-200"></div>
          <div className="rounded bg-rose-300"></div>
          <div className="rounded bg-pink-300"></div>
        </div>
      )
    },
    { 
      key: 'carousel', 
      label: 'Carousel',
      description: 'Swipeable carousel for an interactive photo experience',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-10 h-8 bg-rose-300 rounded-lg shadow-md"></div>
        </div>
      )
    },
    { 
      key: 'polaroid', 
      label: 'Polaroid',
      description: 'Vintage-style polaroid frames for a nostalgic feel',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-10 bg-white rounded-sm shadow-md flex items-center justify-center">
            <div className="w-6 h-5 bg-rose-200 rounded-sm"></div>
          </div>
        </div>
      )
    },
  ],
  timeline: [
    { 
      key: 'vertical_timeline', 
      label: 'Vertical Timeline',
      description: 'Chronological vertical timeline with connecting lines',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="flex-1 h-1.5 bg-rose-200 rounded"></div>
          </div>
        </div>
      )
    },
    { 
      key: 'milestone_cards', 
      label: 'Milestone Cards',
      description: 'Card-based design highlighting key moments',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col gap-1">
          <div className="h-2 bg-rose-200 rounded"></div>
          <div className="h-3 bg-white rounded shadow-sm"></div>
          <div className="h-2 bg-pink-200 rounded"></div>
          <div className="h-3 bg-white rounded shadow-sm"></div>
        </div>
      )
    },
    { 
      key: 'story_chapters', 
      label: 'Story Chapters',
      description: 'Chapter-based narrative layout for your love story',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-rose-50 to-pink-50 rounded-lg p-2 flex flex-col gap-1">
          <div className="h-2 w-2/3 bg-rose-300 rounded mx-auto"></div>
          <div className="flex-1 bg-white/60 rounded shadow-sm"></div>
        </div>
      )
    },
  ],
  song: [
    { 
      key: 'minimal_player', 
      label: 'Minimal Player',
      description: 'Clean and simple music player that plays your song',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-12 h-4 bg-rose-300 rounded-full"></div>
        </div>
      )
    },
    { 
      key: 'visual_player', 
      label: 'Visual Player',
      description: 'Music player with animated visualizer and album art',
      preview: (
        <div className="w-full h-full bg-gradient-to-br from-rose-200 to-purple-200 rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-8 bg-white/50 rounded-full"></div>
        </div>
      )
    },
    { 
      key: 'lyrics_card', 
      label: 'Lyrics Card',
      description: 'Beautiful card displaying your song lyrics with romantic styling',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-10 h-6 bg-white rounded shadow-sm flex items-center justify-center">
            <div className="w-8 h-0.5 bg-rose-200"></div>
          </div>
        </div>
      )
    },
  ],
  love_letter: [
    { 
      key: 'classic_letter', 
      label: 'Classic Love Letter',
      description: 'Elegant centered love message layout with romantic typography',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
          <div className="w-8 h-1 bg-rose-200 rounded mb-1"></div>
          <div className="w-10 h-0.5 bg-rose-100 rounded mb-1"></div>
          <div className="w-6 h-0.5 bg-rose-100 rounded"></div>
        </div>
      )
    },
    { 
      key: 'floral_border', 
      label: 'Floral Border',
      description: 'Love letter with decorative floral border framing your message',
      preview: (
        <div className="w-full h-full bg-rose-50 rounded-lg p-2 flex items-center justify-center">
          <div className="w-10 h-6 bg-white rounded shadow-sm border border-rose-100"></div>
        </div>
      )
    },
    { 
      key: 'handwritten', 
      label: 'Handwritten Style',
      description: 'Personal handwritten-style font for an intimate feel',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-10 h-6 bg-white rounded shadow-sm transform -rotate-1"></div>
        </div>
      )
    },
  ],
  qr_keepsake: [
    { 
      key: 'qr_card', 
      label: 'QR Keepsake Card',
      description: 'QR card with caption and couple names for printing',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded shadow-sm grid grid-cols-3 gap-0.5 p-1">
            <div className="bg-rose-300 rounded-sm"></div>
            <div className="bg-rose-100 rounded-sm"></div>
            <div className="bg-rose-300 rounded-sm"></div>
            <div className="bg-rose-100 rounded-sm"></div>
            <div className="bg-rose-300 rounded-sm"></div>
            <div className="bg-rose-100 rounded-sm"></div>
            <div className="bg-rose-300 rounded-sm"></div>
            <div className="bg-rose-100 rounded-sm"></div>
            <div className="bg-rose-300 rounded-sm"></div>
          </div>
        </div>
      )
    },
    { 
      key: 'qr_mini', 
      label: 'Mini QR Tag',
      description: 'Compact QR code tag perfect for keychains or small keepsakes',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full shadow-sm grid grid-cols-3 gap-0.5 p-1">
            <div className="bg-rose-300 rounded-full"></div>
            <div className="bg-rose-100 rounded-full"></div>
            <div className="bg-rose-300 rounded-full"></div>
            <div className="bg-rose-100 rounded-full"></div>
            <div className="bg-rose-300 rounded-full"></div>
            <div className="bg-rose-100 rounded-full"></div>
            <div className="bg-rose-300 rounded-full"></div>
            <div className="bg-rose-100 rounded-full"></div>
            <div className="bg-rose-300 rounded-full"></div>
          </div>
        </div>
      )
    },
    { 
      key: 'qr_ornament', 
      label: 'QR Ornament',
      description: 'Decorative QR code design for holiday ornaments or framed displays',
      preview: (
        <div className="w-full h-full bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-8 h-10 bg-white rounded-full shadow-sm border-4 border-rose-200 flex items-center justify-center">
            <div className="w-4 h-4 bg-rose-300 rounded-sm"></div>
          </div>
        </div>
      )
    },
  ],
  
  // Sections without templates - empty arrays
  our_story: [],
  first_date: [],
  special_moments: [],
  milestones: [],
  polaroid_gallery: [],
  playlist: [],
  video_memories: [],
  relationship_stats: [],
  anniversary_countdown: [],
  birthday_message: [],
  birthday_wishes: [],
  birthday_countdown: [],
  future_dreams: [],
  quotes: [],
  reasons_love_you: [],
  memory_map: [],
  guest_messages: [],
  letter_future: [],
  gift_section: [],
  surprise_message: [],
  birthday_timeline: [],
  party_details: [],
  gift_wishlist: [],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get metadata for a specific section
 */
export const getSectionMetadata = (section: Section): SectionMetadata | undefined => {
  return SECTION_REGISTRY[section];
};

/**
 * Get related section recommendations based on selected sections
 */
export const getRelatedSectionRecommendations = (selectedSections: Section[]): Section[] => {
  const recommended = new Set<Section>();

  selectedSections.forEach((section) => {
    const metadata = SECTION_REGISTRY[section];
    if (!metadata?.relatedSections) return;

    metadata.relatedSections.forEach((related) => {
      if (!selectedSections.includes(related)) {
        recommended.add(related);
      }
    });
  });

  return Array.from(recommended);
};

/**
 * Get available templates for a specific section
 */
export const getSectionTemplates = (section: Section): SectionTemplate[] => {
  const configTemplates = getTemplatesFromConfig(section);

  if (configTemplates.length > 0) {
    const normalizedTemplates = Array.from(configTemplates) as Array<{
      key: string;
      label: string;
      description: string;
    }>;

    return normalizedTemplates.map((template) => ({
      key: template.key,
      label: template.label,
      description: template.description,
      // Registry APIs expect React preview nodes, while templateConfig stores preview metadata.
      preview: (
        <div className="w-full h-full rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 px-1 text-center">
          {template.label}
        </div>
      ),
    }));
  }

  // If a section is mapped to templateConfig, treat that as authoritative and
  // do not silently fall back to duplicated legacy definitions.
  if (SECTION_TEMPLATE_MAP[section]) {
    return [];
  }

  return SECTION_TEMPLATES[section] || [];
};

/**
 * Get all sections that have templates
 */
export const getSectionsWithTemplates = (): Section[] => {
  return (Object.keys(SECTION_REGISTRY) as Section[]).filter((section) => getSectionTemplates(section).length > 0);
};

/**
 * Get all sections that require photos
 */
export const getSectionsRequiringPhotos = (enabledSections: Section[]): Section[] => {
  return enabledSections.filter(section => {
    const metadata = SECTION_REGISTRY[section];
    return metadata?.requiresPhotos;
  });
};

/**
 * Get all sections that require timeline events
 */
export const getSectionsRequiringTimeline = (enabledSections: Section[]): Section[] => {
  return enabledSections.filter(section => {
    const metadata = SECTION_REGISTRY[section];
    return metadata?.requiresTimeline || metadata?.requiresEvents;
  });
};

/**
 * Get all sections that should appear in layout selection
 */
export const getLayoutSections = (): Section[] => {
  return Object.values(SECTION_REGISTRY)
    .filter(section => section.hasLayoutOption)
    .map(section => section.key);
};

/**
 * Get all sections that should appear in memories step
 */
export const getMemoriesSections = (): Section[] => {
  return Object.values(SECTION_REGISTRY)
    .filter(section => section.hasMemoriesOption)
    .map(section => section.key);
};

/**
 * Get all sections that should appear in template selection
 */
export const getTemplateSections = (enabledSections: Section[]): Section[] => {
  return enabledSections.filter(section => {
    return getSectionTemplates(section).length > 0;
  });
};

/**
 * Get default enabled sections
 */
export const getDefaultSections = (): Section[] => {
  return Object.values(SECTION_REGISTRY)
    .filter(section => section.defaultEnabled)
    .map(section => section.key);
};

/**
 * Get required sections (cannot be disabled)
 */
export const getRequiredSections = (): Section[] => {
  return Object.values(SECTION_REGISTRY)
    .filter(section => section.required)
    .map(section => section.key);
};

/**
 * Get available sections for a specific occasion
 */
export const getAvailableSections = (occasion: OccasionType): Section[] => {
  return Object.values(SECTION_REGISTRY)
    .filter((section) => section.supportedOccasions?.includes(occasion))
    .map((section) => section.key);
};

/**
 * Validate section requirements based on form data
 */
export const validateSectionRequirements = (
  section: Section,
  form: { photos?: File[]; song_link?: string },
  config: { timeline_events?: { length: number }; section_content?: { timeline?: { length: number } } }
): { valid: boolean; error?: string } => {
  const metadata = SECTION_REGISTRY[section];
  
  if (!metadata) {
    return { valid: true }; // Unknown section, skip validation
  }
  
  if (metadata.requiresPhotos && (!form.photos || form.photos.length === 0)) {
    return { 
      valid: false, 
      error: `${metadata.title} section requires at least one photo` 
    };
  }
  
  if (metadata.requiresEvents && (!config.section_content?.timeline || config.section_content.timeline.length === 0)) {
    return { 
      valid: false, 
      error: `${metadata.title} section requires at least one event` 
    };
  }
  
  return { valid: true };
};

/**
 * Get template selection label for a section
 */
export const getSectionTemplateLabel = (section: Section): string => {
  const labels: Partial<Record<Section, string>> = {
    home: 'Home Template',
    gallery: 'Gallery Template',
    timeline: 'Timeline Template',
    song: 'Song Template',
    love_letter: 'Love Letter Template',
    qr_keepsake: 'QR Keepsake Template',
    // Default to "Section Template" for others
    our_story: 'Our Story Section',
    first_date: 'First Date Section',
    special_moments: 'Special Moments Section',
    milestones: 'Milestones Section',
    polaroid_gallery: 'Polaroid Gallery Section',
    playlist: 'Playlist Section',
    video_memories: 'Video Memories Section',
    relationship_stats: 'Relationship Stats Section',
    anniversary_countdown: 'Anniversary Countdown Section',
    birthday_message: 'Birthday Message Section',
    birthday_wishes: 'Birthday Wishes Section',
    birthday_countdown: 'Birthday Countdown Section',
    birthday_timeline: 'Birthday Timeline Section',
    party_details: 'Party Details Section',
    gift_wishlist: 'Gift Wishlist Section',
    future_dreams: 'Future Dreams Section',
    quotes: 'Love Quotes Section',
    reasons_love_you: 'Reasons I Love You Section',
    memory_map: 'Memory Map Section',
    guest_messages: 'Guest Messages Section',
    letter_future: 'Letter to Future Section',
    gift_section: 'Gift Section',
    surprise_message: 'Surprise Message Section',
    wedding_countdown: 'Wedding Countdown Section',
    event_details: 'Event Details Section',
    wedding_timeline: 'Wedding Timeline Section',
    gift_registry: 'Gift Registry Section',
    rsvp: 'RSVP Section',
    couple_message: 'Couple Message Section',
    graduation_message: 'Graduation Message Section',
    countdown: 'Countdown Section',
    school_memories: 'School Memories Section',
    achievements: 'Achievements Section',
    future_plans: 'Future Plans Section',
    baby_predictions: 'Baby Predictions Section',
    parents_message: 'Parents Message Section',
    photo_highlights: 'Photo Highlights Section',
    celebrant_message: 'Celebrant Message Section',
    life_story: 'Life Story Section',
    tributes: 'Tributes Section',
    family_message: 'Family Message Section',
    travel_timeline: 'Travel Timeline Section',
    travel_notes: 'Travel Notes Section',
    message_letter: 'Message Letter Section',
  };
  
  return labels[section] || `${section} Template`;
};

// ============================================
// BACKWARD COMPATIBILITY
// ============================================

/**
 * Convert new section_templates format to old format for API compatibility
 * This ensures backward compatibility with existing API
 */
export const normalizeConfigForAPI = (config: {
  section_templates?: Record<string, string>;
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  song_template?: string;
}): {
  home_template?: string;
  gallery_template?: string;
  timeline_template?: string;
  song_template?: string;
  section_templates?: Record<string, string>;
} => {
  // Start with old format values (from old fields)
  const result: Record<string, string> = {};
  
  // If old fields exist, use them
  if (config.home_template) result.home = config.home_template;
  if (config.gallery_template) result.gallery = config.gallery_template;
  if (config.timeline_template) result.timeline = config.timeline_template;
  if (config.song_template) result.song = config.song_template;
  
  // If new format exists, merge it (new takes precedence)
  if (config.section_templates) {
    Object.entries(config.section_templates).forEach(([key, value]) => {
      result[key] = value;
    });
  }
  
  return result;
};

/**
 * Get template for a specific section from config (supports both old and new formats)
 */
export const getSectionTemplate = (
  section: Section,
  config: {
    section_templates?: Record<string, string>;
    home_template?: string;
    gallery_template?: string;
    timeline_template?: string;
    song_template?: string;
  }
): string | undefined => {
  // Try new format first
  if (config.section_templates?.[section]) {
    return config.section_templates[section];
  }
  
  // Fall back to old format - check each legacy field
  switch (section) {
    case 'home':
      return config.home_template;
    case 'gallery':
      return config.gallery_template;
    case 'timeline':
      return config.timeline_template;
    case 'song':
      return config.song_template;
    default:
      return config.section_templates?.[section];
  }
};

/**
 * Set template for a specific section (stores in new format)
 */
export const setSectionTemplate = (
  section: Section,
  template: string,
  currentConfig: Record<string, unknown>
): Record<string, unknown> => {
  const section_templates = { ...(currentConfig.section_templates as Record<string, string> || {}) };
  section_templates[section] = template;
  
  return {
    ...currentConfig,
    section_templates,
  };
};

