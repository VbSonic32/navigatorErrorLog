import { NextRequest, NextResponse } from 'next/server';
import { getErrorLogs } from '@/lib/errorLogs';
import { ErrorLogQueryParams } from '@/types/errorLog';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const params: ErrorLogQueryParams = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      severity: searchParams.get('severity') || undefined,
      searchType:
        (searchParams.get('searchType') as ErrorLogQueryParams['searchType']) ||
        'details',
    };

    // Get error logs with filtering
    const errorLogs = await getErrorLogs(params);

    return NextResponse.json(errorLogs);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}
