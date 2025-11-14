import Header from '../components/common/layout/header/Header';
import {useAuth} from "../contexts/AuthContext.tsx";
import {useCategories} from "../hooks/useCategory.ts";
import {useComments} from "../hooks/useComment.ts";
import {useState} from "react";
import LoadingSpinner from "../components/common/layout/LoadingSpinner.tsx";

const DashboardPage = () => {
    const {user} = useAuth();
    if(!user) return;

    const {data: apiCategories = [], isLoading: categoriesLoad, error: categoriesError} = useCategories(user.id);
    const {data: apiComments = [], isLoading: commentsLoad, error: commentsError} = useComments(user.id);

    return (
        <div className="min-h-screen bg-secondary-50">
            <Header />
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h2 className="text-2xl font-bold mb-4 text-secondary-900">Dashboard</h2>
                    <p className="text-secondary-600">
                        Welcome to QuickNote! This is your dashboard.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-primary-500 rounded-md"></div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-secondary-500 truncate">
                                                Comments
                                            </dt>

                                            {commentsLoad ? (
                                                <div className="container mx-auto">
                                                    <LoadingSpinner />
                                                </div>
                                            ) : (
                                                <dd className="text-lg font-medium text-secondary-900">
                                                    {apiComments && apiComments.length}
                                                </dd>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-info-500 rounded-md"></div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-secondary-500 truncate">
                                                Categories
                                            </dt>
                                            {categoriesLoad ? (
                                                <div className="container mx-auto">
                                                    <LoadingSpinner />
                                                </div>
                                            ) : (
                                                <dd className="text-lg font-medium text-secondary-900">
                                                    {apiCategories && apiCategories.length}
                                                </dd>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-secondary-500 rounded-md"></div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-secondary-500 truncate">
                                                Attachments
                                            </dt>
                                            <dd className="text-lg font-medium text-secondary-900">
                                                0
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;