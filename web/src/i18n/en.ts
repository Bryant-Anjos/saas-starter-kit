const en = {
  app: { name: 'Starter App' },
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    confirm: 'Confirm',
    back: 'Back',
    close: 'Close',
    submit: 'Submit',
    yes: 'Yes',
    no: 'No',
    unknown: 'Unknown',
    error: 'Something went wrong. Please try again.',
  },
  profile: {
    display_name: 'Display name',
    display_name_placeholder: 'Your name',
    add_name: 'Add your name',
    add_name_hint: 'Set a display name so others can recognise you.',
    saved: 'Name saved',
    your_account: 'Your account',
    delete_account: 'Delete account',
    delete_account_confirm: 'This will permanently delete your account. This cannot be undone.',
    deleting: 'Deleting...',
  },
  auth: {
    email: 'Email address',
    email_placeholder: 'you@example.com',
    send_link: 'Send magic link',
    link_sent: 'Check your inbox! A sign-in link has been sent to {{email}}.',
    link_sent_dev: 'Development mode: check the API console for the magic link.',
    verifying: 'Signing you in…',
    invalid_token: 'This sign-in link is invalid.',
    expired_token: 'This sign-in link has expired. Please request a new one.',
    token_already_used: 'This sign-in link has already been used. Please request a new one, or check if you are already signed in on another tab.',
    sign_out: 'Sign out',
    tagline: 'Sign in to get started',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back{{name}}!',
    welcome_unnamed: 'Welcome back!',
    subtitle: 'This is your dashboard. Add your features here.',
  },
  settings: {
    profile: 'Profile',
    display_name: 'Display name',
    language: 'Language',
    language_en: 'English',
    language_ptBR: 'Português (Brasil)',
    profile_saved: 'Profile saved',
  },
  privacy: {
    title: 'Privacy Policy | Starter App',
    heading: 'Privacy Policy',
    last_updated: 'Last updated: {{date}}',
    intro:
      'This policy explains what information we collect, why we collect it, and how we use it.',
    data_title: 'Information We Collect',
    email_title: 'Email address',
    email_text:
      'Your email address is used to identify your account and to send sign-in links. We do not use it for marketing.',
    name_title: 'Display name',
    name_text: 'If you choose to set a display name, it is stored and associated with your account. It is optional.',
    auth_title: 'Authentication tokens',
    auth_text:
      'We store short-lived sign-in tokens (magic links) that expire after 15 minutes. Session tokens expire after 30 days.',
    email_delivery_title: 'Email delivery',
    email_delivery_text:
      'Emails are sent via a third-party email provider. We only share your email address with this provider for delivery purposes.',
    retention_title: 'Data retention',
    retention_text:
      'Your data is retained as long as your account exists. You can delete your account at any time from the account menu in the top navigation.',
    contact_title: 'Contact',
    contact_text: 'For questions about this policy, please contact the application administrator.',
  },
  terms: {
    title: 'Terms of Service | Starter App',
    heading: 'Terms of Service',
    last_updated: 'Last updated: {{date}}',
    intro:
      'By using this application, you agree to these terms.',
    service_title: 'Service',
    service_text: 'This application is provided as-is, with no warranties of any kind.',
    availability_title: 'Availability',
    availability_text:
      'We do not guarantee uptime, availability, or continuity of the service. The service may be modified, paused, or discontinued at any time.',
    responsibility_title: 'Your responsibility',
    responsibility_text:
      'You are responsible for maintaining the confidentiality of your sign-in links and for all activity under your account.',
    acceptable_use_title: 'Acceptable use',
    acceptable_use_text:
      "You agree not to use this application for any unlawful purpose, to harass other users, or to attempt to circumvent the application's security.",
    liability_title: 'Limitation of liability',
    liability_text:
      'To the fullest extent permitted by applicable law, the application and its contributors shall not be liable for any damages arising from your use of or inability to use the service.',
    contact_title: 'Contact',
    contact_text: 'For questions about these terms, please contact the application administrator.',
  },
  support: {
    page_title: 'Support | Starter App',
    title: 'Support This Project',
    message:
      'If you enjoy using this application, a small contribution helps keep it running. Thank you!',
    pix_title: 'PIX',
    pix_desc: 'Use your bank app to scan the QR code or copy the key below.',
    pix_copy: 'Copy PIX key',
    pix_copied: 'Copied!',
    bmc_title: 'Buy Me a Coffee',
    bmc_desc: 'Support the project via Buy Me a Coffee.',
    bmc_button: 'Buy Me a Coffee',
    bitcoin_title: 'Bitcoin',
    bitcoin_desc: 'Send Bitcoin to the address below.',
    bitcoin_copy: 'Copy address',
    bitcoin_copied: 'Copied!',
  },
  footer: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    support: 'Support',
    copyright: '© {{year}} Starter App',
    nav_label: 'Legal',
  },
  a11y: {
    skip_to_content: 'Skip to main content',
  },
} as const

export default en
export type Translations = typeof en
