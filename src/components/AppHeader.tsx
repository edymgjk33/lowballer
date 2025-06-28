
import React from 'react';
import { DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AppHeader = () => {
  return (
    <div className="bg-white border-b border-green-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lowbal</h1>
              <p className="text-sm text-gray-600">AI-Powered Negotiation Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
