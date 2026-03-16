
"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/useAuth";

import { getRecentActivities } from "@/lib/services/getActivities";
import { getActivityColor } from "@/lib/services/logActivity";
import { formatActivity } from "@/lib/services/formatActivity";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ActivityIcon, Clock, Loader } from "lucide-react";

export const Notification = ({ children }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { user: { uid: userId } } = useAuth();

    useEffect(() => {
        if (!userId || !open) return;

        async function fetchActivities() {
            setLoading(true);
            const data = await getRecentActivities(userId);
            setActivities(data);
            setLoading(false);
        }

        fetchActivities();
    }, [userId, open]);  

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                className="w-auto md:w-64 h-104 overflow-y-auto p-2 rounded-md bg-slate-50 dark:bg-card scrollbar-gradient"
            >
                {loading ? (
                    <div className="flex justify-center items-center w-16 h-16">
                        <Loader className="w-6 h-6 animate-spin" />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <ActivityIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                            No recent activity
                        </h3>
                        <p className="text-sm text-gray-500">
                            Your activity will appear here once you start creating content
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h1 className="pb-1 text-sm border-b-2">
                            Recent Activity
                        </h1>

                        {activities.map((activity, index) => {
                            const colorClass = getActivityColor(activity.action);
                            const timestamp = activity.createdAt?.toDate
                                ? activity.createdAt.toDate()
                                : new Date();

                            return (
                                <div
                                    key={activity.id || index}
                                    className="group bg-sidebar rounded-sm p-1 hover:shadow-lg border-b-2 border-sidebar-accent"
                                >
                                    <div className="flex items-start gap-2">
                                        <div>
                                            <p className="text-xs font-medium dark:text-gray-200 text-gray-900 mb-1">
                                                {formatActivity(activity)}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    <time dateTime={timestamp.toISOString()}>
                                                        {timestamp.toLocaleDateString()}
                                                    </time>
                                                </div>

                                                <span className="text-[10px] text-indigo-900 font-medium p-1 bg-indigo-300 rounded-full">
                                                    {activity.entity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <span
                                                className={`text-[12px] font-semibold p-1 rounded-full ${colorClass}`}
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
            </PopoverContent>
        </Popover>
    );
};