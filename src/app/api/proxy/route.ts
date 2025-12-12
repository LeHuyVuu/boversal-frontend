import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const endpoint = request.nextUrl.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing endpoint', data: null, errors: ['endpoint parameter is required'] },
        { status: 400 }
      );
    }

    // Construct backend URL server-side (hidden from client)
    const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';
    const targetUrl = `${GATEWAY_URL}${PROJECT_SERVICE}${endpoint}`;

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    // Log for server-side troubleshooting (backend URL never sent to client)
    console.debug('[Proxy GET] endpoint:', endpoint, '→ targetUrl:', targetUrl);

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
    console.error('[Proxy GET Error]', error, (error as any)?.stack);
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
    const { endpoint, data: requestData } = body;
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing endpoint', data: null, errors: ['endpoint is required'] },
        { status: 400 }
      );
    }

    // Construct backend URL server-side (hidden from client)
    const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';
    const targetUrl = `${GATEWAY_URL}${PROJECT_SERVICE}${endpoint}`;

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    console.debug('[Proxy POST] endpoint:', endpoint, '→ targetUrl:', targetUrl, 'body:', requestData ? '[present]' : '[empty]');

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    console.debug('[Proxy POST] Response status:', response.status, 'statusText:', response.statusText);

    // Check if response has content
    const text = await response.text();
    console.debug('[Proxy POST] Response text:', text ? `${text.substring(0, 200)}...` : '[empty]');
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
    console.error('[Proxy POST Error]', error, (error as any)?.stack);
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
    const { endpoint, data: requestData } = body;
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing endpoint', data: null, errors: ['endpoint is required'] },
        { status: 400 }
      );
    }

    // Construct backend URL server-side (hidden from client)
    const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';
    const targetUrl = `${GATEWAY_URL}${PROJECT_SERVICE}${endpoint}`;

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    console.debug('[Proxy PUT] endpoint:', endpoint, '→ targetUrl:', targetUrl, 'body:', requestData ? '[present]' : '[empty]');

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
    console.error('[Proxy PUT Error]', error, (error as any)?.stack);
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
    const endpoint = request.nextUrl.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing endpoint', data: null, errors: ['endpoint parameter is required'] },
        { status: 400 }
      );
    }

    // Construct backend URL server-side (hidden from client)
    const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
    const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';
    const targetUrl = `${GATEWAY_URL}${PROJECT_SERVICE}${endpoint}`;

    // Forward cookies from the client request
    const cookies = request.headers.get('cookie');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    console.debug('[Proxy DELETE] endpoint:', endpoint, '→ targetUrl:', targetUrl);

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
    console.error('[Proxy DELETE Error]', error, (error as any)?.stack);
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

    console.debug('[Proxy PATCH] targetUrl:', targetUrl, 'body:', requestData ? '[present]' : '[empty]');

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
    console.error('[Proxy PATCH Error]', error, (error as any)?.stack);
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
