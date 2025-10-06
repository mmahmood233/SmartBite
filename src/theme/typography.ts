import { Typography } from '../types';

/**
 * Wajba Design System - Typography
 * Fonts: Poppins (headings, buttons), Inter (body, captions)
 */

export const typography: Typography = {
  headline: {
    // fontFamily: 'Poppins-SemiBold', // TODO: Add custom fonts
    fontSize: 28,
    fontWeight: '600',  // SemiBold
    lineHeight: 36,
  },
  subheader: {
    // fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    fontWeight: '600',  // SemiBold
    lineHeight: 28,
  },
  body: {
    // fontFamily: 'Inter-Regular',
    fontSize: 15,       // Wajba spec: 15px
    fontWeight: '400',  // Regular
    lineHeight: 22,
  },
  caption: {
    // fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400',  // Regular
    lineHeight: 16,
  },
  button: {
    // fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontWeight: '600',  // SemiBold
  },
};
