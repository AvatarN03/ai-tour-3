"use client";

import { Button } from "@/components/ui/button";

export default function FormActions({ loading, onSubmit, onReset }) {
  return (
    <div className="flex flex-row justify-start md:justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="destructive"
        disabled={loading}
        className="sm:min-w-[140px] h-12 text-base font-medium"
        onClick={onReset}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={loading}
        className="sm:min-w-[180px] h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
        onClick={onSubmit}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating Trip...</span>
          </div>
        ) : (
          <div className="flex text-white items-center justify-center space-x-2">
            <span>✈️</span>
            <span>Create Trip</span>
          </div>
        )}
      </Button>
    </div>
  );
}
