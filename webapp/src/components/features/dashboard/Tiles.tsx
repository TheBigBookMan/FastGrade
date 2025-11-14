import {Link} from 'react-router-dom';
import LoadingSpinner from "../../common/layout/LoadingSpinner.tsx";
import {Category} from "../../../types/categoryTypes.ts";

interface TilesInterface {
    apiComments: Comment[];
    commentsLoad: boolean;
    apiCategories: Category[];
    categoriesLoad: boolean;
}

const Tiles = ({apiComments, commentsLoad, apiCategories, categoriesLoad}: TilesInterface) => {

    return (
        <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold mb-4 text-secondary-900">Dashboard</h2>
            <p className="text-secondary-600">
                Welcome to QuickNote! This is your dashboard.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link to={'/comments'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition">
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
                </Link>

                <Link to={'/categories'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition">
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
                </Link>

                <Link to={'/attachments'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition">
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
                </Link>
            </div>
        </div>
    )
}

export default Tiles;