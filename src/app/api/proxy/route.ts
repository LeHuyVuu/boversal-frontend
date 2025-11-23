import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const targetUrl = request.nextUrl.searchParams.get('url');
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing target URL', data: null, errors: ['url parameter is required'] },
        { status: 400 }
      );
    }

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    // Check if response has content
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : { success: false, message: 'Empty response', data: null };
    } catch (parseError) {
      console.error('[Proxy GET Parse Error]', parseError);
      data = { success: false, message: 'Invalid JSON response', data: null, errors: [text] };
    }
    
    // Create response with forwarded Set-Cookie headers
    const nextResponse = NextResponse.json(data);
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[Proxy GET Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed', 
        data: null, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: targetUrl, data: requestData } = body;
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing target URL', data: null, errors: ['url is required'] },
        { status: 400 }
      );
    }

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    // Check if response has content
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : { success: false, message: 'Empty response', data: null };
    } catch (parseError) {
      console.error('[Proxy POST Parse Error]', parseError);
      data = { success: false, message: 'Invalid JSON response', data: null, errors: [text] };
    }
    
    // Create response with forwarded Set-Cookie headers
    const nextResponse = NextResponse.json(data);
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[Proxy POST Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed', 
        data: null, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: targetUrl, data: requestData } = body;
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing target URL', data: null, errors: ['url is required'] },
        { status: 400 }
      );
    }

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    // Check if response has content
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : { success: false, message: 'Empty response', data: null };
    } catch (parseError) {
      console.error('[Proxy PUT Parse Error]', parseError);
      data = { success: false, message: 'Invalid JSON response', data: null, errors: [text] };
    }
    
    // Create response with forwarded Set-Cookie headers
    const nextResponse = NextResponse.json(data);
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[Proxy PUT Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed', 
        data: null, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const targetUrl = request.nextUrl.searchParams.get('url');
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing target URL', data: null, errors: ['url parameter is required'] },
        { status: 400 }
      );
    }

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    // Check if response has content
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : { success: true, message: 'Deleted successfully', data: null };
    } catch (parseError) {
      console.error('[Proxy DELETE Parse Error]', parseError);
      data = { success: false, message: 'Invalid JSON response', data: null, errors: [text] };
    }
    
    // Create response with forwarded Set-Cookie headers
    const nextResponse = NextResponse.json(data);
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[Proxy DELETE Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed', 
        data: null, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: targetUrl, data: requestData } = body;
    
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing target URL', data: null, errors: ['url is required'] },
        { status: 400 }
      );
    }

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(targetUrl, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    // Check if response has content
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : { success: false, message: 'Empty response', data: null };
    } catch (parseError) {
      console.error('[Proxy PATCH Parse Error]', parseError);
      data = { success: false, message: 'Invalid JSON response', data: null, errors: [text] };
    }
    
    // Create response with forwarded Set-Cookie headers
    const nextResponse = NextResponse.json(data);
    
    // Forward Set-Cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('[Proxy PATCH Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed', 
        data: null, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}
