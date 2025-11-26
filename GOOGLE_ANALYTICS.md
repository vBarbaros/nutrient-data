# Google Analytics Setup

## Implementation

Added Google Analytics 4 (GA4) tracking to the project by inserting the gtag.js script in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Note:** Replace `G-XXXXXXXXXX` with your actual Measurement ID from Google Analytics.

## Finding Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click Admin (gear icon) in the bottom left
3. Select your property
4. Go to Data Streams → Select your web stream
5. Copy the Measurement ID (format: `G-XXXXXXXXXX`)

## When to Expect Data

- **Real-time data**: Appears within minutes after deployment
- **Full reports**: Available within 24-48 hours
- **Historical data**: Starts accumulating from the moment tracking is deployed

## Current Tracking

The basic implementation tracks:
- Page views
- User sessions
- Geographic location
- Device type (desktop/mobile/tablet)
- Browser and OS
- Traffic sources

## Future Improvements

### 1. Event Tracking
Track user interactions:
```javascript
// Track when users compare items
gtag('event', 'compare_items', {
  'item_count': compareItems.length
});

// Track when users toggle combined mode
gtag('event', 'toggle_combined_mode', {
  'enabled': combinedMode
});

// Track which food items are most viewed
gtag('event', 'view_item', {
  'item_name': selected
});
```

### 2. Custom Dimensions
Add custom data to understand user behavior:
- Most compared food combinations
- Average serving sizes selected
- Daily needs toggle usage

### 3. Enhanced Measurement
Enable in GA4 settings:
- Scroll tracking
- Outbound link clicks (for sources/references)
- File downloads (if you add PDF exports)

### 4. Conversion Goals
Set up goals to track:
- Users who compare 3+ items
- Users who use combined mode
- Time spent on site
- Return visitors

### 5. Privacy Considerations
Consider adding:
- Cookie consent banner
- Privacy policy page
- Option to opt-out of tracking
- Anonymize IP addresses (already default in GA4)

## Testing

To verify tracking is working:
1. Visit your deployed site
2. Go to Google Analytics → Reports → Realtime
3. You should see your visit appear within 30 seconds

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [Event Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Custom Dimensions](https://support.google.com/analytics/answer/10075209)
