"use client";
import { formatActivity } from "@/lib/services/formatActivity";
import { getRecentActivities } from "@/lib/services/getActivities";
import { useEffect, useState } from "react";
import {
    Clock,
    Activity as ActivityIcon
} from "lucide-react";
import { getActivityColor, getActivityIcon } from "@/lib/services/logActivity";
import { useTranslation } from "react-i18next";



export default function RecentActivity({ userId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        if (!userId) return;

        async function fetchActivities() {
            const data = await getRecentActivities(userId);
            setActivities(data);
            setLoading(false);
        }

        fetchActivities();
    }, [userId]);

    return (
        <div className="w-full p-2">
           

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <ActivityIcon className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-500 font-medium">{t('dashboard.activity.loadingActivities')}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && activities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <ActivityIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                       {t('dashboard.activity.noRecentActivity')}
                    </h3>
                    <p className="text-sm text-gray-500">
                         {t('dashboard.activity.noRecentActivitDesc')}
                    </p>
                </div>
            )}

            {/* Activity List */}
            {!loading && activities.length > 0 && (
                <div className="space-y-3">
                    {activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.action, activity.entity);
                        const colorClass = getActivityColor(activity.action);
                        const timestamp = activity.createdAt?.toDate
                            ? activity.createdAt.toDate()
                            : new Date();

                        return (
                            <div
                                key={activity.id || index}
                                className="group bg-card w-full rounded-md  p-4  hover:shadow-lg hover:border-gray-300 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start gap-4 relative">
                                   
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${colorClass}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>

                                   
                                    <div className="flex-1 min-w-0">
                                       
                                        <p className="text-base font-medium dark:text-gray-200 text-gray-900 mb-1">
                                            {formatActivity(activity)}
                                        </p>

                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <time dateTime={timestamp.toISOString()}>
                                                    {new Intl.RelativeTimeFormat("en", {
                                                        numeric: "auto",
                                                    }).format(
                                                        Math.ceil(
                                                            (timestamp - new Date()) / (1000 * 60 * 60 * 24)
                                                        ),
                                                        "day"
                                                    )}
                                                </time>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-indigo-900 font-medium px-2 py-0.5 bg-indigo-300 rounded-full">
                                                {activity.entity}
                                            </span>
                                        </div>

                                        
                                        <p className="text-xs text-gray-400 mt-2  transition-opacity">
                                            {timestamp.toLocaleString("en-US", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </p>
                                    </div>

                                  
                                    <div className="absolute bottom-0 right-0">
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}
                                        >
                                            {activity.action}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}