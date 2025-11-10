/**
 * Cloudflare Pages Function - Email Subscription Handler
 * Handles POST requests to /api/subscribe
 * Stores email addresses in Cloudflare D1 database
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main handler function
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // Get form data
    const formData = await request.formData();
    const email = formData.get('email')?.trim().toLowerCase();
    const source = formData.get('source') || 'unknown';

    // Validate email
    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email address is required.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please enter a valid email address.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get client information
    const ipAddress = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    // Insert into database
    try {
      const stmt = env.DB.prepare(
        'INSERT INTO emails (email, source, ip_address, user_agent) VALUES (?, ?, ?, ?)'
      );

      await stmt.bind(email, source, ipAddress, userAgent).run();

      return new Response(JSON.stringify({
        success: true,
        message: 'Thanks for joining! Check your email for your free guide.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (dbError) {
      // Check if it's a duplicate email error
      if (dbError.message && dbError.message.includes('UNIQUE constraint failed')) {
        return new Response(JSON.stringify({
          success: false,
          message: 'This email is already on the waitlist!'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Log other database errors
      console.error('Database error:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Subscription error:', error);

    return new Response(JSON.stringify({
      success: false,
      message: 'Something went wrong. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
