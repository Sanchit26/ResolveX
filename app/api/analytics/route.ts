import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const department = searchParams.get('department');

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Build filter
    const filter: any = {
      dateFiled: { $gte: daysAgo }
    };
    if (department) filter.department = department;

    // Get basic statistics
    const totalComplaints = await Complaint.countDocuments(filter);
    const pendingComplaints = await Complaint.countDocuments({ ...filter, status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ ...filter, status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ ...filter, status: 'Resolved' });
    const escalatedComplaints = await Complaint.countDocuments({ ...filter, status: 'Escalated' });

    // Get priority distribution
    const priorityStats = await Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Get department distribution
    const departmentStats = await Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get sentiment analysis
    const sentimentStats = await Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    // Get average response time
    const responseTimeStats = await Complaint.aggregate([
      { $match: { ...filter, responseTime: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
    ]);

    // Get trending keywords
    const keywordStats = await Complaint.aggregate([
      { $match: filter },
      { $unwind: '$keywords' },
      { $group: { _id: '$keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get daily complaint trends
    const dailyTrends = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$dateFiled' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate satisfaction score
    const satisfactionStats = await Complaint.aggregate([
      { $match: { ...filter, satisfaction: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgSatisfaction: { $avg: '$satisfaction' } } }
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        period: `${period} days`,
        totalComplaints,
        statusDistribution: {
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          escalated: escalatedComplaints,
        },
        priorityDistribution: priorityStats,
        departmentDistribution: departmentStats,
        sentimentDistribution: sentimentStats,
        averageResponseTime: responseTimeStats[0]?.avgResponseTime || 0,
        trendingKeywords: keywordStats,
        dailyTrends,
        averageSatisfaction: satisfactionStats[0]?.avgSatisfaction || 0,
        resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
